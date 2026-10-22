import type { Article, Level, Noun } from '../types';

type Row = [noun: string, article: Article, english: string, plural: string];

const slug = (value: string) => value.toLowerCase().replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue').replaceAll('ß', 'ss').replace(/[^a-z0-9]+/g, '-');
const make = (level: Level, rows: Row[]): Noun[] => rows.map(([noun, article, english, plural]) => ({ id: `${level.toLowerCase()}-${slug(noun)}`, noun, article, english, plural, level }));

export const vocabulary: Noun[] = [
  ...make('A1', [
    ['Apfel','der','apple','Äpfel'], ['Auto','das','car','Autos'], ['Bäckerei','die','bakery','Bäckereien'], ['Bahnhof','der','train station','Bahnhöfe'],
    ['Bett','das','bed','Betten'], ['Bild','das','picture','Bilder'], ['Brot','das','bread','Brote'], ['Bruder','der','brother','Brüder'],
    ['Buch','das','book','Bücher'], ['Bus','der','bus','Busse'], ['Ei','das','egg','Eier'], ['Familie','die','family','Familien'],
    ['Fenster','das','window','Fenster'], ['Frau','die','woman; wife','Frauen'], ['Freund','der','friend','Freunde'], ['Garten','der','garden','Gärten'],
    ['Haus','das','house','Häuser'], ['Hund','der','dog','Hunde'], ['Jahr','das','year','Jahre'], ['Kind','das','child','Kinder'],
    ['Küche','die','kitchen','Küchen'], ['Lehrer','der','teacher','Lehrer'], ['Mann','der','man; husband','Männer'], ['Mutter','die','mother','Mütter'],
    ['Name','der','name','Namen'], ['Schule','die','school','Schulen'], ['Schwester','die','sister','Schwestern'], ['Sohn','der','son','Söhne'],
    ['Stadt','die','city','Städte'], ['Straße','die','street','Straßen'], ['Stuhl','der','chair','Stühle'], ['Tag','der','day','Tage'],
    ['Tochter','die','daughter','Töchter'], ['Tisch','der','table','Tische'], ['Tür','die','door','Türen'], ['Vater','der','father','Väter'],
    ['Wasser','das','water','— (usually uncountable)'], ['Woche','die','week','Wochen'], ['Wohnung','die','apartment','Wohnungen'], ['Zimmer','das','room','Zimmer'],
  ]),
  ...make('A2', [
    ['Abend','der','evening','Abende'], ['Antwort','die','answer','Antworten'], ['Arzt','der','doctor','Ärzte'], ['Ausflug','der','excursion','Ausflüge'],
    ['Baum','der','tree','Bäume'], ['Beruf','der','profession','Berufe'], ['Besuch','der','visit','Besuche'], ['Brief','der','letter','Briefe'],
    ['Brücke','die','bridge','Brücken'], ['Dorf','das','village','Dörfer'], ['Einladung','die','invitation','Einladungen'], ['Fahrrad','das','bicycle','Fahrräder'],
    ['Fehler','der','mistake','Fehler'], ['Flasche','die','bottle','Flaschen'], ['Flughafen','der','airport','Flughäfen'], ['Frage','die','question','Fragen'],
    ['Geburtstag','der','birthday','Geburtstage'], ['Geschäft','das','shop; business','Geschäfte'], ['Geschenk','das','gift','Geschenke'], ['Getränk','das','drink','Getränke'],
    ['Hemd','das','shirt','Hemden'], ['Jacke','die','jacket','Jacken'], ['Karte','die','card; map','Karten'], ['Kino','das','cinema','Kinos'],
    ['Koffer','der','suitcase','Koffer'], ['Krankheit','die','illness','Krankheiten'], ['Kühlschrank','der','refrigerator','Kühlschränke'], ['Laden','der','shop','Läden'],
    ['Lösung','die','solution','Lösungen'], ['Messer','das','knife','Messer'], ['Nachricht','die','message; news item','Nachrichten'], ['Pflanze','die','plant','Pflanzen'],
    ['Rechnung','die','bill; invoice','Rechnungen'], ['Reise','die','journey','Reisen'], ['Schuh','der','shoe','Schuhe'], ['See','der','lake','Seen'],
    ['Spiel','das','game','Spiele'], ['Termin','der','appointment','Termine'], ['Wetter','das','weather','— (usually uncountable)'], ['Zeitung','die','newspaper','Zeitungen'],
  ]),
  ...make('B1', [
    ['Abteilung','die','department','Abteilungen'], ['Anfang','der','beginning','Anfänge'], ['Angebot','das','offer','Angebote'], ['Antrag','der','application; request','Anträge'],
    ['Ausbildung','die','vocational training','Ausbildungen'], ['Beziehung','die','relationship','Beziehungen'], ['Bewerbung','die','application','Bewerbungen'], ['Erfahrung','die','experience','Erfahrungen'],
    ['Ergebnis','das','result','Ergebnisse'], ['Erinnerung','die','memory; reminder','Erinnerungen'], ['Ernährung','die','nutrition','— (usually uncountable)'], ['Fahrzeug','das','vehicle','Fahrzeuge'],
    ['Fortschritt','der','progress','Fortschritte'], ['Gebäude','das','building','Gebäude'], ['Gehalt','das','salary','Gehälter'], ['Gemeinde','die','municipality; community','Gemeinden'],
    ['Gerät','das','device','Geräte'], ['Gesellschaft','die','society; company','Gesellschaften'], ['Gewohnheit','die','habit','Gewohnheiten'], ['Grund','der','reason; ground','Gründe'],
    ['Kenntnis','die','knowledge; skill','Kenntnisse'], ['Kündigung','die','termination; notice','Kündigungen'], ['Landschaft','die','landscape','Landschaften'], ['Leistung','die','achievement; performance','Leistungen'],
    ['Meinung','die','opinion','Meinungen'], ['Möglichkeit','die','possibility','Möglichkeiten'], ['Nachbar','der','neighbor','Nachbarn'], ['Öffentlichkeit','die','public','— (usually singular)'],
    ['Prüfung','die','exam','Prüfungen'], ['Ratschlag','der','advice; suggestion','Ratschläge'], ['Regel','die','rule','Regeln'], ['Reparatur','die','repair','Reparaturen'],
    ['Richtung','die','direction','Richtungen'], ['Schaden','der','damage','Schäden'], ['Veranstaltung','die','event','Veranstaltungen'], ['Verhalten','das','behavior','— (usually singular)'],
    ['Versicherung','die','insurance','Versicherungen'], ['Vorschlag','der','suggestion','Vorschläge'], ['Werkzeug','das','tool','Werkzeuge'], ['Ziel','das','goal; destination','Ziele'],
  ]),
  ...make('B2', [
    ['Ablauf','der','process; sequence','Abläufe'], ['Anspruch','der','claim; entitlement','Ansprüche'], ['Arbeitskraft','die','worker; labor capacity','Arbeitskräfte'], ['Aufwand','der','effort; expense','Aufwände'],
    ['Auswirkung','die','effect; consequence','Auswirkungen'], ['Bedürfnis','das','need','Bedürfnisse'], ['Beitrag','der','contribution','Beiträge'], ['Beschwerde','die','complaint','Beschwerden'],
    ['Betrieb','der','business; operation','Betriebe'], ['Beweis','der','proof; evidence','Beweise'], ['Durchschnitt','der','average','Durchschnitte'], ['Eindruck','der','impression','Eindrücke'],
    ['Einstellung','die','attitude; setting','Einstellungen'], ['Entwicklung','die','development','Entwicklungen'], ['Ereignis','das','event','Ereignisse'], ['Fähigkeit','die','ability','Fähigkeiten'],
    ['Folge','die','consequence; episode','Folgen'], ['Forschung','die','research','Forschungen'], ['Genehmigung','die','approval; permit','Genehmigungen'], ['Gerücht','das','rumor','Gerüchte'],
    ['Herausforderung','die','challenge','Herausforderungen'], ['Hersteller','der','manufacturer','Hersteller'], ['Hinweis','der','hint; notice','Hinweise'], ['Maßnahme','die','measure; action','Maßnahmen'],
    ['Mitarbeiter','der','employee','Mitarbeiter'], ['Nachfrage','die','demand; inquiry','Nachfragen'], ['Pflicht','die','duty','Pflichten'], ['Rahmen','der','framework; frame','Rahmen'],
    ['Rücksicht','die','consideration','— (usually singular)'], ['Schwerpunkt','der','focus','Schwerpunkte'], ['Stellungnahme','die','statement','Stellungnahmen'], ['Teilnahme','die','participation','— (usually singular)'],
    ['Umfang','der','scope; extent','Umfänge'], ['Umgebung','die','surroundings','Umgebungen'], ['Unternehmen','das','company','Unternehmen'], ['Voraussetzung','die','prerequisite','Voraussetzungen'],
    ['Vorgehen','das','approach; procedure','Vorgehensweisen'], ['Wettbewerb','der','competition','Wettbewerbe'], ['Widerspruch','der','contradiction; objection','Widersprüche'], ['Zusammenhang','der','connection; context','Zusammenhänge'],
  ]),
  ...make('C1', [
    ['Abweichung','die','deviation','Abweichungen'], ['Angelegenheit','die','matter; affair','Angelegenheiten'], ['Anreiz','der','incentive','Anreize'], ['Anteilnahme','die','sympathy; concern','— (usually singular)'],
    ['Auffassung','die','view; conception','Auffassungen'], ['Befugnis','die','authority; power','Befugnisse'], ['Begebenheit','die','incident','Begebenheiten'], ['Belang','der','concern; interest','Belange'],
    ['Bereitschaft','die','willingness; readiness','— (usually singular)'], ['Beschaffenheit','die','nature; condition','— (usually singular)'], ['Bestandteil','der','component','Bestandteile'], ['Einwand','der','objection','Einwände'],
    ['Engpass','der','bottleneck; shortage','Engpässe'], ['Erkenntnis','die','insight; finding','Erkenntnisse'], ['Ermessensspielraum','der','scope of discretion','Ermessensspielräume'], ['Gegebenheit','die','given circumstance','Gegebenheiten'],
    ['Gegenstand','der','object; subject','Gegenstände'], ['Geltungsbereich','der','scope of application','Geltungsbereiche'], ['Herangehensweise','die','approach','Herangehensweisen'], ['Hintergrund','der','background','Hintergründe'],
    ['Leitbild','das','guiding principle','Leitbilder'], ['Missstand','der','grievance; abuse','Missstände'], ['Nachweis','der','proof; record','Nachweise'], ['Neigung','die','inclination','Neigungen'],
    ['Rahmenbedingung','die','general condition','Rahmenbedingungen'], ['Sachverhalt','der','set of facts','Sachverhalte'], ['Schwankung','die','fluctuation','Schwankungen'], ['Stellenwert','der','significance','Stellenwerte'],
    ['Tragweite','die','implication; scope','— (usually singular)'], ['Übereinkunft','die','agreement','Übereinkünfte'], ['Umstand','der','circumstance','Umstände'], ['Unbehagen','das','unease','— (usually singular)'],
    ['Verbindlichkeit','die','binding nature; liability','Verbindlichkeiten'], ['Verfügung','die','order; availability','Verfügungen'], ['Vermögen','das','assets; ability','Vermögen'], ['Vorkehrung','die','precaution','Vorkehrungen'],
    ['Vorwand','der','pretext','Vorwände'], ['Wahrnehmung','die','perception','Wahrnehmungen'], ['Zuständigkeit','die','responsibility; jurisdiction','Zuständigkeiten'], ['Zuwendung','die','attention; grant','Zuwendungen'],
  ]),
  ...make('C2', [
    ['Abbild','das','image; likeness','Abbilder'], ['Abhandlung','die','treatise','Abhandlungen'], ['Argwohn','der','suspicion','— (usually singular)'], ['Aufhebens','das','fuss','— (only in fixed expressions)'],
    ['Befangenheit','die','bias; inhibition','— (usually singular)'], ['Behelf','der','makeshift; expedient','Behelfe'], ['Bevormundung','die','patronization','Bevormundungen'], ['Bewandtnis','die','relevance; circumstances','Bewandtnisse'],
    ['Dünkel','der','conceit','— (usually singular)'], ['Einlassung','die','statement; submission','Einlassungen'], ['Entbehrung','die','privation','Entbehrungen'], ['Erörterung','die','discussion','Erörterungen'],
    ['Fährnis','die','peril','Fährnisse'], ['Fehlschluss','der','fallacy','Fehlschlüsse'], ['Fingerspitzengefühl','das','tact','— (usually singular)'], ['Gebaren','das','conduct; demeanor','— (usually singular)'],
    ['Gepflogenheit','die','custom; convention','Gepflogenheiten'], ['Haarspalterei','die','nitpicking','Haarspaltereien'], ['Impetus','der','impetus','Impetus'], ['Kleinod','das','treasure; gem','Kleinode'],
    ['Makel','der','flaw; blemish','Makel'], ['Missgeschick','das','mishap','Missgeschicke'], ['Nachsicht','die','leniency','— (usually singular)'], ['Obliegenheit','die','obligation','Obliegenheiten'],
    ['Plädoyer','das','plea','Plädoyers'], ['Prämisse','die','premise','Prämissen'], ['Ränkespiel','das','intrigue','Ränkespiele'], ['Ressentiment','das','resentment','Ressentiments'],
    ['Richtschnur','die','guideline','Richtschnüre'], ['Scharmützel','das','skirmish','Scharmützel'], ['Schindluder','der','abuse; misuse','— (only in fixed expressions)'], ['Sinnbild','das','symbol; emblem','Sinnbilder'],
    ['Tenor','der','gist; tenor','Tenöre'], ['Unbill','die','hardship; injustice','— (usually singular)'], ['Verhängnis','das','doom; calamity','Verhängnisse'], ['Verlautbarung','die','official announcement','Verlautbarungen'],
    ['Verve','die','verve','— (usually singular)'], ['Wehmut','die','wistfulness','— (usually singular)'], ['Zäsur','die','turning point; caesura','Zäsuren'], ['Zwietracht','die','discord','— (usually singular)'],
  ]),
];

export const filterVocabulary = (level: Level, mode: 'level' | 'up-to'): Noun[] => {
  const max = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(level);
  return vocabulary.filter((noun) => mode === 'level' ? noun.level === level : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(noun.level) <= max);
};
