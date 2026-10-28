import { samplePlayers } from './foundation.js';
import type { LeaderboardPlayer, RatingProvider } from '#lib/types/leaderboard.js';

/** All records are fictional. Never attach invented profile links to these identities. */
const names = [
	'Amani M.',
	'Neema K.',
	'Baraka J.',
	'Zawadi S.',
	'Juma A.',
	'Rehema N.',
	'Hassan M.',
	'Grace P.',
	'Kelvin S.',
	'Fatuma A.',
	'Joseph N.',
	'Asha M.',
	'David K.',
	'Upendo S.',
	'Salim H.',
	'Esther M.',
	'Emmanuel K.',
	'Bahati J.',
	'Mariam A.',
	'Peter S.',
	'Saada N.',
	'Michael K.',
	'Nuru M.',
	'Christopher Bartholomew Mwakalinga-Mwambene',
	'Imani K.',
	'Tumaini A.',
	'Amani J.',
	'Leila M.'
];
export const sampleSnapshotAt = '2026-10-28T12:00:00Z';
export function leaderboardFixture(provider: RatingProvider): LeaderboardPlayer[] {
	return names.map((name, index) => {
		const base = index < 5 ? 2248 - index * 38 : 2041 - (index - 4) * 38;
		const offset = provider === 'chesscom' ? -160 : provider === 'fide' ? -260 : 0;
		const rapid =
			provider === 'lichess' && index < 5 ? samplePlayers[index].ratings.rapid : base + offset;
		return {
			id: `${provider}-sample-${String(index + 1).padStart(2, '0')}`,
			name,
			handle:
				provider === 'fide'
					? undefined
					: provider === 'lichess' && index < 5
						? samplePlayers[index].handle
						: `${name.split(' ')[0].toLowerCase()}_${index + 1}_sample`,
			title: index === 0 ? 'CM' : index === 1 ? 'WFM' : undefined,
			inactive: provider === 'fide' && index === 7,
			ratings: {
				standard: provider === 'fide' ? { value: index === 27 ? 0 : base - 210 } : undefined,
				rapid:
					index === 26
						? null
						: {
								value: index === 10 ? 2041 - 5 * 38 + offset : rapid,
								provisional: provider !== 'fide' && index === 6
							},
				blitz:
					index === 25
						? null
						: {
								value:
									provider === 'lichess' && index < 5
										? samplePlayers[index].ratings.blitz
										: base + offset - 62
							},
				bullet:
					provider === 'fide' || index === 24
						? null
						: {
								value:
									provider === 'lichess' && index < 5
										? samplePlayers[index].ratings.bullet
										: base + offset - 114,
								provisional: index === 8
							}
			}
		};
	});
}
