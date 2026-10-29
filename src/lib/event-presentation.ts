import type { CalendarEvent } from '#lib/types/event.js';
const dateFormat = (options: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat('en-TZ', { timeZone: 'Africa/Dar_es_Salaam', ...options });
export const eventTime = dateFormat({ hour: '2-digit', minute: '2-digit', hour12: false });
export const money = (amount: number, currency: string) =>
	new Intl.NumberFormat('en-TZ', {
		style: 'currency',
		currency,
		currencyDisplay: 'code',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);
export const prizeTotal = (event: CalendarEvent) =>
	event.prizes?.awards.reduce((sum, award) => sum + award.amount, 0) ?? 0;
export const entryFeeLabel = (event: CalendarEvent) =>
	event.entryFee
		? event.entryFee.amount === 0
			? 'Free'
			: money(event.entryFee.amount, event.entryFee.currency)
		: null;
