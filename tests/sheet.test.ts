import test from 'node:test';
import assert from 'node:assert/strict';
import {
	clearSheetCache,
	lichessEventID,
	parseAmount,
	parseCSV,
	parseDate,
	parseEventsTab,
	parsePrizes,
	parsePrizesTab,
	parseTime,
	readSheetEvents,
	withExtras
} from '../src/lib/server/sheet.ts';

const header =
	'Show,Name,Date,Last day,Start time,End time,Type,Venue,City,FIDE rated,Registration link,Platform,Tournament link,Status,Format,Time control,Prizes,Entry fee,Currency';
const row = (cells: Record<string, string>) =>
	header
		.split(',')
		.map((name) => {
			const value = cells[name] ?? '';
			return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
		})
		.join(',');

test('parses quoted CSV fields with commas, quotes and line breaks', () => {
	assert.deepEqual(parseCSV('a,"b, c","say ""hi""","two\nlines"\r\nd,,\n'), [
		['a', 'b, c', 'say "hi"', 'two\nlines'],
		['d', '', '']
	]);
});

test('reads the date, time and amount formats Google Sheets produces', () => {
	assert.deepEqual(parseDate('2026-11-01'), { day: '2026-11-01' });
	assert.deepEqual(parseDate('1 Nov 2026'), { day: '2026-11-01' });
	assert.deepEqual(parseDate('Sun, 1 November 2026'), { day: '2026-11-01' });
	assert.deepEqual(parseDate('2026-12'), { month: '2026-12' });
	assert.deepEqual(parseDate('December 2026'), { month: '2026-12' });
	assert.equal(parseDate('11/01/2026'), null);
	assert.equal(parseDate('2026-02-30'), null);

	assert.equal(parseTime('19:00'), '19:00');
	assert.equal(parseTime('9:30:00'), '09:30');
	assert.equal(parseTime('7:40 PM'), '19:40');
	assert.equal(parseTime('12 am'), '00:00');
	assert.equal(parseTime('25:00'), null);
	assert.equal(parseTime('19'), null);

	assert.equal(parseAmount('50,000'), 50000);
	assert.equal(parseAmount('TZS 50 000'), 50000);
	assert.equal(parseAmount('fifty'), null);
	assert.deepEqual(parsePrizes('1st place: 50,000; 2nd place: 30,000\nBest junior: 10,000'), [
		{ category: '1st place', amount: 50000 },
		{ category: '2nd place', amount: 30000 },
		{ category: 'Best junior', amount: 10000 }
	]);
	assert.equal(parsePrizes('Winner 50,000'), null);
});

test('maps event rows, hides Show: no and keeps unknown details empty', () => {
	const csv = [
		header,
		row({
			Show: 'yes',
			Name: 'DBC November Blitz Tournament',
			Date: '1 Nov 2026',
			'Start time': '09:30',
			'End time': '17:00',
			Type: 'OTB',
			Venue: 'DBC, Upanga',
			'FIDE rated': 'no',
			Prizes: '1st place: 50,000',
			'Entry fee': 'Free'
		}),
		row({ Show: 'no', Name: 'Draft', Date: '2026-11-02', Type: 'OTB' }),
		row({ Name: 'Justfit Interschool Games', Date: 'Dec 2026', Type: 'OTB' }),
		row({
			Name: 'New Year Eve TZ Online Blitz',
			Date: '2026-12-31',
			Type: 'Online',
			Platform: 'lichess',
			'Tournament link': 'https://lichess.org/tournament/abcdefgh',
			Status: 'Postponed',
			Currency: 'USD',
			'Entry fee': '5'
		}),
		''
	].join('\n');
	const { events, problems } = parseEventsTab(csv);
	assert.deepEqual(problems, []);
	assert.equal(events.length, 3);
	const [blitz, month, online] = events;
	assert.equal(blitz.id, 'sheet-dbc-november-blitz-tournament-2026-11-01');
	assert.deepEqual(blitz.date, { start: '2026-11-01' });
	assert.equal(blitz.startsAt, '2026-11-01T09:30:00+03:00');
	assert.equal(blitz.endsAt, '2026-11-01T17:00:00+03:00');
	assert.deepEqual(blitz.location, {
		kind: 'otb',
		venue: 'DBC, Upanga',
		city: undefined,
		fideRated: false,
		registrationUrl: undefined
	});
	assert.deepEqual(blitz.prizes, {
		currency: 'TZS',
		awards: [{ category: '1st place', amount: 50000 }]
	});
	assert.deepEqual(blitz.entryFee, { currency: 'TZS', amount: 0 });
	assert.deepEqual(month.date, { month: '2026-12' });
	assert.equal('entryFee' in month, false);
	assert.deepEqual(online.location, {
		kind: 'online',
		platform: 'Lichess',
		url: 'https://lichess.org/tournament/abcdefgh'
	});
	assert.equal(online.status, 'postponed');
	assert.deepEqual(online.entryFee, { currency: 'USD', amount: 5 });
});

test('skips invalid rows and says how to fix each', () => {
	const csv = [
		header,
		row({ Name: '', Date: '2026-11-01', Type: 'OTB' }),
		row({ Name: 'Slashed', Date: '11/01/2026', Type: 'OTB' }),
		row({ Name: 'Backwards', Date: '2026-11-03', 'Last day': '2026-11-01', Type: 'OTB' }),
		row({
			Name: 'Late',
			Date: '2026-11-01',
			'Start time': '18:00',
			'End time': '09:00',
			Type: 'OTB'
		}),
		row({ Name: 'No type', Date: '2026-11-01' }),
		row({
			Name: 'Unsafe',
			Date: '2026-11-01',
			Type: 'OTB',
			'Registration link': 'javascript:alert(1)'
		}),
		row({ Name: 'Prizes', Date: '2026-11-01', Type: 'OTB', Prizes: 'Winner 50,000' }),
		row({ Name: 'Fine', Date: '2026-11-01', Type: 'OTB' })
	].join('\n');
	const { events, problems } = parseEventsTab(csv);
	assert.deepEqual(
		events.map((event) => event.name),
		['Fine']
	);
	assert.deepEqual(
		problems.map((problem) => problem.row),
		[2, 3, 4, 5, 6, 7, 8]
	);
	assert.match(problems[1].message, /2026-11-01 or 1 Nov 2026/);
});

test('keeps two events with the same name and day apart', () => {
	const csv = [
		header,
		row({ Name: 'Open', Date: '2026-11-01', Type: 'OTB' }),
		row({ Name: 'Open', Date: '2026-11-01', Type: 'Online' })
	].join('\n');
	assert.deepEqual(
		parseEventsTab(csv).events.map((event) => event.id),
		['sheet-open-2026-11-01', 'sheet-open-2026-11-01-2']
	);
});

test('adds prizes to Lichess tournaments by their link', () => {
	assert.equal(lichessEventID('https://lichess.org/tournament/pU7LJr6J'), 'lichess-arena-pU7LJr6J');
	assert.equal(
		lichessEventID('https://lichess.org/swiss/AbCd1234#standings'),
		'lichess-swiss-AbCd1234'
	);
	assert.equal(lichessEventID('https://example.com/tournament/pU7LJr6J'), null);

	const { extras, problems } = parsePrizesTab(
		[
			'Tournament link,Prizes,Entry fee,Currency,Note',
			'https://lichess.org/tournament/pU7LJr6J,"Winner: 20,000; Runner-up: 10,000",0,,Jordan Arena',
			'https://lichess.org/tournament/pU7LJr6J,Winner: 5,,,duplicate',
			'not a link,,,,'
		].join('\n')
	);
	assert.deepEqual(
		problems.map((problem) => [problem.row, problem.tab]),
		[
			[3, 'Lichess prizes'],
			[4, 'Lichess prizes']
		]
	);
	const tournament = {
		id: 'lichess-arena-pU7LJr6J',
		slug: 'lichess-arena-pU7LJr6J',
		source: 'club' as const,
		name: 'XXVIII Jordan Arena',
		date: { start: '2026-11-01' },
		location: { kind: 'online' as const, platform: 'Lichess' as const }
	};
	const [enriched] = withExtras([tournament], extras);
	assert.deepEqual(enriched.prizes, {
		currency: 'TZS',
		awards: [
			{ category: 'Winner', amount: 20000 },
			{ category: 'Runner-up', amount: 10000 }
		]
	});
	assert.deepEqual(enriched.entryFee, { currency: 'TZS', amount: 0 });
});

const urls = { events: 'https://docs.google.com/events', prizes: 'https://docs.google.com/prizes' };
const sheet = [header, row({ Name: 'Fine', Date: '2026-11-01', Type: 'OTB' })].join('\n');

test('shares one download for a minute and keeps it when Google fails', async () => {
	clearSheetCache();
	let calls = 0;
	let failing = false;
	const fetcher = (async (url: string) => {
		calls++;
		if (failing) return new Response('', { status: 503 });
		return new Response(url.endsWith('events') ? sheet : 'Tournament link,Prizes\n');
	}) as unknown as typeof fetch;
	const start = Date.parse('2026-10-30T12:00:00Z');
	await Promise.all([readSheetEvents(urls, fetcher, start), readSheetEvents(urls, fetcher, start)]);
	assert.equal(calls, 2);
	await readSheetEvents(urls, fetcher, start + 59_000);
	assert.equal(calls, 2);

	failing = true;
	const stale = await readSheetEvents(urls, fetcher, start + 61_000);
	assert.equal(stale.state, 'ready');
	assert.equal(stale.events.length, 1);
	const expired = await readSheetEvents(urls, fetcher, start + 25 * 60 * 60 * 1000);
	assert.equal(expired.state, 'error');
	assert.deepEqual(expired.events, []);
});

test('reports an unpublished sheet or a missing address as an error', async () => {
	clearSheetCache();
	const signIn = (async () =>
		new Response('<!doctype html><title>Sign in</title>')) as unknown as typeof fetch;
	assert.equal((await readSheetEvents(urls, signIn)).state, 'error');
	clearSheetCache();
	assert.equal(
		(await readSheetEvents({ events: undefined, prizes: undefined }, signIn)).state,
		'error'
	);
});
