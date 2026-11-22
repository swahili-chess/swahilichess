/** Only show a countdown in the final hour before the scheduled start. */
export function eventCountdown(startsAt: string, now: number | null): string | null {
	if (now === null) return null;
	const remaining = Date.parse(startsAt) - now;
	if (!Number.isFinite(remaining) || remaining <= 0 || remaining > 3_600_000) return null;
	const seconds = Math.ceil(remaining / 1_000);
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
