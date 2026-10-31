import type { CalendarEvent, EventLocation } from '../types/event.js';

/**
 * Events are kept in a Google Sheet with two tabs, each published to the web as
 * CSV. "Events" lists events we organize or announce; "Lichess prizes" adds
 * prizes and entry fees to Lichess tournaments by their link. See docs/events-sheet.md.
 */

export type Extras = Pick<CalendarEvent, 'prizes' | 'entryFee'>;
export type SheetProblem = { tab: 'Events' | 'Lichess prizes'; row: number; message: string };
export type SheetEvents = {
	events: CalendarEvent[];
	/** Prizes and entry fees for Lichess tournaments, keyed by event ID such as `lichess-arena-pU7LJr6J`. */
	extras: Map<string, Extras>;
	problems: SheetProblem[];
	state: 'ready' | 'error';
};

const offset = '+03:00';
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const maxBytes = 1_000_000;

/** RFC 4180 CSV: quoted fields may hold commas, quotes ("") and line breaks. */
export function parseCSV(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let quoted = false;
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index++;
			} else if (char === '"') quoted = false;
			else field += char;
		} else if (char === '"') quoted = true;
		else if (char === ',') {
			row.push(field);
			field = '';
		} else if (char === '\n' || char === '\r') {
			if (char === '\r' && text[index + 1] === '\n') index++;
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else field += char;
	}
	if (field || row.length) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

const key = (header: string) => header.trim().toLowerCase().replace(/\s+/g, ' ');

/** Rows as records keyed by lower-case header, with their row number in the sheet. Blank rows are skipped. */
function records(text: string) {
	const [header = [], ...rows] = parseCSV(text);
	const names = header.map(key);
	return rows.flatMap((cells, index) =>
		cells.some((cell) => cell.trim())
			? [
					{
						row: index + 2,
						get: (name: string) => cells[names.indexOf(name)]?.trim() ?? ''
					}
				]
			: []
	);
}

const pad = (value: number) => String(value).padStart(2, '0');
const validDay = (year: number, month: number, day: number) => {
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};
const monthIndex = (name: string) => months.indexOf(name.slice(0, 3).toLowerCase()) + 1;

/** "2026-11-01" or "1 Nov 2026" → a day; "2026-11" or "Nov 2026" → a month. Slashed dates are ambiguous and rejected. */
export function parseDate(value: string): { day: string } | { month: string } | null {
	let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
	if (match) {
		const [year, month, day] = match.slice(1).map(Number);
		return validDay(year, month, day) ? { day: `${year}-${pad(month)}-${pad(day)}` } : null;
	}
	match = /^(\d{4})-(\d{1,2})$/.exec(value);
	if (match && Number(match[2]) >= 1 && Number(match[2]) <= 12)
		return { month: `${match[1]}-${pad(Number(match[2]))}` };
	match = /^(?:[a-z]+,?\s+)?(\d{1,2})\s+([a-z]{3,9})\.?\s+(\d{4})$/i.exec(value);
	if (match && monthIndex(match[2])) {
		const [day, month, year] = [Number(match[1]), monthIndex(match[2]), Number(match[3])];
		return validDay(year, month, day) ? { day: `${year}-${pad(month)}-${pad(day)}` } : null;
	}
	match = /^([a-z]{3,9})\.?\s+(\d{4})$/i.exec(value);
	if (match && monthIndex(match[1])) return { month: `${match[2]}-${pad(monthIndex(match[1]))}` };
	return null;
}

/** "19:00", "19:00:00", "7:00 PM" or "7 pm" → "19:00". */
export function parseTime(value: string): string | null {
	const match = /^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*([ap]\.?m\.?)?$/i.exec(value);
	if (!match) return null;
	let hour = Number(match[1]);
	const minute = Number(match[2] ?? 0);
	const period = match[3]?.toLowerCase()[0];
	if (period) {
		if (hour < 1 || hour > 12) return null;
		hour = (hour % 12) + (period === 'p' ? 12 : 0);
	} else if (match[2] === undefined) return null;
	return hour < 24 && minute < 60 ? `${pad(hour)}:${pad(minute)}` : null;
}

/** "50,000", "50 000" or "TZS 50,000" → 50000. */
export function parseAmount(value: string): number | null {
	const digits = value.replace(/^[A-Z]{3}\s*/i, '').replace(/[,\s]/g, '');
	return /^\d+(\.\d+)?$/.test(digits) ? Number(digits) : null;
}

/** "1st place: 50,000; 2nd place: 30,000", one award per line or separated by semicolons. */
export function parsePrizes(value: string): { category: string; amount: number }[] | null {
	const awards = value
		.split(/[;\n]/)
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => {
			const split = part.lastIndexOf(':');
			const category = part.slice(0, split).trim();
			const amount = split > 0 ? parseAmount(part.slice(split + 1).trim()) : null;
			return category && category.length <= 100 && amount !== null ? { category, amount } : null;
		});
	return awards.every(Boolean) ? (awards as { category: string; amount: number }[]) : null;
}

const https = (value: string) => {
	try {
		return new URL(value).protocol === 'https:' ? value : null;
	} catch {
		return null;
	}
};

/** A Lichess tournament or Swiss link → its event ID, matching the Go API's IDs. */
export function lichessEventID(link: string): string | null {
	const match = /^https:\/\/lichess\.org\/(tournament|swiss)\/([A-Za-z0-9]{8})(?:[/?#].*)?$/.exec(
		link.trim()
	);
	return match ? `lichess-${match[1] === 'swiss' ? 'swiss' : 'arena'}-${match[2]}` : null;
}

class RowError extends Error {}

function costs(get: (name: string) => string): Extras {
	const currencyCell = get('currency').toUpperCase();
	if (currencyCell && currencyCell !== 'TZS' && currencyCell !== 'USD')
		throw new RowError('Currency must be TZS or USD.');
	const currency = currencyCell || 'TZS';
	const prizeCell = get('prizes');
	const awards = prizeCell ? parsePrizes(prizeCell) : [];
	if (!awards) throw new RowError('Write prizes as "1st place: 50,000; 2nd place: 30,000".');
	const feeCell = get('entry fee');
	const fee = feeCell ? (/^free$/i.test(feeCell) ? 0 : parseAmount(feeCell)) : null;
	if (feeCell && fee === null) throw new RowError('Entry fee must be a number, 0 or Free.');
	return {
		...(awards.length ? { prizes: { currency, awards } } : {}),
		...(fee !== null ? { entryFee: { currency, amount: fee } } : {})
	};
}

const slugify = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80) || 'event';

function parseEventRow(get: (name: string) => string): CalendarEvent | null {
	if (/^no$/i.test(get('show'))) return null;
	const name = get('name');
	if (!name) throw new RowError('Add a name.');
	if (name.length > 200) throw new RowError('The name is longer than 200 characters.');

	const when = parseDate(get('date'));
	if (!when)
		throw new RowError('Write the date as 2026-11-01 or 1 Nov 2026, or Nov 2026 for a month.');
	let date: CalendarEvent['date'];
	let startsAt: string | undefined;
	let endsAt: string | undefined;
	const [lastDayCell, startCell, endCell] = [get('last day'), get('start time'), get('end time')];
	if ('month' in when) {
		if (lastDayCell || startCell || endCell)
			throw new RowError('A month-only date cannot have a last day or times.');
		date = { month: when.month };
	} else {
		const last = lastDayCell ? parseDate(lastDayCell) : null;
		if (lastDayCell && (!last || !('day' in last)))
			throw new RowError('Write the last day as 2026-11-03 or 3 Nov 2026.');
		if (last && 'day' in last && last.day < when.day)
			throw new RowError('The last day is before the date.');
		date =
			last && 'day' in last && last.day > when.day
				? { start: when.day, end: last.day }
				: { start: when.day };
		const start = startCell ? parseTime(startCell) : null;
		if (startCell && !start) throw new RowError('Write the start time as 19:00.');
		const end = endCell ? parseTime(endCell) : null;
		if (endCell && !end) throw new RowError('Write the end time as 21:00.');
		if (end && !start) throw new RowError('Add a start time before the end time.');
		if (start) {
			startsAt = `${when.day}T${start}:00${offset}`;
			if (end) {
				endsAt = `${date.end ?? when.day}T${end}:00${offset}`;
				if (Date.parse(endsAt) <= Date.parse(startsAt))
					throw new RowError('The end time is before the start time.');
			}
		}
	}

	const type = get('type').toLowerCase();
	let location: EventLocation;
	if (type === 'online') {
		const platformCell = get('platform');
		const platform = /^lichess$/i.test(platformCell)
			? 'Lichess'
			: /^chess\.?com$/i.test(platformCell)
				? 'Chess.com'
				: undefined;
		if (platformCell && !platform) throw new RowError('Platform must be Lichess or Chess.com.');
		const linkCell = get('tournament link');
		const url = linkCell ? https(linkCell) : null;
		if (linkCell && !url) throw new RowError('The tournament link must start with https://.');
		location = { kind: 'online', platform, url: url ?? undefined };
	} else if (type === 'otb' || type === 'over the board') {
		const rated = get('fide rated').toLowerCase();
		if (rated && rated !== 'yes' && rated !== 'no')
			throw new RowError('FIDE rated must be yes, no or empty.');
		const linkCell = get('registration link');
		const registrationUrl = linkCell ? https(linkCell) : null;
		if (linkCell && !registrationUrl)
			throw new RowError('The registration link must start with https://.');
		location = {
			kind: 'otb',
			venue: get('venue') || undefined,
			city: get('city') || undefined,
			fideRated: rated ? rated === 'yes' : undefined,
			registrationUrl: registrationUrl ?? undefined
		};
	} else throw new RowError('Type must be OTB or Online.');

	const status = get('status').toLowerCase();
	if (status && !['scheduled', 'postponed', 'cancelled', 'canceled'].includes(status))
		throw new RowError('Status must be empty, Postponed or Cancelled.');

	const day = 'month' in date ? date.month : date.start;
	return {
		id: `sheet-${slugify(name)}-${day}`,
		slug: `${slugify(name)}-${day}`,
		source: 'community',
		name,
		date,
		...(startsAt ? { startsAt } : {}),
		...(endsAt ? { endsAt } : {}),
		location,
		...(status === 'postponed'
			? { status: 'postponed' as const }
			: status.startsWith('cancel')
				? { status: 'cancelled' as const }
				: {}),
		format: get('format') || undefined,
		timeControl: get('time control') || undefined,
		...costs(get)
	};
}

/** The Events tab. Invalid rows are skipped and reported; hidden rows (Show: no) are left out. */
export function parseEventsTab(text: string): {
	events: CalendarEvent[];
	problems: SheetProblem[];
} {
	const events: CalendarEvent[] = [];
	const problems: SheetProblem[] = [];
	const ids = new Set<string>();
	for (const { row, get } of records(text)) {
		try {
			const event = parseEventRow(get);
			if (!event) continue;
			// Two events with the same name on the same day stay distinct.
			let id = event.id;
			for (let copy = 2; ids.has(id); copy++) id = `${event.id}-${copy}`;
			ids.add(id);
			events.push({ ...event, id });
		} catch (error) {
			if (!(error instanceof RowError)) throw error;
			problems.push({ tab: 'Events', row, message: error.message });
		}
	}
	return { events, problems };
}

/** The Lichess prizes tab: a tournament link with its prizes and entry fee. */
export function parsePrizesTab(text: string): {
	extras: Map<string, Extras>;
	problems: SheetProblem[];
} {
	const extras = new Map<string, Extras>();
	const problems: SheetProblem[] = [];
	for (const { row, get } of records(text)) {
		try {
			const id = lichessEventID(get('tournament link'));
			if (!id)
				throw new RowError(
					'Paste the Lichess link, such as https://lichess.org/tournament/pU7LJr6J.'
				);
			if (extras.has(id)) throw new RowError('This tournament is already listed above.');
			extras.set(id, costs(get));
		} catch (error) {
			if (!(error instanceof RowError)) throw error;
			problems.push({ tab: 'Lichess prizes', row, message: error.message });
		}
	}
	return { extras, problems };
}

/** Adds prizes and entry fees from the sheet to the matching Lichess tournaments. */
export const withExtras = (events: CalendarEvent[], extras: Map<string, Extras>) =>
	extras.size
		? events.map((event) => {
				const added = extras.get(event.id);
				return added ? { ...event, ...added } : event;
			})
		: events;

async function download(url: string, fetcher: typeof fetch) {
	const response = await fetcher(url, {
		signal: AbortSignal.timeout(5000),
		headers: { Accept: 'text/csv' }
	});
	if (!response.ok) throw new Error(`Sheet returned ${response.status}`);
	const text = await response.text();
	if (text.length > maxBytes) throw new Error('Sheet is larger than 1 MB');
	// A sheet that is not published returns Google's sign-in page instead of CSV.
	if (/^\s*</.test(text)) throw new Error('Sheet is not published as CSV');
	return text;
}

/** Visitors share one copy for a minute, so traffic never reaches Google directly. */
const freshFor = 60_000;
/** After a failure, the last good copy is kept for a day before the calendar reports an error. */
const keepFor = 24 * 60 * 60 * 1000;
type Saved = Omit<SheetEvents, 'state'>;
let cache: { source: string; at: number; value: Saved } | null = null;
let pending: Promise<Saved> | null = null;

/** For tests. */
export const clearSheetCache = () => {
	cache = null;
	pending = null;
};

/** Both tabs, cached and shared by all visitors. Concurrent requests share a single download. */
export async function readSheetEvents(
	urls: { events: string | undefined; prizes: string | undefined },
	fetcher: typeof fetch,
	now = Date.now()
): Promise<SheetEvents> {
	const source = `${urls.events ?? ''} ${urls.prizes ?? ''}`;
	const saved = cache?.source === source ? cache : null;
	if (saved && now - saved.at < freshFor) return { ...saved.value, state: 'ready' };
	try {
		if (!urls.events) throw new Error('EVENTS_SHEET_URL is not configured');
		const { events: eventsURL, prizes: prizesURL } = urls;
		pending ??= (async () => {
			const [eventsCSV, prizesCSV] = await Promise.all([
				download(eventsURL, fetcher),
				prizesURL ? download(prizesURL, fetcher) : ''
			]);
			const tab = parseEventsTab(eventsCSV);
			const prizes = parsePrizesTab(prizesCSV);
			return {
				events: tab.events,
				extras: prizes.extras,
				problems: [...tab.problems, ...prizes.problems]
			};
		})().finally(() => (pending = null));
		const value = await pending;
		cache = { source, at: now, value };
		if (value.problems.length)
			console.warn(
				`Events sheet: ${value.problems.length} rows skipped; see /calendar/sheet-check`
			);
		return { ...value, state: 'ready' };
	} catch (error) {
		console.warn(
			'Events sheet unavailable:',
			error instanceof Error ? error.message : 'Unknown error'
		);
		if (saved && now - saved.at < keepFor) return { ...saved.value, state: 'ready' };
		return { events: [], extras: new Map(), problems: [], state: 'error' };
	}
}
