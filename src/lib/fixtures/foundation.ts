/** Fictional data for the development-only foundation review. */
export type PreviewState = 'ready' | 'loading' | 'empty' | 'error';
export type TimeControl = 'rapid' | 'blitz' | 'bullet';

export const timeControls: { value: TimeControl; label: string }[] = [
	{ value: 'rapid', label: 'Rapid' },
	{ value: 'blitz', label: 'Blitz' },
	{ value: 'bullet', label: 'Bullet' }
];

export const samplePlayers = [
	{
		id: 'sample-1',
		name: 'Amani M.',
		handle: 'amani_sample',
		initials: 'AM',
		ratings: { rapid: 2248, blitz: 2186, bullet: 2102 }
	},
	{
		id: 'sample-2',
		name: 'Neema K.',
		handle: 'neema_sample',
		initials: 'NK',
		ratings: { rapid: 2196, blitz: 2230, bullet: 2168 }
	},
	{
		id: 'sample-3',
		name: 'Baraka J.',
		handle: 'baraka_sample',
		initials: 'BJ',
		ratings: { rapid: 2154, blitz: 2094, bullet: 2051 }
	},
	{
		id: 'sample-4',
		name: 'Zawadi S.',
		handle: 'zawadi_sample',
		initials: 'ZS',
		ratings: { rapid: 2087, blitz: 2142, bullet: 2194 }
	},
	{
		id: 'sample-5',
		name: 'Juma A.',
		handle: 'juma_sample',
		initials: 'JA',
		ratings: { rapid: 2041, blitz: 2018, bullet: 1986 }
	}
];
