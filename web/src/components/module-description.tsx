import {Label} from '@jonny/rebass';
import moment from 'moment';
import React from 'react';
import Linkify from 'react-linkify';
import styled from 'styled-components';
import {AssessmentInfo} from '../../../core/components/AssessmentInfo';
import BooksSection from '../../../core/components/BooksSection';
import {mobile} from '../../../core/components/layout/responsive';
import Section from '../../../core/components/section';
import renderGrading from '../../../core/functions/render-grading';
import renderModuleType from '../../../core/functions/render-module-type';
import renderRepeatability from '../../../core/functions/render-repeatability';
import {BLUE} from '../../../core/models/colors';
import {UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse, SemesterResponse} from '../../../core/reducers/api';
import {getVvzLink} from '../helpers/get-vvz-link';
import ExternalLink from './external-links';
import {HelpBadge} from './help-badge';
import {InstructorsList} from './instructors-list';
import PersonPreview from './person-preview';

const Description = styled.div`
	a {
		color: ${BLUE};
		border-bottom: 1px solid ${BLUE};
		&:hover {
			background: rgb(0, 0, 255, 0.04);
		}
	}
	p {
		margin-top: 0;
		margin-bottom: 0;
	}
	color: #222;
`;

const StyledLabel = styled(Label)``;

const InfoContainer = styled.div`
	margin-bottom: 5px;
`;

type Props = {
	semesterResponse: SemesterResponse;
	module: ApiResponse;
};

const renderExternalLinks = (props: Props) => {
	const nodes: JSX.Element[] = [];
	if (props.semesterResponse.olat) {
		nodes.push(
			<ExternalLink href={props.semesterResponse.olat.url} label="OLAT" />
		);
	}

	if (props.semesterResponse.links) {
		for (const link of props.semesterResponse.links) {
			nodes.push(<ExternalLink href={link.url} label={link.title} />);
		}
	}

	const vvz = getVvzLink(props.module, props.semesterResponse.period);
	if (vvz) {
		nodes.push(<ExternalLink href={vvz} label="Vorlesungsverzeichnis" />);
	}

	if (nodes.length > 0) {
		return (
			<div>
				<StyledLabel>Externe Links</StyledLabel>
				<br />
				{nodes.map((node, i) => {
					return (
						// eslint-disable-next-line
						<div key={i}>{node}</div>
					);
				})}
			</div>
		);
	}

	return null;
};

const renderResponsible = (props: Props) => {
	if (!props.semesterResponse.responsible?.length) {
		return null;
	}

	return (
		<div>
			<StyledLabel>Verantwortlich</StyledLabel>
			{props.semesterResponse.responsible.map((r) => {
				return <PersonPreview key={r.uni_identifier} person={r} />;
			})}
		</div>
	);
};

const renderInstructors = (props: Props) => {
	if (props.semesterResponse.instructors.length === 0) {
		return null;
	}

	return (
		<div>
			<StyledLabel>Dozierende</StyledLabel>
			<div>
				<InstructorsList instructors={props.semesterResponse.instructors} />
			</div>
		</div>
	);
};

const SmallSection = (props: {
	title: React.ReactNode;
	content: React.ReactNode | null;
}) => {
	if (!props.content) {
		return null;
	}

	return (
		<InfoContainer style={{display: 'flex', flexDirection: 'row'}}>
			<div>
				<StyledLabel>{props.title}</StyledLabel>
			</div>
			<div style={{flex: 1}} />
			<Description>
				<Linkify>{props.content}</Linkify>
			</Description>
		</InfoContainer>
	);
};

const renderBookingPeriod = (start: Date, end: Date) => {
	if (Date.now() < start.getTime()) {
		return `ab ${moment(start).format('DD.MM. HH:mm')}`;
	}

	if (end.getTime() < Date.now()) {
		return (
			<span>
				Nein
				<div style={{width: 5, display: 'inline-block'}} />
				<HelpBadge
					content={`Frist abgelaufen (${moment(end).format(
						'DD.MM.YYYY'
					)})`}
				/>
			</span>
		);
	}

	return (
		<span>
			Ja
			<div style={{width: 5, display: 'inline-block'}} />
			<HelpBadge
				content={`noch bis ${moment(end).format('DD.MM.YYYY HH:mm')}`}
			/>
		</span>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		display: block;
	`};
`;

const Left = styled.div`
	flex: 2;
`;

const Right = styled.div`
	flex: 3;
`;

const Semester = (props: Props) => {
	return (
		<Wrapper style={{paddingTop: 20}}>
			<Left>
				<SmallSection
					title={
						props.module.university === UZH ? 'Fakultät' : 'Departement'
					}
					content={props.module.faculty}
				/>
				<SmallSection
					title="Typ"
					content={renderModuleType(props.module.type, 'de')}
				/>
				<SmallSection
					title="Credits"
					content={String(
						parseFloat(String(props.semesterResponse.credits))
					)}
				/>
				<SmallSection
					title="Benotung"
					content={renderGrading(props.semesterResponse.grading, 'de')}
				/>
				<SmallSection
					title={rawStrings.REPEATABILITY.de}
					content={renderRepeatability(
						props.semesterResponse.repeatability
					)}
				/>
				{props.semesterResponse.registration_start ? (
					<SmallSection
						title="Buchbar"
						content={renderBookingPeriod(
							new Date(props.semesterResponse.registration_start),
							new Date(props.semesterResponse.registration_end as Date)
						)}
					/>
				) : null}
				{props.semesterResponse.cancellation_start ? (
					<SmallSection
						title="Stornierbar"
						content={renderBookingPeriod(
							new Date(props.semesterResponse.cancellation_start),
							new Date(props.semesterResponse.cancellation_end as Date)
						)}
					/>
				) : null}
				{props.semesterResponse.credit_hours ? (
					<SmallSection
						title="Semesterwochenstunden"
						content={props.semesterResponse.credit_hours + 'h/Woche'}
					/>
				) : null}
				{renderInstructors(props)}
				{renderResponsible(props)}
				{renderExternalLinks(props)}
			</Left>
			<div style={{width: 40}} />
			<Right>
				<Section
					title="Kommentar"
					content={props.semesterResponse.comment}
				/>
				<Section
					title="Beschreibung"
					content={props.semesterResponse.description}
				/>
				<Section
					title="Voraussetzungen"
					content={props.semesterResponse.prerequisites}
				/>
				<Section
					title="Zielgruppen"
					content={props.semesterResponse.audience}
				/>
				<Section
					title="Lernziel"
					content={props.semesterResponse.objective}
				/>
				<Section title="Inhalt" content={props.semesterResponse.content} />
				<AssessmentInfo
					institution={props.module.university}
					semester={props.semesterResponse}
				/>
				<Section
					title="Struktur"
					content={props.semesterResponse.structure}
				/>
				<Section
					title="Materialien"
					content={props.semesterResponse.materials}
				/>
				<BooksSection
					uni_identifier={props.module.uni_identifier}
					university={props.module.university}
				/>
				<Section
					title="Zusatzinformationen"
					content={props.semesterResponse.additional_information}
				/>
				<Section title="Prüfung" content={props.semesterResponse.test} />
				<Section
					title="Prüfungsliteratur"
					content={props.semesterResponse.exam_literature}
				/>
				<Section
					title="Vorkenntnisse"
					content={props.semesterResponse.prerecognitions}
				/>
				<br />
				{/* <DownloadBanner>
					Alle Informationen auch in deiner Hosentasche!
				</DownloadBanner> */}
			</Right>
		</Wrapper>
	);
};

export const ModuleDescription = (props) => {
	return (
		<div>
			<Semester {...props} />
		</div>
	);
};
