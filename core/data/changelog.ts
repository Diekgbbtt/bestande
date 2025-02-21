import {AppLanguage} from '../models/app-language';

export enum AppChangeType {
	BUGFIX = 'BUGFIX',
	REMOVED = 'REMOVED',
	ADDED = 'ADDED',
}

export type AppChangePlatform = 'ios' | 'android' | 'web';

export type AppChange = {
	description: {[key in AppLanguage]: string};
	type: AppChangeType;
	version: string;
	platform: AppChangePlatform[];
	credits?: string[];
	date?: Date;
};

export type Changelog = {
	version: string;
	changes: AppChange[];
}[];

export const changelog: AppChange[] = [
	{
		version: '4.9.0',
		description: {
			de:
				'Fehler behoben, bei dem die nicht die Benachrichtigung für einen Chat ausschalten konntest.',
			en: 'Bug fixed in which you could not disable notifications for a chat.',
		},
		type: AppChangeType.BUGFIX,
		date: new Date('2021-01-19'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.9.0',
		description: {
			de:
				'Du kannst nun andere Benachrichtigungen, wenn die Noten draussen sind. Klicke auf das Plus-Icon neben dem Chat-Textfeld und dann auf "Noten bekanntgegeben"',
			en:
				'You can now notify other people when the grades are out. Click on the plus icon next to the the chat input and select "Grades are out".',
		},
		type: AppChangeType.ADDED,
		date: new Date('2021-01-17'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.9.0',
		description: {
			de:
				'Aufgrund tiefer Nutzung haben wir folgende Funktionen entfernt: Mensakamera, Italienische Übersetzung',
			en:
				'Because of low usage we removed the following features: Food camera, Italian translation',
		},
		type: AppChangeType.REMOVED,
		date: new Date('2021-01-12'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.8.0',
		description: {
			de: 'Die App wurde fürs FS21 aktualisiert.',
			en: 'The app was updated for spring semester 2021.',
		},
		type: AppChangeType.ADDED,
		date: new Date('2021-01-07'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.8.0',
		description: {
			de:
				'Chat-Verbesserungen: Die Profilbilder haben ein neues Design, Nutzer können als verifiziert angezeigt werden, Erwähnungen werden hervorgehoben.',
			en:
				'Chat improvements: New default profile picture design, users can be verified, mentions will be highlighted.',
		},
		type: AppChangeType.ADDED,
		date: new Date('2021-01-07'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.7.0',
		description: {
			de: 'Du kannst Bestande nun im Querformat benutzen.',
			en: 'Support for landscape orientation of your device.',
		},
		type: AppChangeType.ADDED,
		date: new Date('2020-11-06'),
		platform: ['ios', 'android'],
	},
	{
		version: '4.7.0',
		description: {
			de: 'Crash behoben im Mensa-Preis-Filter',
			en: 'Fixed crash in the mensa price filter.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-11-06'),
		credits: ['Rafael'],
	},
	{
		version: '4.6.0',
		description: {
			de: 'Bestande-Nutzerstatistik im Statistiktab.',
			en: 'User statistic in the statistic tab.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-09-27'),
	},
	{
		version: '4.6.0',
		description: {
			de: 'Bücher kaufen und verkaufen für ETH.',
			en: 'Buy and sell books for ETHZ.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-09-27'),
	},
	{
		version: '4.5.0',
		description: {
			de: 'Integration mit studenttrade.ch - Kaufe und verkaufe Bücher',
			en:
				'Integration with studenttrade.ch - Buy and sell books for your courses.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
		date: new Date('2020-09-15'),
	},
	{
		version: '4.4.0',
		description: {
			de: 'Stundenplan-Tab für jedes Fach hinzugefügt.',
			en: 'Timetable tab for each course.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-07-30'),
	},
	{
		version: '4.3.1',
		description: {
			de:
				'Die Notenstatistiken sind zurück! Du kannst Noten, die du selber eingetragen hast, in die Statistik einfliessen lassen. Alle Daten werden vollkommen anonym übermittelt, aber du kannst in den Einstellungen dich von der Statistik austragen.',
			en:
				'The grade statistics are back! You can submit grades that you entered yourself to the statistics. All data is transmitted completely anonymous, but you can go to the settings and opt out from this feature.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-06-11'),
	},
	{
		version: '4.3.0',
		description: {
			de: 'Möglichkeit, Dateien hochzuladen und zu teilen.',
			en: 'Ability to upload files and share them.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-06-09'),
	},
	{
		version: '4.2.12',
		description: {
			de: 'Crash behoben',
			en: 'Fixed a crash',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-04-29'),
	},
	{
		version: '4.2.10',
		description: {
			de: 'Änderungen bei der Handhabung der App und Navigation',
			en: 'Changes in the layout and the navigation flow of the app.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-04-14'),
	},
	{
		version: '4.2.8',
		description: {
			de:
				'Informationen zur Absage aller Veranstaltungen auf dem Campus wurden eingefügt.',
			en:
				'Information about the cancellation of all events on the campus were inserted into the app.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
		date: new Date('2020-03-13'),
	},
	{
		version: '4.2.7',
		description: {
			de:
				'Fehler behoben bei dem Fächer vom UZH-Logins nicht entfernt werden konnten.',
			en: 'Fixed bug where courses coming from UZH login could not be removed.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-02-23'),
		credits: ['Jerome'],
	},
	{
		version: '4.2.7',
		description: {
			de: 'Die Kalorienmenge der Mensamenüs kann nun ausgeschaltet werden.',
			en: 'The calorie amount label of the canteen menus can be disabled.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-23'),
		credits: ['Katja'],
	},
	{
		version: '4.2.6',
		description: {
			de: 'Über 100 Prüfungstermine der MNF wurden hinzugefügt.',
			en: 'Over 100 exam dates of the Faculty of Science were added.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-14'),
	},
	{
		version: '4.2.6',
		description: {
			de:
				'Wenn eine Note draussen ist, aber du sie nicht eingetragen hast, bieten wir dir direkt an, die Note einzutragen.',
			en:
				"When a grade is out, but you haven't added it, we offer you to enter the grade directly.",
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-14'),
	},
	{
		version: '4.2.6',
		description: {
			de:
				'Wenn du noch keine Fächer fürs das nächste Semester hinzugefügst hast, bieten wir dir an, direkt Fächer hinzufügen.',
			en:
				'If you have not added courses for the next semester yet, we offer you to add some courses.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-14'),
	},
	{
		version: '4.2.6',
		description: {
			de: 'Unterstützung fürs FS20',
			en: "Support for Spring Semester '20",
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-14'),
	},
	{
		version: '4.2.6',
		description: {
			de:
				'Fehler behoben, bei dem man seine Bewertungen nicht sofort bearbeiten oder löschen konnte.',
			en:
				"Fixed a bug where you couldn't edit or delete your reviews immediately.",
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-02-12'),
		credits: ['Steffen', 'Mehmet'],
	},
	{
		version: '4.2.5',
		description: {
			de: 'Geschwindigkeitsverbesserungen im Chat',
			en: 'Speed improvements in the chat',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-03'),
	},
	{
		version: '4.2.5',
		description: {
			de:
				'Wenn eine Chatnachricht sagt, dass die Noten herausgekommen sind, dann kannst du direkt deine Note eintragen.',
			en:
				'When a chat message is saying that the grades are out, there is a button underneath that will let you enter your grade right away.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-02-03'),
	},
	{
		version: '4.2.2',
		description: {
			de:
				'Wir führen nun eine Korrekturzeit-Statistik. Sehe, wie lange es dauert, bis die Noten veröffentlicht werden. Schreibe in den Chat, dass die Noten herausgekommen sind, um die Statistik zu verbessern. Um ein Beispiel zu sehen, gehe zu Mathematik I und wähle den Statistik-Tab.',
			en:
				'We now maintain an exam correction time statistic. See how long it takes until the grades come out on average. Write in the chat that the grades are out to improve the statistics! For an example, see the statistics tab in Mathematik I.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
		date: new Date('2020-01-19'),
	},
	{
		version: '4.2.1',
		description: {
			de:
				'Pass/Fail-Fächer werden nun nicht standardmässig zum Durchschnitt gezählt.',
			en:
				'Pass/Fail courses are now not by default being counted towards the average.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		date: new Date('2020-01-16'),
		credits: ['Florian', 'Aline'],
	},
	{
		version: '4.2.0',
		description: {
			de: 'Eigene Fächer können nun hinzugefügt werden.',
			en: 'Custom courses can now be added.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
		date: new Date('2020-01-14'),
	},
	{
		version: '4.2.0',
		description: {
			de:
				'Wenn eine Chat-Benachrichtigung angetippt wird, öffnet sich immer der richtige Chat.',
			en:
				'When a chat notification is being tapped, the right chat always opens.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.2.0',
		description: {
			de: 'Das Fächerkürzel (z.B. BIO 123) wird nun im Suchresultat angezeigt.',
			en:
				'The course code (e.g. BIO 123) is now being shown in the search result.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.15',
		description: {
			de:
				'Fehler behoben, bei dem die App abgestürzt ist, wenn ein Fach bearbeitet wird.',
			en: 'Fixed a bug that would crash the app if a course is being edited.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.14',
		description: {
			de:
				'Wenn du eine zitierte Nachricht antippst, wird an den richtigen Ort gescrollt.',
			en:
				'If a quoted message is quoted, the chat view scrolls to the right place.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.14',
		description: {
			de: 'Chatnachrichten können nun zitiert / direkt beantwortet werden.',
			en: 'Chat messages can now be quoted.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.14',
		description: {
			de:
				'Eine eingegebene Chatnachricht welche noch nicht gesendet wurde bleibt nun gespeichert wenn du vom Chat wegnavigierst.',
			en:
				'An entered chat message which was not sent yet does not get lost if you navigate away from the chat.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.14',
		description: {
			de:
				'Chatnachrichten können nun *fett*, _kursiv_, ~durchstrichen~ und als `code` formattiert werden.',
			en:
				'Chat messages can now be formatted as *bold*, _italics_, ~strikethrough~ and `code`.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.14',
		description: {
			de: 'Die App started und reagiert viel schneller!',
			en: 'The app starts and runs much faster!',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.14',
		description: {
			de: 'Dieser Changelog wurde eingeführt.',
			en: 'This changelog was introduced.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.14',
		description: {
			de: 'Bewertungen sind nun sortierbar nach Datum.',
			en: 'Ratings are now sortable by date.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.13',
		description: {
			de:
				'Es ist möglich, andere Kurse anzuzeigen, welche einen ähnlichen Namen haben. Zum Beispiel kannst du von Public Law I einfacher zu Public Law II gelangen.',
			en:
				"It's possible to show other courses which have a similar name. For example it's easier to get from Public Law I to Public Law II",
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.13',
		description: {
			de:
				'Das Kürzel eines Faches wird nun im Titel angezeigt, zum Beispiel "BIO 123".',
			en:
				'The short code of a course is now displayed in the title, for example "BIO 123"',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.13',
		description: {
			de: 'Der Link zur Bestande-Webpage eines Faches sehen und kopieren.',
			en:
				'The link to the web version of the Bestande course page is now visible and can be copied.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.12',
		description: {
			de:
				'Fehler behoben, bei dem man mit Android 10 nicht auf den Bestande-Server zugreifen konnte.',
			en:
				'Fixed a bug which would make it impossible to access the Bestande server when using Android 10.',
		},
		platform: ['android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.11',
		description: {
			de: 'Möglichkeit, ein Profilbild hochzuladen.',
			en: 'Possibility to upload a profile picture.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.11',
		description: {
			de:
				'Immer das neueste Semester wird standardmässig in der Suche angezeigt.',
			en: 'Always the newest semester is being shown by default in the search.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.11',
		description: {
			de:
				'Crash behoben, wenn man in den Chat etwas eingetippt hat aber man nicht verbunden war.',
			en:
				'Fixed a crash when you would type in the chat but you would be disconnected.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.10',
		description: {
			de:
				'Wenn man bei einer Nachricht auf das Herz klickt, erhält derjenige/diejenige eine Benachrichtigung.',
			en:
				'If you click on a heart on someones message they will get a notification.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.10',
		description: {
			de:
				'Man kann nun alle Leute sehen, die bei einer Nachricht auf Herz gedrückt haben.',
			en: 'It is now possible to see all people who have liked a message.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.10',
		description: {
			de:
				'Man kann bei jeder Bewertung sehen, in welchem Semester sie abgegeben wurde.',
			en:
				"It's possible to see for each review in which semester it was submitted.",
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.10',
		description: {
			en:
				'If the instructors or people responsible have changed since a review was submitted, this is now labelled.',
			de:
				'Wenn sich die Instruktoren oder Verantwortlichen eines Faches geändert haben seit dem eine Bewertung abgegeben wurde, dann ist dies nun gekennzeichnet.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.8',
		description: {
			de:
				'Behebt einen Layout-Bug, wenn man zurück zum Hauptbildschirm wischt.',
			en: 'Fixes a layout bug when you would swipe back to the main screen.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.8',
		description: {
			en: 'Fixes a bug where the mensa price setting would not persist.',
			de:
				'Behebt einen Fehler bei dem die Mensapreiseinstellungen nicht gespeichert wurden.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
		credits: ['Ile Cepilov'],
	},
	{
		version: '4.1.7',
		description: {
			en: 'Data for Spring semester 20 was added.',
			de: 'Daten fürs FS20 wurden hinzugefügt.',
		},
		platform: ['ios', 'android', 'web'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.5',
		description: {
			en:
				'Fixed a bug where the app would restart on iOS13 after it becomes active from the background.',
			de:
				'Behebt einen Fehler bei dem die App sich neu started nachdem sie aus dem Hintergrund geholt wurde.',
		},
		platform: ['ios'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.5',
		description: {
			de:
				'Behebt einen Fehler bei dem die Note von Fächern unter der "Andere"-Sektion nicht geändert werden konnte.',
			en:
				'Fixes a bug where the grade could not be changed if the course was under the "Others" category.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.3',
		description: {
			de: 'Geschwindigkeits- und Stabilitätsverbesserungen',
			en: 'Speed and stability improvements',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.BUGFIX,
	},
	{
		version: '4.1.2',
		description: {
			de:
				'Möglichkeit, eine Nachricht via Doppelklick mit "Gefällt mir" zu markieren.',
			en: 'Possibility to like a chat message via double-click.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.1.0',
		description: {
			de: 'Dark mode.',
			en: 'Dark mode.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.0.1',
		description: {
			de: 'Indikator, wieviele Nachrichten in einem Kanal ungelesen sind.',
			en: 'Indicator how many messages are unread in a channel.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.0.1',
		description: {
			de: 'Fehler behoben, bei dem Popups flickern konnten.',
			en: 'Fixed a bug where popups could flicker.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.0.0',
		description: {
			de: 'Einführung eines Chats für jedes Fach.',
			en: 'Introduction of a chat for each course.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.ADDED,
	},
	{
		version: '4.0.0',
		description: {
			de: 'Das UZH-Login wurde entfernt.',
			en: 'The UZH login was removed.',
		},
		platform: ['ios', 'android'],
		type: AppChangeType.REMOVED,
	},
];
