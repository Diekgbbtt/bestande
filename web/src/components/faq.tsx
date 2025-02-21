import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Container} from '../../../core/components/layout/container';
import {mobile} from '../../../core/components/layout/responsive';
import {SectionTitle} from './layout/section-title';
import {linkStyle} from './link';
import Title from './splash-page/title';

const Wrapper = styled.div`
	background: rgba(0, 0, 0, 0.03);
	width: 100%;
	height: 100%;
	display: block;
	padding-bottom: 30px;
`;

const ads1 = {
	question: 'Weshalb wird Werbung in Bestande angezeigt?',
	answer:
		'Werbung gibt uns Einnahmen, die uns helfen unsere Operationskosten zu decken und Bestande weiterzuentwickeln. Wir erhalten keine Gelder von den Unis.',
};

const ads3 = {
	question: 'Ich möchte in Bestande werben!',
	answer: (
		<div>
			Schaue auf unserer{' '}
			<Link to="/werbung">Seite für Werbetreibende vorbei.</Link> Wir bieten
			Vergünstigungen für Studenten und studentisch akkreditierte Organisationen
			an.
		</div>
	),
};

const ads4 = {
	question: 'Werden meine Daten an Werbetreibende verkauft?',
	answer:
		'Wir geben keinerlei persönliche Informationen an Werbende weiter und werden das nie tun. Es ist lediglich möglich, die Werbung zu targeten, also zum Beispiel dass eine Anzeige nur Rechtsstudenten angezeigt wird.',
};

export const newestVersion = (version) => {
	if (!version) {
		return null;
	}

	if (version.ios === version.android) {
		return <span>Die neueste Version ist {version.ios}.</span>;
	}

	return (
		<span>
			Die neueste Version ist {version.ios} für iOS und {version.android} für
			Android.
		</span>
	);
};

const problem1 = {
	question: 'Ich kann mich nicht einloggen!',
	answer: (
		<div>
			Das UZH-Login wurde deaktiviert und ist nicht mehr unterstützt. Füge jetzt
			Fächer via Suche hinzu.
		</div>
	),
};
const problem2 = {
	question: 'Ich kann ein Fach nicht finden.',
	answer: (
		<div>
			Fächer vor FS14 werden nicht unterstützt. Wenn du ein Fach nicht finden
			kannst, das später hinzugefügt wurde,{' '}
			<Link to="/contact">kontaktiere uns.</Link>
		</div>
	),
};

const average = {
	question: 'Wie wird mein Durchschnitt berechnet?',
	answer:
		'Noten werden gewichtet gezählt, das bedeutet, dass eine Note für ein 6-ECTS-Punkte-Modul doppelt so viel Einfluss auf deinen Durchschnitt hat wird wie eine Note für ein 3-Punkte-Fach. Pass/Fail-Fächer werden nicht zum Durchschnitt gezählt, es sei denn du stellst es so ein. Du kannst für jedes Fach einstellen, ob es zu den Credits oder zum Durchschnitt zählen soll.',
};

const problem3 = {
	question: 'Die App zeigt mir falsche Daten an!',
	answer: (
		<div>
			Findest du, dass Stundenplandaten, Fächerinformationen etc. nicht stimmen,{' '}
			<Link to="/contact">kontaktiere uns</Link> und wir versuchen dies so
			schnell wie möglich zu korrigieren.
		</div>
	),
};

const changeTimetable = {
	question:
		'Ich habe die falschen Übungsserien im Stundenplan ausgewählt. Wie ändere ich meinen Stundenplan?',
	answer:
		'Klicke bei einem Fach in der Hauptansicht auf das Menu-Icon (3 Punkte) und wähle dann "Stundenplan anpassen".',
};

const moreUnis = {
	question: 'Bringt ihr die App an weitere Unis?',
	answer: (
		<div>
			Die Idee ist, dass wir <em>Bestande</em> an weitere Hochschulen bringen,
			allerdings lassen wir uns dafür Zeit, um dafür zu sorgen, dass die App
			hochqualitativ bleibt für alle Unis die wir unterstützen. Momentan ist
			keine weitere Uni in Entwicklung.
		</div>
	),
};

const independant = {
	question: 'Ist dies eine offizielle App der UZH oder ETH?',
	answer: (
		<div>
			Nein, die App ist vollständig unabhängig von der UZH,{' '}
			<Link to="/about">und wurde von ehemaligen Studenten entwickelt.</Link>
		</div>
	),
};

const who = {
	question: 'Wer steckt hinter Bestande?',
	answer: (
		<div>
			Bestande wird vom ehemaligen UZH-Studenten{' '}
			<Link to="/about">Jonny Burger</Link> betrieben. Gehe auf die Seite{' '}
			<Link to="/about">Über uns</Link>, um mehr zu erfahren!
		</div>
	),
};

const adjustCalculation = {
	question: 'Mein Stundenplan wird falsch angezeigt!',
	answer:
		'Du musst die Veranstaltungsserien auswählen, die du besuchst. Oftmals gibt es zum Beispiel mehrere Übungen, aber du besuchst nur eine. Um dies zu korrigieren, klicke auf das Zahnrad oben rechts in der Stundenplanansicht.',
};

const uzhLoginRemoved = {
	question: 'Wieso kann ich meine Noten nicht mehr aktualisieren?',
	answer: (
		<div>
			Wir haben das UZH-Login entfernt und werden es nicht mehr unterstützen,
			neue Noten abzurufen, aber du kannst deine jetzigen Noten behalten. Lies
			mehr darüber in der App oder{' '}
			<Link to="https://www.facebook.com/Bestande/photos/a.484276065084685/1296018760577074/?type=3&theater">
				hier
			</Link>
			.
		</div>
	),
};

const notificationsChat = {
	question:
		'Wie kann ich die Anzahl Push-Benachrichtigungen durch den Chat reduzieren? ',
	answer: (
		<div>
			Gehe in die Einstellungen und wähle aus, für welche Fächer du
			benachrichtigt werden möchtest. Wir arbeiten daran, mehr Optionen zu
			bieten, um die Anzahl Benachrichtigungen ein bisschen weniger zu
			reduzieren.
		</div>
	),
};

const howWePreventAbuse = {
	question:
		'Wie verhindert ihr Missbrauch der Chat-Funktionen und der Bewertungen?',
	answer: (
		<div>
			Jede Bewertung und jede Chat-Nachricht wird von einer echten Person
			angeschaut und geprüft. Wir tolerieren unter anderem keine beleidigenden
			und diskriminierende Bewertungen und Nachrichten. Wenn du trotzdem eine
			unangebrachte Nachricht siehst, kannst du sie melden indem du sie lange
			gedrückt hälst. Wenn du eine Rezension für unangebracht hälst,{' '}
			<Link to="/Contact">kontaktiere uns</Link>.
		</div>
	),
};

const QaSection = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
	grid-auto-rows: max-content;
	grid-gap: 2%;
	a {
		${linkStyle};
	}
	${mobile`
		display: block;
	`};
`;

const QuestionTitle = styled.div`
	font-weight: bold;
	font-family: Montserrat;
`;

const QuestionAnswer = styled.div``;

const QaContainer = styled.div`
	background: white;
	padding: 15px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
`;

const Qa = ({qa}) => {
	return (
		<QaContainer>
			<QuestionTitle>{qa.question}</QuestionTitle>
			<QuestionAnswer>{qa.answer}</QuestionAnswer>
		</QaContainer>
	);
};

class FAQ extends Component {
	render() {
		return (
			<Wrapper>
				<Helmet title="FAQ" />
				<Title style={{textAlign: 'center'}}>Häufig gestelle Fragen</Title>
				<Container>
					<SectionTitle>Generelle Fragen</SectionTitle>
					<QaSection>
						<Qa qa={moreUnis} />
						<Qa qa={independant} />
						<Qa qa={who} />
					</QaSection>
					<SectionTitle>Funktionen</SectionTitle>
					<QaSection>
						<Qa qa={average} />
						<Qa qa={changeTimetable} />
						<Qa qa={adjustCalculation} />
					</QaSection>
					<QaSection>
						<Qa qa={uzhLoginRemoved} />
						<Qa qa={notificationsChat} />
						<Qa qa={howWePreventAbuse} />
					</QaSection>
					<SectionTitle>Probleme</SectionTitle>
					<QaSection>
						<Qa qa={problem1} />
						<Qa qa={problem2} />
						<Qa qa={problem3} />
					</QaSection>
					<SectionTitle>Werbung</SectionTitle>
					<QaSection>
						<Qa qa={ads1} />
						<Qa qa={ads3} />
						<Qa qa={ads4} />
					</QaSection>
				</Container>
			</Wrapper>
		);
	}
}

export default FAQ;
