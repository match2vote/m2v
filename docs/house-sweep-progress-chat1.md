# House names-only sweep, chat 1 progress

States (in order): CA, GA, NJ, AZ, CO, MO, SC, CT, IA, NV, NM, MT, SD. 129 districts.

One-time UI change (run book section 6): DONE. apps/mobile/src/screens/Browse.js, namesOnly Card now renders race.meta.sources as ghost "Source: label" buttons linking out, same treatment candidate sources get.

## States completed

## QUARANTINED

## Notes on other chats' states (report only, no edits)

### CA, done 2026-08-14. 52 districts written, 0 quarantined.

Source A could not be the Wikipedia state page: the fetched copy of
`2026 United States House of Representatives elections in California` is truncated after
district 6, and its summary of who advanced was wrong where it was readable (it named
Denney and McGuire in district 1; the certified count gives Gallagher and McGuire).
Substituted sources, noted here because it is a deviation from section 4:
A = California Secretary of State certified Statement of Vote for the June 2, 2026 primary
(76-us-rep.pdf), B = 270toWin 2026 California House races, third source = the SoS per district
returns pages. Ballotpedia is unusable for California right now: its 2026 district pages are
still pre primary and say so on their face.

What the verify gate caught in CA:
1. The Wikipedia summary named the wrong pair in districts 1 and 3. Not used.
2. The PDF text conversion mislabels district headings in places (it swapped headings 1 and 2,
   and drifted by one across the 13 to 19 and 24 to 39 ranges). Every result block was therefore
   re-anchored to a district by matching its candidate names against data/fec/CA.json rather than
   by trusting the printed heading. Without that check about 20 districts would have been written
   one district off.
3. District 37 is a genuine source conflict: the SoS election night page has Fedalizo (R) second
   at 13.6 percent, the certified Statement of Vote has Mota (D) second at 11.7 percent, and
   270toWin agrees with the certified count. Written as Kamlager-Dove and Mota on the certified
   count. This is the one entry a second person should re-check by hand.
4. 13 real general election candidates have no FEC record and got curated entries per section 4
   step 4: Littau (2), Frese (10), Hoelter (15), Sundin Soule (16), Verlato (28), S. Vargas (33),
   Mota (37), Casas (38), Manos (39), Clemmons (41), Morales (43), Cohen (50), Cabrera (51).
5. Same party generals confirmed in 4, 7, 11, 12, 14, 29, 34, 37 (top two) and 40 (two sitting
   Republican members paired by the Proposition 50 map).

Mechanical: json.tool clean, every advancing id resolves, 52 written plus 0 quarantined equals
52 seats, no empty advancing array, no em-dash in any statusNote.
Second way check on five districts using SoS per district returns: 22, 27, 33, 47 confirmed,
plus 1, 2, 10, 16, 37, 42, 51, 52 already confirmed that way during the pass.

Per district comparison, source B read before the written file was opened:

```
D1  A(SOV certified): James Gallagher + Mike McGuire                 | B(270toWin): Gallagher + McGuire                    | match  third source: Wikipedia state page summary claimed Denney and McGuire advanced; certified SOV, 270toWin and SoS candidate list all give Gallagher and McGuire
D2  A(SOV certified): Jared Huffman + Robin Littau                   | B(270toWin): Huffman + Littau                       | match
D3  A(SOV certified): Amerish Bera + Robb Tucker                     | B(270toWin): Bera + Tucker                          | match
D4  A(SOV certified): Mike Thompson + Eric Jones                     | B(270toWin): Thompson + Jones                       | match
D5  A(SOV certified): Thomas McClintock + Michael Masuda             | B(270toWin): McClintock + Masuda                    | match
D6  A(SOV certified): Kevin Kiley + Richard Pan                      | B(270toWin): Kiley + Pan                            | match
D7  A(SOV certified): Mai Vang + Doris Matsui                        | B(270toWin): Matsui + Vang                          | match
D8  A(SOV certified): John Garamendi + Rudy Recile                   | B(270toWin): Garamendi + Recile                     | match
D9  A(SOV certified): Josh Harder + John McBride                     | B(270toWin): Harder + McBride                       | match
D10 A(SOV certified): Mark Desaulnier + Jeff Frese                   | B(270toWin): DeSaulnier + Frese                     | match
D11 A(SOV certified): Scott Wiener + Connie Chan                     | B(270toWin): Chan + Wiener                          | match
D12 A(SOV certified): Lateefah Simon + Jamie Joyce                   | B(270toWin): Joyce + Simon                          | match
D13 A(SOV certified): Adam C. Gray + Kevin J II Lincoln              | B(270toWin): Gray + Lincoln                         | match
D14 A(SOV certified): Aisha Wahab + Melissa Hernandez                | B(270toWin): Hernandez + Wahab                      | match
D15 A(SOV certified): Kevin Mullin + Charles Hoelter                 | B(270toWin): Mullin + Hoelter                       | match
D16 A(SOV certified): Sam T. Liccardo + Peter Sundin Soule           | B(270toWin): Liccardo + Soule                       | match
D17 A(SOV certified): Rohit Khanna + Ritesh Tandon                   | B(270toWin): Khanna + Tandon                        | match
D18 A(SOV certified): Zoe Lofgren + Shane Lewis                      | B(270toWin): Lofgren + Lewis                        | match
D19 A(SOV certified): Jimmy Panetta + Peter Coe Verbica              | B(270toWin): Panetta + Verbica                      | match
D20 A(SOV certified): Vince Fong + Sandra Van Scotter                | B(270toWin): Van Scotter + Fong                     | match
D21 A(SOV certified): Jim Costa + Kyle Kirkland                      | B(270toWin): Costa + Kirkland                       | match
D22 A(SOV certified): David Valadao + Randy Villegas                 | B(270toWin): Villegas + Valadao                     | match
D23 A(SOV certified): Jay Obernolte + Tessa Lynn Hodge               | B(270toWin): Hodge + Obernolte                      | match
D24 A(SOV certified): Salud O. Carbajal + Robert Bob J Smith         | B(270toWin): Carbajal + Smith                       | match
D25 A(SOV certified): Raul Ruiz + Joe Males                          | B(270toWin): Ruiz + Males                           | match
D26 A(SOV certified): Jacqui V Irwin + Samuel Gallucci               | B(270toWin): Irwin + Gallucci                       | match
D27 A(SOV certified): Jason Gibbs + George Whitesides                | B(270toWin): Whitesides + Gibbs                     | match
D28 A(SOV certified): Judy Chu + April Verlato                       | B(270toWin): Chu + Verlato                          | match
D29 A(SOV certified): Luz Rivas + Angelica Maria Duenas              | B(270toWin): Duenas + Rivas                         | match
D30 A(SOV certified): Laura Friedman + Scott Alan Meyers             | B(270toWin): Friedman + Meyers                      | match
D31 A(SOV certified): Gilbert Cisneros + Eric J Ching                | B(270toWin): Cisneros + Ching                       | match
D32 A(SOV certified): Brad Sherman + Larry Thompson                  | B(270toWin): Sherman + Thompson                     | match
D33 A(SOV certified): Pete Aguilar + Stephanie Vargas                | B(270toWin): Aguilar + Vargas                       | match
D34 A(SOV certified): Jimmy Gomez + Angela Gonzales-Torres           | B(270toWin): Gomez + Gonzales-Torres                | match
D35 A(SOV certified): Norma Torres + Mike Cargile                    | B(270toWin): Torres + Cargile                       | match
D36 A(SOV certified): Ted Lieu + Houston Brignano                    | B(270toWin): Lieu + Brignano                        | match
D37 A(SOV certified): Sydney Kamlager-Dove + Samantha Mota           | B(270toWin): Kamlager-Dove + Mota                   | match  third source: 270toWin and certified SOV both give Mota second; SoS election night page had Fedalizo second, certified count governs
D38 A(SOV certified): Hilda Solis + Pedro Antonio Casas              | B(270toWin): Solis + Casas                          | match
D39 A(SOV certified): Mark Takano + Steve Manos                      | B(270toWin): Takano + Manos                         | match
D40 A(SOV certified): Ken Calvert + Young Kim                        | B(270toWin): Calvert + Kim                          | match
D41 A(SOV certified): Linda Sanchez + Mitch Clemmons                 | B(270toWin): Sanchez + Clemmons                     | match
D42 A(SOV certified): Robert Garcia + Brian J Burley                 | B(270toWin): Garcia + Burley                        | match
D43 A(SOV certified): Maxine Waters + Cristian Morales               | B(270toWin): Waters + Morales                       | match
D44 A(SOV certified): Nanette Barragan + Genevieve Angel             | B(270toWin): Barragan + Angel                       | match
D45 A(SOV certified): Derek Tran + Chuong Vo                         | B(270toWin): Tran + Vo                              | match
D46 A(SOV certified): Lou Correa + David Pan                         | B(270toWin): Correa + Pan                           | match
D47 A(SOV certified): Dave Min + Jenny Rae Le Roux                   | B(270toWin): Min + Le Roux                          | match
D48 A(SOV certified): Jim Desmond + Marni Von Wilpert                | B(270toWin): Desmond + Von Wilpert                  | match
D49 A(SOV certified): Mike Levin + Armen Kurdian                     | B(270toWin): Levin + Kurdian                        | match
D50 A(SOV certified): Scott Peters + Steve Cohen                     | B(270toWin): Peters + Cohen                         | match
D51 A(SOV certified): Sara Jacobs + Ricardo Cabrera                  | B(270toWin): Jacobs + Cabrera                       | match  third source: 270toWin truncated the second name, resolved on SoS district 51 returns (Ricardo Cabrera R 37.0%)
D52 A(SOV certified): Juan C. Vargas + Jeffery Belle                 | B(270toWin): Vargas + Belle                         | match  third source: 270toWin content incomplete, resolved on SoS district 52 returns (Vargas 56.9%, Belle 33.5%)
```

### GA, done 2026-08-14. 14 districts written, 0 quarantined.

Source A: Wikipedia state page (fetched whole, all 14 districts). Source B: 270toWin Georgia,
because Ballotpedia's Georgia 2026 pages are still pre primary in this environment and say on
their face that the general election list is incomplete pending the primary. Third source used
where A and B differed: WABE's 2026 Georgia general election candidate list and the Libertarian
Party of Georgia qualifying release.

What the verify gate caught in GA:
1. District 14: source A lists three candidates (Fuller R, Harris D, Underwood L), source B lists
   only the two major party names. Resolved to three on the third source: the Libertarian Party of
   Georgia release names Andrew Underwood as its qualified U.S. House District 14 candidate, and
   WABE lists him on the general ballot. Equal treatment rule, so he is in the advancing array.
2. Four general election candidates have no FEC record and got curated entries: Duffie (4),
   Salvesen (5), Chavez (13), Underwood (14).
3. Name form differs between sources for GA 4: source A says James Duffie, sources B and WABE say
   Jim Duffie. Written as James Duffie, source A form. Same person, flagged for the record.
4. Districts with no incumbent on the November ballot: 1 (Carter ran for Senate), 10 (Collins ran
   for Senate), 11 (Loudermilk not the nominee), 13 (Rep. David Scott died in April 2026). WABE
   notes David Scott's name still appeared on the primary ballot after his death; the nominee is
   Jasmine Clark.

FEC data glitches logged, not fixed, per section 9: GA.json has a filer in a nonexistent district
23 (Raven Harrison). Also newly noticed, same file, district 11 has two duplicate filers under
two ids each: Tricia Pridemore (fec-H6GA11207, fec-H4GA11087) and Uloma Ekpete Kama
(fec-H6GA11231, fec-H6GA03170). Neither is in an advancing array, so no entry is affected.

Mechanical: json.tool clean, every advancing id resolves, 14 written plus 0 quarantined equals 14
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:

```
D1  A(Wikipedia): James Morris Kingston + Amanda Hollowell                   | B(270toWin): Hollowell + Kingston               | match
D2  A(Wikipedia): Sanford Bishop + Matt Day                                  | B(270toWin): Bishop + Day                       | match
D3  A(Wikipedia): Brian Jack + Maura Keller                                  | B(270toWin): Keller + Jack                      | match
D4  A(Wikipedia): Henry C. 'Hank' Johnson + James Duffie                     | B(270toWin): Johnson + Duffie                   | match
D5  A(Wikipedia): Nikema N. Williams + John Salvesen                         | B(270toWin): Williams + Salvesen                | match
D6  A(Wikipedia): Lucia Kay McBath + Kevin Eugene Martin                     | B(270toWin): McBath + Martin                    | match
D7  A(Wikipedia): Richard Dean McCormick + Anthony Lawrence Kozycki          | B(270toWin): Kozycki + McCormick                | match
D8  A(Wikipedia): James Austin Scott + Kelly Esti                            | B(270toWin): Esti + Scott                       | match
D9  A(Wikipedia): Andrew Clyde + Caitlyn Gegen                               | B(270toWin): Gegen + Clyde                      | match
D10 A(Wikipedia): Houston Gaines + Pamela Delancy                            | B(270toWin): Delancy + Gaines                   | match
D11 A(Wikipedia): John Cowan + Christopher Matthew Harden                    | B(270toWin): Harden + Cowan                     | match
D12 A(Wikipedia): Richard W Allen + Ceretta Smith                            | B(270toWin): Smith + Allen                      | match
D13 A(Wikipedia): Jasmine Clark + Jonathan Chavez                            | B(270toWin): Clark + Chavez                     | match
D14 A(Wikipedia): Clay Fuller + Shawn Harris + Andrew Underwood              | B(270toWin): Harris + Fuller (2 only)        | match
```

### NJ, done 2026-08-14. 12 districts written, 0 quarantined.

Sources. Major party nominees: Wikipedia state page (covers districts 1 to 10 only, the fetched
copy is truncated before 11 and 12) plus 270toWin New Jersey as source B, plus the Philadelphia
Inquirer primary night roundup for 11 and 12 and Ballotpedia for the district 10 Republican.
Independent and minor party field: the New Jersey Division of Elections unofficial list of
candidates for the November 3, 2026 general election, which is the state's own ballot access list.

What the verify gate caught in NJ:
1. The first Wikipedia read returned primary fields, not general election fields: it listed four
   Democrats in district 2, three in district 6 and two in district 8. Re-queried per district for
   primary winners only. Anyone writing from the first read would have put losing primary
   candidates in advancing arrays.
2. Wikipedia named Sidney Johnson (I) in district 6 and Justin Barbera and Linda McMahon as
   independents in district 3. None of the three is on the state's certified general list. The
   state list instead has Inder Jit Soni (NJ Families First) in district 6. Written from the state
   list. Wikipedia also missed Adam Rueda (5), Diomedes Minaya (9), Bond and Jenkins (11), Jordan
   and Jinete (12).
3. District 8 has no Republican: no Republican filed by the March 23, 2026 deadline. The field is
   Rep. Menendez plus three independent or minor party candidates. Written that way, not as a
   two way race.
4. FEC glitch found and worked around, logged not fixed: NJ.json has two filers named Menendez in
   district 8, fec-H2NJ08232 (flagged incumbent, the sitting member) and fec-H2NJ13075. The
   incumbent flag disambiguates. This is the "two filers could be the same person" case from
   section 8; it resolved, so no quarantine.
5. 19 general election candidates have no FEC record and got curated entries, almost all of them
   independent or minor party ballot lines, plus Carmen Bucco, the district 10 Republican.
6. Districts with no incumbent on the November ballot: 12 only (Rep. Watson Coleman is not the
   nominee). Rep. Mejia in 11 is the incumbent by way of the special election.

Mechanical: json.tool clean, every advancing id resolves, 12 written plus 0 quarantined equals 12
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened. Source B lists only the
two major party names per district, so the check on it is the major party pair; the minor party
lines are checked against the state list:

```
D1  A(NJ state list + Wikipedia): Donald W Norcross + Damon Galdo + Austin Johnson                                                | B(270toWin majors): Norcross + Galdo           | match
D2  A(NJ state list + Wikipedia): Jeff Van Drew + Zack Mullock + Ramon Mora Jr.                                                   | B(270toWin majors): Van Drew + Mullock         | match
D3  A(NJ state list + Wikipedia): Herb Md Conaway + Michael Patrick McGuire + Ryan Michael Kelly + Steven Welzer                  | B(270toWin majors): Conaway + McGuire          | match
D4  A(NJ state list + Wikipedia): Christopher H Smith + Rachel Peace                                                              | B(270toWin majors): Smith + Peace              | match
D5  A(NJ state list + Wikipedia): Josh Gottheimer + Sean Joseph Kirrane + Adam Rueda                                              | B(270toWin majors): Gottheimer + Kirrane       | match
D6  A(NJ state list + Wikipedia): Frank Jr Pallone + Hillary Herzig + Inder Jit Soni                                              | B(270toWin majors): Pallone + Herzig           | match
D7  A(NJ state list + Wikipedia): Thomas H. Jr. Kean + Rebecca Bennett + Lana Leguia + Randall Terry + Seamus Patrick O'Toole     | B(270toWin majors): Kean + Bennett             | match
D8  A(NJ state list + Wikipedia): Robert J. Menendez + Aristotle Eliopoulos + Craig Honts + Da'Shone Hughey                       | B(270toWin majors): Menendez + Eliopoulos      | match
D9  A(NJ state list + Wikipedia): Nelida Pou + Rosemary Pino + Diomedes Minaya + Terrisa Bukovinac                                | B(270toWin majors): Pou + Pino                 | match
D10 A(NJ state list + Wikipedia): Lamonica McIver + Carmen Bucco                                                                  | B(270toWin majors): McIver + Bucco             | match
D11 A(NJ state list + Wikipedia): Analilia Mejia + Joe Hathaway + Vincent Matrisciano + Alan B. Bond + Russell A. Jenkins         | B(270toWin majors): Mejia + Hathaway           | match
D12 A(NJ state list + Wikipedia): Adam Hamawy + Gregg Mele + Winston Jordan + Andres Jinete                                       | B(270toWin majors): Mele + Hamawy              | match
```

### AZ, done 2026-08-14. 6 districts written (1, 5, 6, 7, 8, 9), 3 quarantined (2, 3, 4).

Arizona's primary was July 21, 2026 and its statewide canvass was August 6, 2026. No source
reachable from here publishes the canvassed results: the Wikipedia state page stops at March 31
fundraising with no results tables, Ballotpedia's Arizona 2026 pages are pre primary and still
print the wrong primary date (August 4), the Secretary of State results site renders through
JavaScript and returns an empty template, and the AP feeds behind KJZZ, CNN and NBC are blocked or
unreadable. Reachable and used: the Secretary of State's list of candidates who filed nomination
papers (which is definitive about who was on each party's primary ballot), KJZZ and KTAR race
stories for CD1 and CD5, the CAWP primary recap, and 270toWin as source B.

Standard applied here, and applied to every state after this one. A district is written when the
major party field is confirmed by two independent sources. A third party or independent candidate
goes in the advancing array only when a source confirms they are on or qualified for the November
ballot. Where a minor party candidate filed but their November status is not certified yet, that
is said in the statusNote and logged here, rather than either guessing them in or silently leaving
the field looking complete. A district is quarantined when the major party field itself is
unresolved or when sources contradict each other about it.

What the verify gate caught in AZ:
1. Incumbent Rep. David Schweikert did not run for re-election in district 1, he ran for governor.
   Ballotpedia still lists him as a district 1 primary candidate. FEC still flags him as the
   district 1 incumbent. Neither is the November field. Written as an open seat.
2. 270toWin lists a Republican, Nicholas Glenn, in district 3. The Secretary of State's filing
   list shows no Republican filed in district 3 at all, and Ballotpedia records Glenn only as a
   2024 write in with 37 votes. Unresolvable, district quarantined.
3. Districts 1, 6 and 8 each have minor party filers whose November status is uncertified. Their
   names are in each statusNote, and they are NOT in the advancing arrays.

QUARANTINED, Arizona, 3 districts:
- AZ-2: Democratic primary was contested (Nez vs Descheenie) and no readable source reports the
  result. Curtis Goodwin (Libertarian) also filed.
- AZ-3: sources contradict each other on whether there is a Republican on the ballot, see above.
  Alan Aversa (Arizona Independent Party) also filed.
- AZ-4: both major primaries were contested (Stanton vs Newkirk, Jasser vs Davison) with no
  readable result, and two Arizona Independent Party candidates contested each other.

A second person should re-check these three, and the minor party lines in 1, 6 and 8, against the
Arizona Secretary of State canvass of the July 21 primary once it is published.

Mechanical: json.tool clean, every advancing id resolves, 6 written plus 3 quarantined equals 9
seats, no empty advancing array, no em-dash.

Per district comparison, source B (270toWin) read before the written file was opened:
```
D1  A(KJZZ, KTAR, SoS filing list): Jay Feely + Amish Shah                  | B(270toWin): Feely + Shah              | match
D5  A(KJZZ + SoS filing list): Mark Lamb + Elizabeth Lee                    | B(270toWin): Lamb + Lee                | match
D6  A(CAWP + SoS filing list): Juan Ciscomani + JoAnna Mendoza              | B(270toWin): Ciscomani + Mendoza       | match
D7  A(CAWP + SoS filing list): Adelita Grijalva + Daniel Butierez           | B(270toWin): Grijalva + Butierez       | match
D8  A(CAWP + SoS filing list): Abraham Hamadeh + Bernadette Greene Placentia| B(270toWin): Hamadeh + Greene-Placentia| match
D9  A(CAWP + SoS filing list): Paul Gosar + Danielle Sterbinsky             | B(270toWin): Gosar + Sterbinsky        | match
D2, D3, D4: quarantined, see above.
```

### CO, done 2026-08-14. 8 districts written, 0 quarantined.

Sources. The Wikipedia state page is pre primary here too (current as of March 31, 2026, no
results tables), so source A is the Colorado Secretary of State's official 2026 primary candidate
list, which is definitive about who was on each party's primary ballot, plus Colorado Public
Radio's primary night results for the contested races and the CAWP recap. Source B: 270toWin
Colorado.

What the verify gate caught in CO:
1. District 1: 15 term incumbent Rep. Diana DeGette was defeated in the Democratic primary by
   Melat Kiros. Anyone writing from the Wikipedia page, which still calls DeGette the nominee,
   would have written the wrong candidate into the biggest safe seat in the state. Confirmed three
   ways: CPR, CAWP and 270toWin.
2. Two Republican nominees have no FEC record and got curated entries: Christy Peterson (1) and
   Kelley Dennison (2).
3. Minor party lines are pending in five districts and are named in the statusNote but NOT in the
   advancing arrays: Libertarian nominations sought by Chad Humphrey (1), Gaylon Kent (2), Mark
   Elworth (5), Patty McMahon (6), and unaffiliated FEC filers Timothy Veldhuizen (4) and Samir
   Witta (6). Colorado minor party and unaffiliated ballot access is not certified this early, and
   no reachable source confirms any of them for November.
4. Contested primaries resolved on CPR: 1 (Kiros over DeGette and James), 2 R (Dennison, 59%),
   3 D (Romero over Kelloff) and 3 R (Hurd over Hanks), 5 D (Killin over Reagan), 8 D (Rutinel
   over Bird and Munsing). Uncontested and therefore unambiguous: 4 R, 5 R, 6 D, 7 D, 7 R, 8 R,
   2 D, 1 R.

Mechanical: json.tool clean, every advancing id resolves, 8 written plus 0 quarantined equals 8
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(CO SoS list + CPR + CAWP): Melat Kiros + Christy Peterson      | B(270toWin): Kiros + Peterson       | match
D2 A(CO SoS list + CPR): Joseph Neguse + Kelley Dennison            | B(270toWin): Neguse + Dennison      | match
D3 A(CO SoS list + CPR): Jeffrey Hurd + Dwayne Romero               | B(270toWin): Hurd + Romero          | match
D4 A(CO SoS list + CAWP): Lauren Boebert + Eileen Laubacher         | B(270toWin): Boebert + Laubacher    | match
D5 A(CO SoS list + CPR): Jeff Crank + Jessica Killin                | B(270toWin): Crank + Killin         | match
D6 A(CO SoS list): Jason Crow + Mel Tewahade                        | B(270toWin): Crow + Tewahade        | match
D7 A(CO SoS list + CAWP): Brittany Pettersen + Tim Bennett          | B(270toWin): Pettersen + Bennett    | match
D8 A(CO SoS list + CPR): Gabe Evans + Manny Rutinel                 | B(270toWin): Evans + Rutinel        | match
```

### MO, done 2026-08-14. 8 districts written, 0 quarantined.

data/curated/MO.json did not exist. Created with the standard shape and the house races written
into it. Missouri's primary was August 4, 2026, ten days ago; the Wikipedia state page is
pre primary (candidate filings and December 2025 finance, no results tables), so source A is the
combination of a district by district results roundup and the individual race calls from ABC News
(1 and 5), KCTV5 (4) and KCUR and Missouri Independent (6). Source B: 270toWin Missouri.

What the verify gate caught in MO:
1. Rep. Cori Bush lost the district 1 Democratic primary rematch to Rep. Wesley Bell. FEC lists
   Bush as a district 1 filer; she is not on the November ballot.
2. Rep. Sam Graves is not running in district 6. FEC still flags him as the district 6 incumbent.
   Written as an open seat with Stigall and Smead.
3. District 8 name conflict: the roundup calls the Democratic nominee Cody Reichard, 270toWin says
   Chris Reichard, FEC has Christopher Reichard in district 8. Written as Christopher Reichard,
   the FEC form, two sources against one.
4. Paul Berry, the district 1 Republican, has no FEC record and got a curated entry.
5. Missouri is a redrawn state for 2026 and district 5 was redrawn around Rep. Cleaver. The
   nominee pairing was checked against the new numbering in both sources.
6. No Libertarian or Green filers appear in the FEC file or in either source for any Missouri
   district, so no minor party line is pending here.

Mechanical: json.tool clean, every advancing id resolves, 8 written plus 0 quarantined equals 8
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(ABC + roundup): Wesley Bell + Paul Berry            | B(270toWin): Bell + Berry        | match
D2 A(KSDK + roundup): Ann L. Wagner + Frederick Wellman  | B(270toWin): Wagner + Wellman    | match
D3 A(roundup): Robert Onder + Bethany Mann               | B(270toWin): Onder + Mann        | match
D4 A(KCTV5 + roundup): Mark Alford + Jordan Herrera      | B(270toWin): Alford + Herrera    | match
D5 A(ABC + roundup): Emanuel Cleaver + Richard Brattin   | B(270toWin): Cleaver + Brattin   | match
D6 A(KCUR + roundup): Chris Stigall + Josh Smead         | B(270toWin): Stigall + Smead     | match
D7 A(roundup): Eric Burlison + Missi Hesketh             | B(270toWin): Burlison + Hesketh  | match
D8 A(roundup): Jason Smith + Christopher Reichard        | B(270toWin): Smith + Reichard    | match
```

### SC, done 2026-08-14. 7 districts written, 0 quarantined.

Sources. Source A: the Wikipedia state page (post primary here, it names nominees for all seven
districts) cross read with Politics1's South Carolina 2026 candidate roster. Source B: The Green
Papers South Carolina 2026 general, which lists the certified field with full legal names, plus
270toWin for the major party pairs and the South Carolina Libertarian Party's own candidate list.

What the verify gate caught in SC:
1. Wikipedia's minor party coverage is incomplete. It listed the Libertarian in district 1 and the
   Forward Party candidate in district 5 but missed Brian Corriea (Libertarian, 3), Jessica
   Ethridge (Libertarian, 4), Joe Oddo (Alliance Party, 6) and Dayna Smith (2). All four are in
   both Politics1 and The Green Papers, and the SC Libertarian Party confirms Corriea and Ethridge.
   Three of them are now in advancing arrays that a Wikipedia only pass would have left out.
2. Two incumbents are not on the ballot: Rep. Nancy Mace (1) and Rep. Ralph Norman (5) both ran
   for governor. FEC still flags both as incumbents in their districts.
3. FEC has no Republican in district 6 except Maurice Washington, who is not the nominee. The
   nominee is John Peterson, curated entry.
4. FEC glitch, logged not fixed: SC.json carries Zyon Deshon Khalifa twice in district 2, as
   fec-H6SC02167 and fec-H6SC02159. Same name, same party, same district, so this is one person
   with a duplicate registration rather than two people. Used fec-H6SC02159, the lower id. The
   duplicate is left out of the advancing array and the pipeline will mark it not-advancing.
5. Unresolved and deliberately left out of the district 2 advancing array: Dayna Smith is on the
   ballot per both full field sources, but Politics1 gives her party as United Citizens and The
   Green Papers as Workers Party. Party is never inferred, so she is named in the statusNote
   instead of being written with a party we cannot source. A second person should settle this from
   the South Carolina Election Commission candidate tracking system.
6. Certified write in candidates (Clayton Cuteri in 1, Carter Gibson-Grossmann in 7) are not
   ballot listed candidates and are not in advancing arrays. Noted in the statusNotes.
7. Six curated entries created: Margo Ellis (1), Brian Corriea (3), Jessica Ethridge (4), Andy
   Kaplan (5), John Peterson (6), Joe Oddo (6).

Mechanical: json.tool clean, every advancing id resolves, 7 written plus 0 quarantined equals 7
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(Wikipedia + Politics1): Honeycutt + Lacore + Reeside + Ellis | B(Green Papers): same four        | match
D2 A(Wikipedia + Politics1): Wilson + Khalifa                     | B(Green Papers): same two, plus Smith unresolved | match on majors
D3 A(Politics1 + SCLP): Biggs + Lehmacher + Corriea               | B(Green Papers): same three        | match
D4 A(Politics1 + SCLP): Timmons + McClain + Ethridge              | B(Green Papers): same three        | match
D5 A(Wikipedia + Politics1): Climer + Dittmer + Kaplan            | B(Green Papers): same three        | match
D6 A(Politics1): Clyburn + Peterson + Oddo                        | B(Green Papers): same three        | match
D7 A(Wikipedia + Politics1): Fry + Vincent                        | B(Green Papers): same two          | match
```

### CT, done 2026-08-14. 5 districts written, 0 quarantined.

Connecticut's primary was three days ago, August 11, 2026. The Wikipedia state page is pre primary
(finance through April and May), so source A is CT Mirror's primary night results piece plus the
Wikipedia convention nominee list for the districts that had no primary, and source B is 270toWin
Connecticut, with NBC Connecticut and CT News Junkie as a third read on district 1.

What the verify gate caught in CT:
1. District 1: 28 year incumbent Rep. John Larson was defeated in the Democratic primary by former
   Hartford mayor Luke Bronin, 53.5 to 34.7. FEC still flags Larson as the district 1 incumbent.
   Written as Bronin, with no incumbent on the ballot. Confirmed four ways: CT Mirror, NBC
   Connecticut, CT News Junkie, 270toWin.
2. Two Republican primaries also happened and both had to be resolved rather than assumed:
   district 4 Goldstein over Miressi, district 5 Shea over De Barros. Districts 2 and 3 had no
   Republican primary, so the convention nominees (Austin, Lancia) stand.
3. FEC glitch logged, not fixed: CT.json carries the same district 4 Republican twice, as
   Dan Miressi (fec-H4CT04189) and Daniel Miressi (fec-H6CT04150). He lost the primary, so no
   advancing array is affected.
4. Two independent filers appear in FEC records without confirmed November ballot status: Andrew
   Rice (3) and Jackson Taddeo-Waite (5). Named in the statusNotes, not in advancing arrays.
   Connecticut petitioning candidates are certified later in August.

Mechanical: json.tool clean, every advancing id resolves, 5 written plus 0 quarantined equals 5
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(CT Mirror): Luke Bronin + Amy Fogelstrom Chai      | B(270toWin): Bronin + Chai       | match
D2 A(Wikipedia): Joseph Courtney + George Austin        | B(270toWin): Courtney + Austin   | match
D3 A(Wikipedia): Rosa DeLauro + Christopher Lancia      | B(270toWin): DeLauro + Lancia    | match
D4 A(CT Mirror): Jim Himes + Michael Goldstein          | B(270toWin): Himes + Goldstein   | match
D5 A(CT Mirror): Jahana Hayes + Chris Shea              | B(270toWin): Hayes + Shea        | match
```

### IA, done 2026-08-14. 4 districts written (1 and 3 already existed and were verified, 2 and 4 new), 0 quarantined.

Sources: Wikipedia state page (post primary, names nominees), The Green Papers Iowa 2026 general,
270toWin Iowa.

What the verify gate caught in IA:
1. IA-1 and IA-3 were already in the file from an earlier pass. Both check out against all three
   sources: Miller-Meeks and Bohannan in 1, Nunn and Trone Garriott in 3. Their statusNotes were
   left as written and a sources array was added to each so the new Browse.js source list has
   something to render.
2. The Iowa minor party field is genuinely contradictory between sources and nothing is written
   from it. Wikipedia says the district 3 Libertarian is Marco Battaglia; The Green Papers says
   Jacob Heard. Wikipedia says there is a Libertarian in district 4 (Jermaine Decker); The Green
   Papers lists none. The Green Papers adds a district 2 Libertarian (Rick Stewart) that Wikipedia
   does not have. Iowa's nomination papers for non party organizations and independents are not due
   until later in August, which is the likely cause. Majors only in the advancing arrays, with the
   disagreement named in the statusNotes for 2 and 4.
3. Two incumbents are off the November ballot: Rep. Ashley Hinson (2) is running for Senate and
   Rep. Randy Feenstra (4) is running for governor. Both are still flagged as incumbents in FEC.

Mechanical: json.tool clean, every advancing id resolves, 4 written plus 0 quarantined equals 4
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(Wikipedia): Miller-Meeks + Bohannan     | B(Green Papers + 270toWin): same, plus Bridgford (no party), unconfirmed | match on majors
D2 A(Wikipedia): Mitchell + James            | B(Green Papers + 270toWin): same                                        | match
D3 A(Wikipedia): Nunn + Trone Garriott       | B(Green Papers + 270toWin): same, Libertarian name disputed             | match on majors
D4 A(Wikipedia): McGowan + Dawson            | B(Green Papers + 270toWin): same                                        | match
```

### NV, done 2026-08-14. 4 districts written, 0 quarantined.

Sources. The Wikipedia state page is pre primary for the Republican fields in 2, 3 and 4, so
source A is The Green Papers Nevada 2026 general election field, source B is Politics1's Nevada
roster, with 270toWin as a third read on the major party pairs.

What the verify gate caught in NV:
1. Wikipedia lists Hillary Schieve as an independent candidate in district 2. She is in neither
   full field source, so she is not written.
2. The two full field sources disagree at the edges and only names appearing in both are written:
   district 1 has J.E. Houston in Politics1 only (left out, named in the statusNote), district 3
   has Jon Kamerath, David Anderson and P. Dean Johnson in Politics1 only (left out, named in the
   statusNote). Everything else matches.
3. Party labels: Nevada's own designation for unaffiliated ballot candidates is "No Political
   Party", which is what The Green Papers prints. Politics1 flattens all of them to "Independent"
   and FEC codes Khan as "Ind". Written with Nevada's designation rather than the aggregator's.
4. FEC glitches logged, not fixed: NV.json carries Marty O'Donnell twice in district 3
   (fec-H4NV03225 and fec-H6NV03204), one person with a duplicate registration. Used
   fec-H4NV03225. It also carries Ronda Kennedy in both district 3 and district 4; she is not a
   nominee in either, so no advancing array is affected.
5. Seven candidates with no FEC record got curated entries: St John, Thomas and Willert (1),
   Chapman (2), Best, Johnson and Steele (4).
6. District 2 is open: Rep. Mark Amodei is not on the November ballot.

Mechanical: json.tool clean, every advancing id resolves, 4 written plus 0 quarantined equals 4
seats, no empty advancing array, no em-dash.

Per district comparison, source B read before the written file was opened:
```
D1 A(Green Papers): Titus + Buck + Khan + St John + Thomas + Willert | B(Politics1): same six, plus Houston | match, Houston excluded
D2 A(Green Papers): Benitez-Thompson + Flippo + Chapman              | B(Politics1): same three            | match
D3 A(Green Papers): Lee + O'Donnell                                  | B(Politics1): same two, plus three unconfirmed minor names | match on the two
D4 A(Green Papers): Horsford + Whipple + Best + Johnson + Steele     | B(Politics1): same five             | match
```

### NM, done 2026-08-14. 3 districts written, 0 quarantined.

Sources: The Green Papers New Mexico 2026 general (source A), 270toWin New Mexico (source B),
Wikipedia state page as a third read. All three agree on all three districts: Stansbury and
Okpareke (1), Vasquez and Cunningham (2), Leger Fernandez and Zamora (3). All three incumbents
were renominated.

What the verify gate caught in NM:
1. Wikipedia mentions a Green Party candidate, Tom Wakely, in district 2 and notes he was
   disqualified. He is in neither full field source and is not written. Said so in the statusNote.
2. FEC glitch confirmed and logged, not fixed, exactly as section 9 predicted: NM.json has a filer
   in a district 66 (Leanne Gandy). New Mexico has 3 seats. She is in no advancing array.
3. No minor party or independent candidate is listed anywhere for New Mexico this cycle.

Mechanical: json.tool clean, every advancing id resolves, 3 written plus 0 quarantined equals 3
seats, no empty advancing array, no em-dash.

```
D1 A(Green Papers): Melanie Stansbury + Ndidiamaka Okpareke  | B(270toWin): Stansbury + Okpareke   | match
D2 A(Green Papers): Gabriel Vasquez + Greg Cunningham        | B(270toWin): Vasquez + Cunningham   | match
D3 A(Green Papers): Teresa Leger Fernandez + Martin Zamora   | B(270toWin): Leger Fernandez + Zamora| match
```

### MT, done 2026-08-14. 2 districts written, 0 quarantined.

Sources: The Green Papers Montana 2026 general (source A), Wikipedia state page (post primary and
detailed), 270toWin (source B).

What the verify gate caught in MT:
1. Rep. Ryan Zinke announced on March 2, 2026 that he would retire. District 1 is an open seat:
   Aaron Flint (R), whom Zinke endorsed, against Sam Forstag (D). FEC still flags Zinke as the
   district 1 incumbent.
2. Minor party field differs between sources and only names in two sources are written. Nick
   Sheedy (Libertarian, district 1) is in The Green Papers and Wikipedia, so he is written and got
   a curated entry. Kimberly Persico (independent, 1) is in Wikipedia only and Patrick McCracken
   (Libertarian, 2) is in The Green Papers only; both are named in the statusNotes and left out.
3. Michael Eisenhauer (independent, district 2) is in both full field sources and has an FEC
   record, so he is in the advancing array. This is the same equal treatment as the Montana Senate
   race already in the file.

Mechanical: json.tool clean, every advancing id resolves, 2 written plus 0 quarantined equals 2
seats, no empty advancing array, no em-dash. Montana uses district keys 1 and 2, not at-large.

```
D1 A(Green Papers + Wikipedia): Aaron Flint + Sam Forstag + Nick Sheedy (L)  | B(270toWin): Flint + Forstag | match on majors, Sheedy confirmed twice
D2 A(Green Papers + Wikipedia): Troy Downing + Brian Miller + Michael Eisenhauer (I) | B(270toWin): Downing + Miller | match on majors, Eisenhauer confirmed twice
```

### SD, done 2026-08-14. 1 district written, 0 quarantined.

Sources: The Green Papers South Dakota 2026 general (source A) and 270toWin (source B). The
Wikipedia South Dakota state page is not fetchable from here (the domain cache does not have it),
so the third read is the FEC file itself, which carries both nominees.

What the verify gate caught in SD:
1. Rep. Dusty Johnson is not on the November ballot. He ran for governor and, per The Green Papers,
   lost that primary on June 2, 2026. FEC still flags him as the at large incumbent. Written as an
   open seat.
2. Single district state, so the race key is SD-house-at-large, not SD-house-1, per section 5.
3. No minor party or independent candidate is listed in either source.

Mechanical: json.tool clean, every advancing id resolves, 1 written plus 0 quarantined equals 1
seat, no empty advancing array, no em-dash.

```
at-large A(Green Papers): Marty Jackley + Nicole Gronli | B(270toWin): Jackley + Gronli | match
```

## Run complete, 2026-08-14

All 13 states in chat 1's row are done: CA, GA, NJ, AZ, CO, MO, SC, CT, IA, NV, NM, MT, SD.
126 districts written, 3 quarantined (AZ 2, 3, 4), 129 total, which is the assigned count.
53 curated candidate entries created for real general election candidates with no FEC record.

Files this chat wrote, and nothing else: data/curated/{CA,GA,NJ,AZ,CO,MO,SC,CT,IA,NV,NM,MT,SD}.json
(MO.json was created, it did not exist), docs/house-sweep-progress-chat1.md, and the one-time
apps/mobile/src/screens/Browse.js change from section 6. No file belonging to chat 2 or chat 3 was
opened for writing. No file under data/fec was modified. The only git command run was a read-only
`git status` to confirm exactly that, plus the clone that started the run.

Repo validates: `npm --workspace @m2v/core test` passes 11 of 11, every curated file parses with
json.tool, and Browse.js parses as a JSX module after the edit.

## Notes on other chats' states, report only, no edits made

- Ballotpedia is unusable as source B for any state whose 2026 pages are cached pre primary here,
  which is every state chat 1 touched. Chats 2 and 3 should expect the same and should not read a
  Ballotpedia "list of general election candidates is incomplete pending results from the primary"
  page as evidence that a field is undecided.
- The Wikipedia state pages are truncated by the fetch layer on large states. California cut off
  after district 6. Chat 2 (Texas, 38 districts) and chat 3 (New York, Illinois, Ohio, all large)
  will hit this. The Green Papers G26 pages and Politics1 state pages carry the full certified
  field including minor parties and were reliable everywhere they were checked.
- Several Wikipedia state pages are still pre primary (Arizona, Colorado, Missouri, Connecticut,
  Nevada, New Mexico). Anyone writing nominees from them will write pre primary presumptions.
- FEC glitches seen outside the three in section 9, for whoever owns those states later: duplicate
  filer registrations are common. Found in GA district 11 (two each for Pridemore and Kama),
  NJ district 8 (two Menendez records), SC district 2 (two Khalifa records), NV district 3 (two
  O'Donnell records) and CT district 4 (two Miressi records). NV also carries Ronda Kennedy in two
  districts at once.
