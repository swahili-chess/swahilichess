/**
 * Public information about TACA, summarized from its own documents. chess.tz
 * is not affiliated with TACA. Sources: the approved constitution (stamped 2 January 2024),
 * the membership form and the 21 October 2026 leadership announcement.
 * Static files live in static/documents.
 */

export type Leader = { name: string; role: string };
export type TacaDocument = {
	title: string;
	description: string;
	href: string;
	details: string;
};
export type Announcement = TacaDocument & { date: string };

export const contact = {
	email: 'info@chess.co.tz',
	phone: '+255 784 462915',
	membershipPhone: '+255 783 111837',
	postal: 'P.O. Box 7104, Dar es Salaam'
};

/** Article 2 of the constitution, in plain words. */
export const purposes = [
	'Promote and develop chess across Tanzania, following international rules.',
	'Coordinate chess at club, regional, national and international level.',
	'Run national championships and other tournaments.',
	'Select and support the teams that represent Tanzania abroad.',
	'Sanction tournaments run by clubs, schools, colleges and players.',
	'Represent Tanzania in chess matters worldwide.'
];

/** Article 3. */
export const affiliations = [
	'FIDE',
	'African Chess Union',
	'National Sports Council of Tanzania',
	'Tanzania Olympic Committee'
];

/**
 * The Executive Committee (Article 5): seven members. From the FIDE directory,
 * with the changes the Vice Chairperson confirmed on 1 November 2026: Kaushi
 * Rishit Shah is Vice Chairperson, Albert Njau is General Secretary, Ali
 * Makongoro has left and Veer Gandhi has joined.
 */
export const leaders: Leader[] = [
	{ name: 'Geoffrey Mwanyika', role: 'Chairman' },
	{ name: 'Kaushi Rishit Shah', role: 'Vice Chairperson' },
	{ name: 'Albert Njau', role: 'General Secretary' },
	{ name: 'Mustafa Ibrahim', role: 'Treasurer' },
	{ name: 'Musa Mangula', role: 'Committee member' },
	{ name: 'Fred Kazi', role: 'Committee member' },
	{ name: 'Veer Gandhi', role: 'Committee member' }
];

export const membership = {
	fee: 50_000,
	form: '/documents/taca-membership-form.pdf',
	account: { bank: 'CRDB', name: 'Tanzania Chess Association', number: '0150414167600' }
};

export const documents: TacaDocument[] = [
	{
		title: 'Constitution',
		description:
			'How TACA is run: its purpose, membership, Executive Committee, meetings and elections.',
		href: '/documents/taca-constitution.pdf',
		details: 'PDF, 11 pages, 1.9 MB'
	},
	{
		title: 'Membership form',
		description: 'Individual membership application, with fees and payment details.',
		href: membership.form,
		details: 'PDF, 1 page, 230 KB'
	}
];

export const announcements: Announcement[] = [
	{
		date: '2026-10-21',
		title: 'New General Secretary and Vice Chairperson',
		description:
			'Albert Njau is the new General Secretary and Kaushi Rishit Shah the new Vice Chairperson. Nurdin Hassuji stepped down for health reasons, and Rashid Mansour Shariff resigned as Vice Chairman and Acting General Secretary. The handover was set for 26 October 2026.',
		href: '/documents/taca-leadership-appointments-2026-10-21.pdf',
		details: 'PDF, 1 page, 210 KB'
	}
];
