import {
	RouteProp,
	useNavigation,
	useRoute,
	useScrollToTop,
} from '@react-navigation/native';
import React, {Fragment, useEffect, useReducer, useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';
import {
	BaseTouchable,
	Chevron,
	Content,
	Label,
	shadow,
	VSpace,
} from '../../../core/components/Base';
import {BlockText} from '../../../core/components/BlockText';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {FullScreenError} from '../../../core/components/FullScreenError';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {getEventAndEventSerie} from '../../../core/functions/api';
import renderModuleType from '../../../core/functions/render-module-type';
import {globalStyles} from '../../../core/functions/styles';
import {truthy} from '../../../core/functions/truthy';
import {mapToUniSlug, mapToUniversity} from '../../../core/functions/uni-slug';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {GetEventResponse} from '../../../core/types/types';
import {globalNavigate} from '../api/set-master-navigator';
import {Card} from './Card';
import {Event} from './Event';
import {Header} from './Header';
import {PersonPreview} from './PersonPreview';

type State = {
	response: GetEventResponse | null;
	error: Error | null;
	loading: boolean;
};

const initialState: State = {
	response: null,
	error: null,
	loading: false,
};

type Actions =
	| {
			type: 'fetch';
	  }
	| {
			type: 'receive';
			data: GetEventResponse;
	  }
	| {
			type: 'error';
			error: Error;
	  };

const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'fetch': {
			return {
				response: null,
				loading: true,
				error: null,
			};
		}

		case 'receive': {
			return {
				response: action.data,
				loading: false,
				error: null,
			};
		}

		case 'error': {
			return {
				response: null,
				error: action.error,
				loading: false,
			};
		}

		default:
			return state;
	}
};

export const EventDetailView = () => {
	const route = useRoute<RouteProp<RN5Routes, 'EventDetailView'>>();
	const navigation = useNavigation();
	const {
		uni_identifier,
		unislug,
		number,
		eventserieid,
		semester,
	} = route.params;
	const institution = mapToUniversity(unislug);

	const [state, dispatch] = useReducer(reducer, initialState);
	const language = useLanguage();

	useEffect(() => {
		dispatch({type: 'fetch'});
		getEventAndEventSerie({
			event_serie_id: eventserieid,
			id: uni_identifier as string,
			semester,
			university: institution,
		})
			.then((res) => {
				dispatch({type: 'receive', data: res});
			})
			.catch((err) => {
				dispatch({type: 'error', error: err});
			});
	}, [eventserieid, institution, uni_identifier, semester]);

	useEffect(() => {
		if (state.response?.event_serie.category) {
			navigation.setOptions({
				title: `${renderModuleType(
					state.response.event_serie.category,
					language
				)} ${route.params.number}`,
			});
		}
	}, [
		navigation,
		language,
		route.params.number,
		state.response?.event_serie.category,
	]);

	const appearance = useAppearance();
	const scrollToTop = useRef(null);
	useScrollToTop(scrollToTop);

	if (state.error) {
		return <FullScreenError error={state.error.message} />;
	}

	if (!state.response) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<ScrollView
			ref={scrollToTop}
			style={{
				flex: 1,
				backgroundColor: appearance.BACKGROUND,
			}}
			contentContainerStyle={{
				paddingLeft: 12,
				paddingRight: 12,
				paddingTop: 15,
			}}
		>
			<SafeSideSpace>
				<BlockTextTitle>{rawStrings.EVENT[language]}</BlockTextTitle>
				<VSpace />
				<View>
					<Event
						number={number}
						event={state.response.event}
						fill
						eventSerie={state.response.event_serie}
					/>
				</View>
				{state.response.event.rooms && state.response.event.rooms.length > 0 ? (
					<React.Fragment>
						<VSpace />
						<VSpace />
						<BlockTextTitle>{rawStrings.ROOMS[language]}</BlockTextTitle>
						<VSpace />
						{(state.response.event.rooms || []).map((room) => {
							return (
								<Fragment key={room.name}>
									<BaseTouchable
										padded
										onPress={() =>
											globalNavigate('RoomDetailView', {
												uni_identifier: room.id,
												unislug: mapToUniSlug(room.university),
											})
										}
									>
										<Content style={globalStyles.flex1}>
											<Label>{room.name}</Label>
											<View style={globalStyles.flex1} />
											<Chevron
												source={require('../../../core/assets/collapsed.png')}
											/>
										</Content>
									</BaseTouchable>
									<VSpace />
								</Fragment>
							);
						})}
					</React.Fragment>
				) : null}
				{state.response.event_serie.people &&
				state.response.event_serie.people.length > 0 ? (
					<React.Fragment>
						<VSpace />
						<VSpace />
						<BlockTextTitle>{rawStrings.PEOPLE[language]}</BlockTextTitle>
						<VSpace />
						{(state.response.event_serie.people || [])
							.filter(truthy)
							.map((lecturer) => {
								return (
									<Fragment key={lecturer.name}>
										<PersonPreview person={lecturer} />
										<VSpace />
									</Fragment>
								);
							})}
					</React.Fragment>
				) : null}

				{state.response.event.smart ? (
					<React.Fragment>
						<VSpace />
						<VSpace />
						<BlockTextTitle>
							{rawStrings.AUTOMATICALLY_RECOGNIZED[language]}
						</BlockTextTitle>
						<VSpace />
						<Card {...shadow} style={{borderRadius: 5}}>
							<BlockText italic text={rawStrings.EVENT_RECOGNIZED[language]} />
							<BlockText comment text={state.response.event.comments} />
						</Card>
					</React.Fragment>
				) : null}
				{[
					state.response.event.eth_exam_type,
					state.response.event.eth_personal_examinator,
					state.response.event.eth_exam_helpers,
				].some(Boolean) ? (
					<React.Fragment>
						<Header text={rawStrings.EXAM_INFO[language].toUpperCase()} />
						<Card>
							{state.response.event.eth_exam_type ? (
								<React.Fragment>
									<BlockTextTitle>
										{rawStrings.EXAM_TYPE[language]}
									</BlockTextTitle>
									<BlockText
										style={{marginBottom: 6}}
										text={
											state.response.event.eth_exam_type === 'oral'
												? rawStrings.ORAL[language]
												: state.response.event.eth_exam_type === 'written'
												? rawStrings.WRITTEN[language]
												: null
										}
									/>
								</React.Fragment>
							) : null}
							{state.response.event.eth_personal_examinator ? (
								<React.Fragment>
									<BlockTextTitle>
										{rawStrings.EXAMINATORS[language]}
									</BlockTextTitle>
									<BlockText
										style={{marginBottom: 6}}
										text={state.response.event.eth_personal_examinator.join(
											'\n'
										)}
									/>
								</React.Fragment>
							) : null}
							{state.response.event.eth_exam_helpers ? (
								<React.Fragment>
									<BlockTextTitle>
										{rawStrings.WRITTEN_AIDS[language]}
									</BlockTextTitle>
									<BlockText
										style={{marginBottom: 6}}
										text={state.response.event.eth_exam_helpers}
									/>
								</React.Fragment>
							) : null}
						</Card>
					</React.Fragment>
				) : null}
			</SafeSideSpace>
		</ScrollView>
	);
};
