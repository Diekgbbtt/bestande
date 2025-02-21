import React, {useCallback} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {Row} from '../../../core/components/Primitives';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {TabIndex} from '../../../core/functions/get-chat-room-identifier';
import {getRatingsStateForModule} from '../../../core/functions/get-ratings-state-for-module';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {getApiResponse} from '../api/get-api-response';
import {globalNavigate} from '../api/set-master-navigator';
import {CreditDetailViewTab} from './CreditDetailViewTab';
import {NextEvent} from './NextEvent';
import {RatingBadge} from './RatingBadge';
import {StatsBadge} from './StatsBadge';

const HorizontalDivider = styled(View)`
	height: 3px;
	background-color: ${(props) => props.theme.BORDER_COLOR};
	width: 100%;
	margin-top: -3px;
`;

export const CreditDetailViewTabs = (props: {
	setIndex: (idx: string) => void;
	index: string;
	chatFirst: boolean;
	semester: string | null;
	moduleId: string;
	credit: Credit;
}) => {
	const {setIndex} = props;
	const appearance = useAppearance();
	const apiResponse = useAppState((state) =>
		getApiResponse(
			state,
			CreditHelpers.getInstitution(props.credit),
			props.moduleId
		)
	);
	const language = useLanguage();
	// TODO: Don't hardcode this state
	const ratings = useAppState((state) =>
		getRatingsStateForModule(
			state,
			props.credit.institution as Institution,
			props.moduleId,
			'best'
		)
	);
	const goToTab = useCallback(
		(index: TabIndex) => {
			setIndex(index);
		},
		[setIndex]
	);
	const chatTab = (
		<CreditDetailViewTab
			name="chat"
			icon={require('../assets/twotone_chat_bubble_black_48dp.png')}
			text={rawStrings.CHAT[language]}
			active={props.index === 'chat'}
			setTab={() => goToTab('chat')}
		/>
	);

	const infoTab = (
		<CreditDetailViewTab
			name="info"
			icon={require('../assets/twotone_info_black_48dp.png')}
			text={rawStrings.INFORMATION_SHORT[language]}
			active={props.index === 'info'}
			setTab={() => goToTab('info')}
		/>
	);
	const tabOrder = props.chatFirst ? (
		<>
			{chatTab}
			{infoTab}
		</>
	) : (
		<>
			{infoTab}
			{chatTab}
		</>
	);
	return (
		<>
			<View style={{backgroundColor: appearance.BACKGROUND}}>
				<NextEvent
					detailView
					credit={props.credit}
					semester={props.semester as string}
					onClicked={({number, eventSerie, event}) => {
						globalNavigate('EventDetailView', {
							number,
							uni_identifier: event.id as string,
							unislug: mapToUniSlug(CreditHelpers.getInstitution(props.credit)),
							semester: props.semester as string,
							eventserieid: eventSerie.id as string,
						});
					}}
				/>
			</View>
			<View>
				<Row style={{backgroundColor: appearance.BACKGROUND}}>
					{tabOrder}
					<CreditDetailViewTab
						name="timetable"
						text={rawStrings.TIMETABLE[language]}
						icon={require('../assets/calendar.png')}
						active={props.index === 'timetable'}
						setTab={() => goToTab('timetable')}
					/>
					<CreditDetailViewTab
						name="ratings"
						text={rawStrings.RATINGS[language]}
						active={props.index === 'ratings'}
						icon={require('../assets/star-full.png')}
						setTab={() => goToTab('ratings')}
						rightMarkup={
							<RatingBadge
								mod={apiResponse.details as ApiResponse}
								ratings={ratings}
							/>
						}
					/>
					<CreditDetailViewTab
						name="statistics"
						text={rawStrings.STATS[language]}
						active={props.index === 'statistics'}
						icon={require('../assets/twotone_pie_chart_black_48dp.png')}
						setTab={() => goToTab('statistics')}
						rightMarkup={
							<StatsBadge mod={apiResponse.details as ApiResponse} />
						}
					/>

					<CreditDetailViewTab
						name="files"
						icon={require('../assets/twotone_folder_black_48dp.png')}
						text={rawStrings.FILES[language]}
						active={props.index === 'files'}
						setTab={() => goToTab('files')}
					/>

					{apiResponse?.details?.related ? (
						<CreditDetailViewTab
							name="related"
							icon={require('../assets/twotone_widgets_black_48dp.png')}
							text={rawStrings.RELATED[language]}
							active={props.index === 'related'}
							setTab={() => goToTab('related')}
						/>
					) : null}
				</Row>
				<HorizontalDivider />
			</View>
		</>
	);
};
