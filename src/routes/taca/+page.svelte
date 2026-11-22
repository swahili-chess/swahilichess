<script lang="ts">
	import PageMeta from '#lib/components/site/PageMeta.svelte';
	import {
		ArrowUpRight,
		Check,
		Download,
		FileText,
		Mail,
		MapPin,
		Megaphone,
		Info,
		Phone
	} from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import { money } from '#lib/event-presentation.js';
	import {
		affiliations,
		announcements,
		contact,
		documents,
		leaders,
		membership,
		purposes,
		type TacaDocument
	} from '#lib/content/taca.js';

	const fee = money(membership.fee, 'TZS');
	const initials = (name: string) =>
		name
			.split(' ')
			.slice(0, 2)
			.map((part) => part[0])
			.join('');
	const dateFormat = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	const longDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));
	const tel = (number: string) => `tel:${number.replaceAll(' ', '')}`;
	const applicationEmail = `mailto:${contact.email}?subject=${encodeURIComponent('TACA membership application')}`;
	const steps = [
		'Download the membership form and fill it in.',
		`Pay ${fee} to ${membership.account.bank}, account name ${membership.account.name}, account number ${membership.account.number}.`,
		`Email the form, a passport-size photo and the bank slip to ${contact.email}, for the attention of the Treasurer.`,
		'TACA confirms your membership and issues your member ID card.'
	];
</script>

<PageMeta
	title="Tanzania Chess Association (TACA) · chess.tz"
	description="Public information about the Tanzania Chess Association (TACA): what it does, its Executive Committee, membership and its constitution."
	path="/taca"
/>

{#snippet fileActions(file: TacaDocument)}
	<Item.Actions class="w-full flex-wrap pl-12 sm:w-auto sm:pl-0">
		<Button
			variant="outline"
			size="sm"
			href={file.href}
			target="_blank"
			rel="noopener"
			aria-label={`View ${file.title}`}
			>View <ArrowUpRight class="size-3.5" aria-hidden="true" /></Button
		>
		<Button size="sm" href={file.href} download aria-label={`Download ${file.title}`}
			><Download class="size-3.5" aria-hidden="true" />Download</Button
		>
	</Item.Actions>
{/snippet}

<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader currentPage="taca" />
	<main id="main-content" tabindex="-1" class="site-container flex-1 py-10 outline-none sm:py-14">
		<div class="max-w-3xl">
			<p class="text-sm font-semibold tracking-[0.12em] text-title-blue uppercase">TACA</p>
			<h1 class="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
				Tanzania Chess Association
			</h1>
			<p class="mt-4 text-base text-muted-foreground sm:text-lg">
				Recognized by FIDE and the National Sports Council (BMT) as the body that runs chess in
				Tanzania. TACA develops the game, organizes national events and selects the teams that
				represent the country.
			</p>
			<div class="mt-6 flex flex-wrap gap-2">
				<Button href="#join">Become a member</Button>
				<Button variant="outline" href="#documents">Read the constitution</Button>
			</div>
		</div>

		<section aria-labelledby="purpose" class="mt-16">
			<h2 id="purpose" class="text-2xl font-semibold tracking-tight">What TACA does</h2>
			<ul class="mt-6 grid gap-3 sm:grid-cols-2">
				{#each purposes as purpose (purpose)}
					<li class="flex gap-3 text-sm sm:text-base">
						<Check class="mt-1 size-4 shrink-0 text-title-blue" aria-hidden="true" />{purpose}
					</li>
				{/each}
			</ul>
			<div class="mt-8 flex flex-wrap items-center gap-2">
				<span class="mr-1 text-sm text-muted-foreground">Affiliated with</span>
				{#each affiliations as affiliation (affiliation)}
					<Badge variant="outline">{affiliation}</Badge>
				{/each}
			</div>
		</section>

		<section aria-labelledby="leadership" class="mt-16">
			<h2 id="leadership" class="text-2xl font-semibold tracking-tight">Executive Committee</h2>
			<p class="mt-2 text-sm text-muted-foreground sm:text-base">
				Elected every four years at the General Elections.
			</p>
			<ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each leaders as leader (leader.name)}
					<li>
						<Item.Root variant="outline" class="h-full">
							<Item.Media>
								<Avatar.Root size="lg">
									<Avatar.Fallback class="bg-title-blue/10 text-title-blue"
										>{initials(leader.name)}</Avatar.Fallback
									>
								</Avatar.Root>
							</Item.Media>
							<Item.Content>
								<Item.Title>{leader.name}</Item.Title>
								<Item.Description>{leader.role}</Item.Description>
							</Item.Content>
						</Item.Root>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="join-title" id="join" class="mt-16 scroll-mt-6">
			<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-2xl tracking-tight"
							><h2 id="join-title">Become a member</h2></Card.Title
						>
						<Card.Description
							>Open to every player and anyone interested in chess, with or without a club.</Card.Description
						>
					</Card.Header>
					<Card.Content>
						<ol class="grid gap-4">
							{#each steps as step, index (step)}
								<li class="flex gap-3 text-sm sm:text-base">
									<span
										class="grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background tabular-nums"
										>{index + 1}</span
									>{step}
								</li>
							{/each}
						</ol>
					</Card.Content>
					<Card.Footer class="flex-wrap gap-2">
						<Button href={membership.form} download
							><Download class="size-4" aria-hidden="true" />Download the form</Button
						>
						<Button variant="outline" href={applicationEmail}
							><Mail class="size-4" aria-hidden="true" />Email your application</Button
						>
					</Card.Footer>
				</Card.Root>
				<Card.Root class="gap-4">
					<Card.Header>
						<Card.Description>Individual membership</Card.Description>
						<Card.Title class="text-3xl tracking-tight tabular-nums">{fee}</Card.Title>
						<Card.Description>a year, for players 18 and over</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-3 text-sm text-muted-foreground">
						<p>
							Parents and guardians of young players can register and represent them at the Annual
							General Meeting, including voting in elections.
						</p>
						<p>Players from outside Tanzania can join and vote, but cannot stand for election.</p>
						<p>
							Clubs join with two representatives, who each vote at the Annual General Meeting.
							Contact TACA for club fees.
						</p>
						<p>
							Membership questions: <a
								class="font-medium text-foreground underline underline-offset-4"
								href={tel(contact.membershipPhone)}>{contact.membershipPhone}</a
							>
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<section aria-labelledby="documents-title" id="documents" class="mt-16 scroll-mt-6">
			<h2 id="documents-title" class="text-2xl font-semibold tracking-tight">TACA documents</h2>
			<Item.Group class="mt-6 gap-3">
				{#each documents as file (file.href)}
					<Item.Root variant="outline" class="flex-wrap">
						<Item.Media variant="icon"><FileText aria-hidden="true" /></Item.Media>
						<Item.Content>
							<Item.Title>{file.title}</Item.Title>
							<Item.Description class="line-clamp-none">{file.description}</Item.Description>
							<p class="text-xs text-muted-foreground">{file.details}</p>
						</Item.Content>
						{@render fileActions(file)}
					</Item.Root>
				{/each}
			</Item.Group>
		</section>

		<section aria-labelledby="announcements" class="mt-16">
			<h2 id="announcements" class="text-2xl font-semibold tracking-tight">TACA announcements</h2>
			<Item.Group class="mt-6 gap-3">
				{#each announcements as notice (notice.href)}
					<Item.Root variant="outline" class="flex-wrap items-start">
						<Item.Media variant="icon"><Megaphone aria-hidden="true" /></Item.Media>
						<Item.Content>
							<p class="text-xs font-medium text-muted-foreground">
								<time datetime={notice.date}>{longDate(notice.date)}</time>
							</p>
							<Item.Title>{notice.title}</Item.Title>
							<Item.Description class="line-clamp-none">{notice.description}</Item.Description>
							<p class="text-xs text-muted-foreground">{notice.details}</p>
						</Item.Content>
						{@render fileActions(notice)}
					</Item.Root>
				{/each}
			</Item.Group>
		</section>

		<section aria-labelledby="contact" class="mt-16">
			<h2 id="contact" class="text-2xl font-semibold tracking-tight">Contact TACA</h2>
			<dl class="mt-6 grid gap-4 text-sm sm:grid-cols-3 sm:text-base">
				<div class="flex gap-3">
					<Mail class="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div>
						<dt class="text-muted-foreground">Email</dt>
						<dd>
							<a class="font-medium underline underline-offset-4" href={`mailto:${contact.email}`}
								>{contact.email}</a
							>
						</dd>
					</div>
				</div>
				<div class="flex gap-3">
					<Phone class="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div>
						<dt class="text-muted-foreground">Phone</dt>
						<dd>
							<a class="font-medium underline underline-offset-4" href={tel(contact.phone)}
								>{contact.phone}</a
							>
						</dd>
					</div>
				</div>
				<div class="flex gap-3">
					<MapPin class="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div>
						<dt class="text-muted-foreground">Post</dt>
						<dd class="font-medium">{contact.postal}</dd>
					</div>
				</div>
			</dl>
		</section>
		<Alert.Root class="mt-16 max-w-3xl"
			><Info class="size-4" /><Alert.Title>Not an official TACA website</Alert.Title
			><Alert.Description
				>chess.tz is a community site, not affiliated with the Tanzania Chess Association. This page
				summarizes TACA's public documents. For anything official, contact TACA directly.</Alert.Description
			></Alert.Root
		>
	</main>
	<SiteFooter />
</div>
