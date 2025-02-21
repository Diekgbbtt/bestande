import format from 'date-fns/format';
import flatten from 'lodash/flatten';
import React, {Fragment, ReactNode, useCallback} from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {AssessmentInfo} from '../../../core/components/AssessmentInfo';
import {VSpace} from '../../../core/components/Base';
import {Block} from '../../../core/components/Block';
import {BlockText} from '../../../core/components/BlockText';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import BooksSection from '../../../core/components/BooksSection';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {Config} from '../../../core/data/Config';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {formatString} from '../../../core/functions/format-string';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import renderGrading from '../../../core/functions/render-grading';
import renderModuleType from '../../../core/functions/render-module-type';
import renderRepeatability from '../../../core/functions/render-repeatability';
import {schedulecacheKey} from '../../../core/functions/schedule-cache-key';
import {truthy} from '../../../core/functions/truthy';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {translate} from '../../../core/functions/uzh-faculty';
import {periodToString} from '../../../core/functions/uzh-period';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit} from '../../../core/models/credit';
import {ETH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {
	ApiResponse,
	initialModuleState,
	SemesterResponse,
} from '../../../core/reducers/api';
import {getApiResponse} from '../api/get-api-response';
import {EventAndEventSerie} from '../types/event-and-event-serie';
import {BestandeLink} from './BestandeLink';
import {Card} from './Card';
import {Event} from './Event';
import {Instructors} from './Instructors';
import {LinkContainer} from './LinkContainer';
import {OtherCoursesPreview} from './OtherCoursesPreview';
import {PersonPreview} from './PersonPreview';
import {Schedule} from './Schedule';
import {UrgentBanner} from './UrgentBanner';

const BOOKING = 'BOOKING';
const CANCELLATION = 'CANCELLATION';
const BOOKING_AND_CANCELLATION = 'BOOKING_AND_CANCELLATION';

type BookingWindowType =
	| 'BOOKING'
	| 'CANCELLATION'
	| 'BOOKING_AND_CANCELLATION';

const BookingType = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

type OwnProps = {
	moduleId: string;
	credit: Credit;
	semester: string;
};

const renderWindowType = (type: BookingWindowType, language: AppLanguage) => {
	switch (type) {
		case BOOKING:
			return rawStrings.BOOKING_WINDOW[language];
		case CANCELLATION:
			return rawStrings.CANCELLATION_WINDOW[language];
		case BOOKING_AND_CANCELLATION:
			return rawStrings.BOOKING_AND_CANCELLATION_WINDOW[language];
		default:
			return null;
	}
};

const renderOpenClosed = (
	type: BookingWindowType,
	open: boolean,
	language: AppLanguage
) => {
	if (open) {
		return (
			<Text style={{color: Colors.Green}}>
				{renderWindowType(type, language)}{' '}
				{rawStrings.OPEN[language].toLowerCase() + '\n'}
			</Text>
		);
	}

	return (
		<Text style={{color: Colors.Red}}>
			{renderWindowType(type, language)}{' '}
			{rawStrings.CLOSED[language].toLowerCase() + '\n'}
		</Text>
	);
};

const renderBookingPeriod = (
	start: Date,
	end: Date,
	type: BookingWindowType,
	language: AppLanguage
) => {
	if (Date.now() < start.getTime()) {
		return (
			<BookingType key={type}>
				<Text>{renderOpenClosed(type, false, language)}</Text>
				{`${rawStrings.OPEN[language]} ${
					rawStrings.FROM_TIME[language]
				} ${format(start, 'dd.MM.yyyy HH:mm')}${type === BOOKING ? '\n' : ''}`}
			</BookingType>
		);
	}

	if (end.getTime() < Date.now()) {
		return (
			<BookingType key={type}>
				<Text>{renderOpenClosed(type, false, language)}</Text>

				{formatString(
					rawStrings.DEADLINE_OVER[language],
					format(end, 'dd.MM.yyyy HH:mm')
				) +
					' ' +
					(type === BOOKING ? '\n' : '')}
			</BookingType>
		);
	}

	return (
		<BookingType key={type}>
			<Text>{renderOpenClosed(type, true, language)}</Text>
			{`${rawStrings.UNTIL[language]} ${format(end, 'dd.MM.yyyy HH:mm')}${
				type === BOOKING ? '\n' : ''
			}`}
		</BookingType>
	);
};

const renderBookingText = (
	currentSemester: SemesterResponse,
	language: AppLanguage
) => {
	if (
		currentSemester.registration_start &&
		currentSemester.registration_end &&
		currentSemester.registration_start === currentSemester.cancellation_start &&
		currentSemester.registration_end === currentSemester.cancellation_end
	) {
		return renderBookingPeriod(
			new Date(currentSemester.registration_start),
			new Date(currentSemester.registration_end),
			BOOKING_AND_CANCELLATION,
			language
		);
	}

	return [
		currentSemester.registration_start && currentSemester.registration_end
			? renderBookingPeriod(
					new Date(currentSemester.registration_start),
					new Date(currentSemester.registration_end),
					BOOKING,
					language
			  )
			: null,
		currentSemester.cancellation_start && currentSemester.cancellation_end
			? renderBookingPeriod(
					new Date(currentSemester.cancellation_start),
					new Date(currentSemester.cancellation_end),
					CANCELLATION,
					language
			  )
			: null,
	].filter(truthy);
};

export const CreditInfo: React.FC<OwnProps> = ({
	credit,
	moduleId,
	semester,
}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	const navigation = useNavigationInNative();
	const {
		details,
		schedule,
		loading,
		error,
		apiResponse,
		coronaInfo,
	} = useAppState((state) => {
		const institution = CreditHelpers.getInstitution(credit);
		const moduleState =
			state.api[getChatRoomIdentifier(moduleId, institution)] ||
			initialModuleState;
		const _schedule = state.schedule[schedulecacheKey(credit, semester)];
		const apiResponse_ = getApiResponse(state, institution, moduleId);

		return {
			...moduleState,
			details: moduleState.details as ApiResponse,
			schedule: _schedule,
			apiResponse: apiResponse_,
			coronaInfo: state.corona.data?.cancellationDeadlineBanner,
			language: state.language.selectedLanguage,
		};
	});

	const getCurrentSemester = useCallback(() => {
		return details.semesters.find(
			(s) => s.period_human === semester
		) as SemesterResponse;
	}, [details.semesters, semester]);

	const renderResponsible = useCallback(() => {
		const currentSemester = getCurrentSemester();
		if (currentSemester.responsible.length === 0) {
			return null;
		}

		return (
			<View>
				<BlockTextTitle style={{marginBottom: 6}}>
					{rawStrings.RESPONSIBLE[language]}
				</BlockTextTitle>
				{currentSemester.responsible.filter(truthy).map((r) => {
					return (
						<Fragment key={r.uni_identifier}>
							<PersonPreview person={r} />
							<VSpace />
						</Fragment>
					);
				})}
			</View>
		);
	}, [getCurrentSemester, language]);
	const renderInstructors = useCallback(() => {
		const currentSemester = getCurrentSemester();
		return <Instructors semester={currentSemester} />;
	}, [getCurrentSemester]);
	const renderExam = useCallback(() => {
		const currentSemester = getCurrentSemester();
		if (!currentSemester.test) {
			return null;
		}

		const smartAddedSeries = schedule?.schedule?.length
			? schedule.schedule.filter((s) => {
					return s.smart;
			  })
			: [];
		const smartAddedEvents = flatten(
			smartAddedSeries.map((serie): EventAndEventSerie[] => {
				return serie.events.map((e, i) => {
					return {
						event: e,
						eventSerie: serie,
						uni_identifier: moduleId,
						university: CreditHelpers.getInstitution(credit),
						number: i + 1,
					};
				});
			})
		);
		return (
			<React.Fragment>
				<Block title={rawStrings.EXAM[language]} text={currentSemester.test} />
				{smartAddedEvents.length > 0 ? (
					<View
						style={{
							marginLeft: -12,
							marginRight: -12,
							marginBottom: 12,
							padding: 12,
							backgroundColor: 'rgba(0, 0, 255, 0.05)',
						}}
					>
						<BlockText
							italic
							text={rawStrings.FOLLOWING_ADDED_TO_TIMETABLE[language]}
							style={{marginBottom: 6}}
						/>
						{smartAddedEvents.map((event) => {
							return (
								<TouchableHighlight
									key={event.event._id}
									style={{marginBottom: 5}}
									onPress={() => {
										navigation.navigate('EventDetailView', {
											unislug: mapToUniSlug(event.university),
											uni_identifier: event.event.id as string,
											number: event.number,
											eventserieid: event.eventSerie.id as string,
											semester: periodToString(event.event.period),
										});
									}}
								>
									<Event
										number={event.number}
										event={event.event}
										eventSerie={event.eventSerie}
										fill
									/>
								</TouchableHighlight>
							);
						})}
					</View>
				) : null}
			</React.Fragment>
		);
	}, [
		credit,
		getCurrentSemester,
		language,
		moduleId,
		navigation,
		schedule?.schedule,
	]);

	const renderLinks = useCallback(() => {
		const currentSemester = getCurrentSemester();
		let links: ReactNode[] = [];
		if (currentSemester.links) {
			links = currentSemester.links.map((l) => (
				<Fragment key={l.url}>
					<LinkContainer link={l.url} label={l.title} />
					<VSpace />
				</Fragment>
			));
		}

		if (currentSemester.olat) {
			links.push(
				<Fragment key={currentSemester.olat.url}>
					<LinkContainer
						link={currentSemester.olat.url}
						label={details.university === ETH ? 'ILIAS' : 'OLAT'}
					/>
					<VSpace />
				</Fragment>
			);
		}

		if (links.length === 0) {
			return null;
		}

		return (
			<React.Fragment>
				<BlockTextTitle>{rawStrings.LINKS[language]}</BlockTextTitle>
				<View style={{height: 3}} />
				{links}
			</React.Fragment>
		);
	}, [getCurrentSemester, details, language]);
	const renderContent = useCallback(() => {
		if (loading) {
			return <UnifiedProgress />;
		}

		if (error) {
			if (/not found/.exec(error)) {
				return (
					<Text style={{color: appearance.TITLE}}>
						{rawStrings.NO_INFOS_FOUND[language]}
					</Text>
				);
			}

			if (/Network request failed/.exec(error)) {
				return (
					<Text style={{color: appearance.TITLE}}>
						{rawStrings.NO_INFO_LOADED[language]}
					</Text>
				);
			}

			return (
				<Text style={{color: appearance.TITLE}}>
					{rawStrings.ERROR[language]}: {error}
				</Text>
			);
		}

		const currentSemester = getCurrentSemester();
		if (!currentSemester) {
			return (
				<Text style={{color: appearance.TITLE}}>
					{formatString(rawStrings.NO_INFO_FOR_SEMESTER[language], semester)}
				</Text>
			);
		}

		const germanName = details.translatedNames
			? details.translatedNames.find((d) => d.language === 'de')
			: null;

		const englishName = details.name;

		const fullName =
			(language === 'de' ? germanName?.value : details.name) ?? details.name;
		const germanNameIsTheSame = germanName?.value === fullName;
		const englishNameIsTheSame = englishName === fullName;

		return (
			<View>
				<Block title={rawStrings.FULL_NAME[language]} text={fullName} />

				{germanName && !germanNameIsTheSame && language !== 'de' ? (
					<Block
						title={rawStrings.GERMAN_NAME[language]}
						text={germanName.value}
					/>
				) : null}
				{englishName && !englishNameIsTheSame && language !== 'en' ? (
					<Block title={rawStrings.ENGLISH_NAME[language]} text={englishName} />
				) : null}

				<Block
					title={rawStrings.TYPE[language]}
					text={renderModuleType(details.type, language)}
				/>
				<Block
					title={rawStrings.COMMENT[language]}
					text={currentSemester.comment}
					comment
				/>
				{details.departments?.length ? (
					<Block
						title={rawStrings.DEPARTMENT[language]}
						text={details.departments.join('\n')}
					/>
				) : (
					<Block
						title={rawStrings.FACULTY[language]}
						text={translate(details.faculty, language)}
					/>
				)}
				{currentSemester.credits ? (
					<Block
						title={rawStrings.CREDITS[language]}
						text={parseFloat(String(currentSemester.credits))}
					/>
				) : null}
				<Schedule semester={semester} credit={credit} />
				<VSpace />
				{renderInstructors()}
				{currentSemester.description ? (
					<Block
						title={rawStrings.DESCRIPTION[language]}
						text={currentSemester.description}
					/>
				) : null}
				{currentSemester.registration_start ||
				currentSemester.cancellation_start ? (
					<>
						<Block
							title={rawStrings.BOOKING[language]}
							text={renderBookingText(currentSemester, language)}
						/>
						{coronaInfo ? (
							<UrgentBanner
								link={coronaInfo.link}
								text={coronaInfo.text[language]}
							/>
						) : null}
					</>
				) : null}
				{currentSemester.prerequisites ? (
					<Block
						title={rawStrings.PREREQUISITES[language]}
						text={currentSemester.prerequisites}
					/>
				) : null}
				{currentSemester.audience ? (
					<Block
						title={rawStrings.AUDIENCE[language]}
						text={currentSemester.audience}
					/>
				) : null}
				{currentSemester.objective ? (
					<Block
						title={rawStrings.LEARNING_OUTCOME[language]}
						text={currentSemester.objective}
					/>
				) : null}
				{currentSemester.prerecognitions ? (
					<Block
						title={rawStrings.PRERECOGNITIONS[language]}
						text={currentSemester.prerecognitions}
					/>
				) : null}
				{renderExam()}
				<AssessmentInfo
					institution={details.university}
					semester={currentSemester}
				/>
				<Block
					title={rawStrings.GRADING[language]}
					text={renderGrading(currentSemester.grading, language)}
				/>
				<Block
					title={rawStrings.REPEATABILITY[language]}
					text={renderRepeatability(currentSemester.repeatability, language)}
				/>
				{currentSemester.lecture_notes ? (
					<Block
						title={rawStrings.LECTURE_NOTES[language]}
						text={currentSemester.lecture_notes}
					/>
				) : null}
				{currentSemester.materials ? (
					<Block
						title={rawStrings.MATERIALS[language]}
						text={currentSemester.materials}
					/>
				) : null}
				{Config.BOOKS ? (
					<BooksSection
						uni_identifier={getModuleId(credit) as string}
						university={CreditHelpers.getInstitution(credit)}
					/>
				) : null}
				{renderResponsible()}
				{renderLinks()}
				{apiResponse.details?.courseCode ? (
					<>
						<VSpace />
						<BlockTextTitle>{rawStrings.GROUP[language]}</BlockTextTitle>
						<OtherCoursesPreview apiResponse={apiResponse.details} />
					</>
				) : null}
				<VSpace />
				<BestandeLink apiResponse={details} />
				{details.university === ETH ? (
					<Block
						title={rawStrings.NUMBER[language]}
						text={details.uni_identifier}
					/>
				) : null}
			</View>
		);
	}, [
		loading,
		error,
		getCurrentSemester,
		language,
		credit,
		details,
		semester,
		renderInstructors,
		coronaInfo,
		renderExam,
		renderResponsible,
		renderLinks,
		apiResponse.details,
		appearance.TITLE,
	]);
	return <Card>{renderContent()}</Card>;
};
