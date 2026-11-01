# TACA review

Checkpoint 8, ready for review on 31 October 2026. Chunks 1 to 6 are accepted; the blog, shop and basket are deferred.

Open <http://127.0.0.1:5174/taca>. TACA is in the header on desktop and in the mobile menu.

## Sources

| Content                       | Source                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Purpose and affiliations      | Constitution, Articles 2 and 3, rewritten in plain words                              |
| Executive Committee structure | Constitution, Article 5: elected every four years                                     |
| Committee members             | FIDE directory, with changes confirmed by the Vice Chairperson on 1 November 2026     |
| Membership fee and steps      | Membership form                                                                       |
| Contact                       | Leadership announcement (email, phone, P.O. Box 7104); membership phone from the form |

Content lives in `src/lib/content/taca.ts`; the PDFs live in `static/documents/`. Edit those files to change the page.

## Decisions

- chess.tz is not affiliated with TACA. The page says so below the contact details, and its headings name TACA as the source: TACA documents, TACA announcements, Contact TACA.
- Individual membership is open to anyone, with or without a club (Article 4B). The membership form lets players from outside Tanzania join and vote, but not stand for election.

- The Executive Committee has seven members. The FIDE directory still lists the old committee; the Vice Chairperson confirmed the changes on 1 November 2026: Kaushi Rishit Shah is Vice Chairperson, Albert Njau is General Secretary, Ali Makongoro has left and Veer Gandhi has joined. FIDE's "Board Member" is shown as "Committee member", matching the section heading. Contact details for individual members are not published.
- Honorifics such as Eng., Mr. and Mrs. are left off names, for consistency.
- The constitution is a phone scan of 12 MB. The web copy is re-encoded at about 145 dpi: 11 pages, 1.9 MB, still readable. The original is unchanged outside the repository.
- The constitution gives P.O. Box 9968 and an office at Joevic Pub, Kawe. The page uses the newer P.O. Box 7104 from the announcement and does not list an office.
- View opens a PDF in a new tab, which uses the browser's viewer and works where inline embedding does not. Download saves the file.
- The bank details come from the official membership form, which is published as is.

## Click-through checklist

1. Read the page on desktop and on a phone: purpose, Executive Committee, membership, documents, announcement and contact.
2. Check the seven committee members' names and roles.
3. View and download each PDF on desktop and on a phone.
4. Press Email your application: your mail app opens with the subject "TACA membership application".
5. Tap the phone numbers on a phone.

## Checks

The type check, formatting, production build and Svelte autofixer pass. All 41 tests pass; this chunk adds content, not logic. Checked in the browser at desktop and 375 px widths, with no horizontal scrolling.
