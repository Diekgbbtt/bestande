import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../../core/components/layout/responsive';
import {BLUE, GREEN, RED} from '../../../../core/models/colors';
import {ANDROID_LINK, ITUNES_LINK} from '../../helpers/app-links';
import {linkStyle} from '../link';
import InfoAnimation from './info-animation';
import OtherAnimation from './other-animation';
import TimetableAnimation from './timetable-animation';
import Title from './title';

const Contents = styled.div`
	max-width: 1000px;
	margin: auto;
	display: flex;
	padding-top: 40px;
	padding-bottom: 40px;
`;

const Visualization = styled.div`
	height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
	${mobile`
		order: 1;
	`};
`;

const DescriptionTitle = styled.div`
	font-family: Montserrat;
	font-weight: bold;
	color: black;
`;

const Description = styled.div`
	color: rgba(0, 0, 0, 0.8);
	a {
		${linkStyle};
	}
	${mobile`
		order: 0;
	`};
`;

const Strip = styled.div`
	flex-direction: row;
	display: flex;
	${mobile`
		display: block;
	`};
`;

const Part = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const Button = styled.div`
	background: ${BLUE};
	max-width: 400px;
	color: white;
	font-weight: bold;
	padding: 20px 10px;
	text-align: center;
	font-family: Montserrat;
	margin: auto;
	border-radius: 3px;
	display: flex;
	flex-direction: row;
`;

const DownloadButtonSection = styled.a`
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	color: white;
`;

const VendorIcon = styled.img`
	width: 30px;
	height: 30px;
	margin-left: 10px;
	margin-right: 10px;
`;

export const Content = () => {
	return (
		<div>
			<Title
				style={{
					textAlign: 'center',
					paddingTop: 20,
				}}
			>
				Das ist Bestande:
			</Title>
			<Contents>
				<Strip>
					<Part>
						<Visualization>
							<TimetableAnimation />
						</Visualization>
						<Description style={{padding: 20}}>
							<DescriptionTitle>
								Deine Fächer und dein Stundenplan
							</DescriptionTitle>
							<p>
								Verwalte alle deine Fächer und Noten in Bestande. Wir generieren
								automatisch einen Stundenplan für dich. Berechne deine Credits
								und deinen Durchschnitt.
							</p>
						</Description>
					</Part>
					<Part>
						<Visualization>
							<div>
								<InfoAnimation stars={5} background={GREEN} />
								<InfoAnimation stars={1} background={RED} />
							</div>
						</Visualization>
						<Description style={{padding: 20}}>
							<DescriptionTitle>Bewertungen und Statistiken</DescriptionTitle>
							<p>
								Lies, was andere Studenten über ein Fach sagen und sehe
								Statistiken zu Popularität und Schwierigkeit eines Faches.
								Erhalte Empfehlungen, was du als nächstes buchen sollst.
							</p>
						</Description>
					</Part>
				</Strip>
			</Contents>
			<Contents>
				<Strip>
					<Part>
						<Visualization>
							<OtherAnimation />
						</Visualization>
						<Description style={{padding: 20}}>
							<DescriptionTitle>und vieles mehr</DescriptionTitle>
							<p>
								<em>Bestande</em> enthält auch einen Chat, Mensamenüs, eine
								Suche und vieles mehr. Wir sind uns immer am überlegen, wie wir
								dein Studium einfacher machen können.
							</p>
						</Description>
					</Part>
					<Part>
						<Visualization>
							<img
								src="/static/zurich-unis.png"
								style={{
									width: 400,
								}}
							/>
						</Visualization>
						<Description style={{padding: 20}}>
							<DescriptionTitle>
								Für die Universität Zürich und ETH Zürich{' '}
							</DescriptionTitle>
							<p>
								<em>Bestande</em> ist massgeschneidert für diese beiden Unis.
								Mach es wie bereits über 20{"'"}000 Studierende und lade dir{' '}
								<em>Bestande</em> herunter!
							</p>
						</Description>
					</Part>
				</Strip>
			</Contents>
			<Title style={{textAlign: 'center'}}>Lade Bestande herunter:</Title>
			<Button style={{marginBottom: 30}}>
				<DownloadButtonSection
					href={ITUNES_LINK}
					target="_blank"
					style={{
						borderRight: '1px solid rgba(0, 0, 0, 0.2)',
					}}
				>
					<VendorIcon src="/static/apple.svg" />
					<span>iOS</span>
				</DownloadButtonSection>
				<DownloadButtonSection
					href={ANDROID_LINK}
					style={{justifyContent: 'flex-end'}}
				>
					<span>Android</span>
					<VendorIcon src="/static/android.svg" />
				</DownloadButtonSection>
			</Button>
		</div>
	);
};
