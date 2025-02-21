import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import {MarkdownView} from 'react-native-markdown-view';
import {Image, Text} from 'react-native-normalized';
import stripIndent from 'strip-indent';
import styled from 'styled-components';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {addImpression} from '../../../core/functions/api';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {getDomainFromUrl} from '../../../core/functions/get-domain-from-url';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {openLink} from '../../../core/functions/open-link';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import {CTA} from '../../../core/models/impression-level';
import {PROMOTION} from '../../../core/models/impression-type';
import {PromotionResponse} from '../../../core/models/promotion';
import {
	DATE,
	NONE,
	START_TIME,
	TIME,
} from '../../../core/models/time-display-type';
import {UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {ImageType} from '../../../core/types/image';
import {markdownStyles} from '../styles/markdown';
import {BigCard} from './Card';
import {CTAButton} from './CTAButton';
import {FactIcon} from './FactIcon';
import {HeaderImage} from './HeaderImage';
import {Map} from './Map';
import PromoteYourEvent from './PromoteYourEvent';
import Title from './Title';

const Horizontal = styled(View)`
	flex-direction: row;
`;

const Promoter = styled(Text)`
	margin-top: 3px;
	color: gray;
`;

const Description = styled(View)``;

const Flex = styled(View)`
	flex: 1;
`;

const FactContainer = styled(View)`
	flex-direction: row;
	align-self: center;
	justify-content: center;
`;

const ViewsLabel = styled(Text)`
	font-weight: bold;
	font-size: 11px;
	color: gray;
	margin-left: -4px;
	margin-top: 1px;
`;

const DetailCell = styled(View)`
	margin-top: 8px;
	flex-direction: row;
	align-items: center;
`;

const DetailLabel = styled(Text)`
	flex: 1;
	color: rgba(0, 0, 0, 0.8);
`;

const DetailIcon = styled(Image)`
	tint-color: gray;
	height: 24px;
	width: 24px;
	margin-left: -2px;
	margin-right: 8px;
`;

const DetailAction = styled(Image)`
	tint-color: gray;
	height: 24px;
	width: 24px;
`;

const getDomainName = (url: string) => {
	return getDomainFromUrl(url);
};

const getCdnIdentifier = (
	promotion: PromotionResponse,
	language: AppLanguage
): ImageType => {
	return (
		promotion.translations?.[language]?.image ?? (promotion.image as ImageType)
	);
};

const getTranslatedPromotionField = (
	promotion: PromotionResponse,
	field: 'description' | 'promoter_link' | 'name' | 'promoter',
	language: AppLanguage
): string => {
	return promotion?.translations?.[language]?.[field] ?? promotion[field];
};

const PromotedEvent: React.FC = () => {
	const identifier = useAppState((state) => getUserHash(state, null));
	const language = useLanguage();
	const appearance = useAppearance();
	const [showMap, setShowMap] = useState<boolean>(false);
	const route = useRoute<RouteProp<RN5Routes, 'PromotedEvent'>>();
	const {event} = route.params;

	const toggleMap = React.useCallback(() => {
		setShowMap((prevState) => !prevState);
	}, []);

	const renderMap = React.useCallback(() => {
		if (!showMap) {
			return null;
		}

		if (!event.location) {
			return null;
		}

		const {latitude, longitude, address} = event.location;
		return (
			<View style={{marginTop: 10}}>
				<Map
					latitude={latitude}
					longitude={longitude}
					title={address}
					height={150}
				/>
			</View>
		);
	}, [showMap, event.location]);

	const renderCTAButton = React.useCallback(() => {
		if (!event.promoter_link) {
			return null;
		}

		return (
			<React.Fragment>
				<View style={{height: 10}} />
				<CTAButton
					onPress={() => {
						addImpression({
							institution: UZH,
							identifier,
							content: PROMOTION,
							content_id: event._id,
							level: CTA,
							platform: Platform.OS,
							language,
						})
							.then((impression) => {
								return console.log(
									'Added promoted event impression',
									impression
								);
							})
							.catch((err) => {
								console.log('Could not add promoted event', err);
							});
						openLink(
							getTranslatedPromotionField(event, 'promoter_link', language)
						);
					}}
					label={event.cta_text || rawStrings.MORE_INFOS[language]}
					domain={getDomainName(event.promoter_link)}
				/>
			</React.Fragment>
		);
	}, [event, identifier, language]);

	const renderTime = React.useCallback(() => {
		const {time_display} = event;
		let label = '';
		if (time_display === NONE) {
			return null;
		}

		if (time_display === TIME) {
			label = `${EventHelpers.getFullDate(
				event.start_date,
				language
			)}, ${EventHelpers.getTime(event.start_date)} - ${EventHelpers.getTime(
				event.end_date
			)}`;
		}

		if (time_display === START_TIME) {
			label = `${EventHelpers.getFullDate(
				event.start_date,
				language
			)}, ${EventHelpers.getTime(event.start_date)} Uhr`;
		}

		if (time_display === DATE) {
			label = `${EventHelpers.getFullDate(event.start_date, language)}`;
		}

		return (
			<DetailCell>
				<DetailIcon source={require('../assets/events.png')} />
				<DetailLabel>{label}</DetailLabel>
			</DetailCell>
		);
	}, [language, event]);

	const renderLocation = React.useCallback(() => {
		if (!event.location) {
			return null;
		}

		const {address} = event.location;
		return (
			<View>
				<DetailCell>
					<DetailIcon source={require('../assets/location.png')} />
					<DetailLabel>{address}</DetailLabel>
					<TouchableOpacity onPress={() => toggleMap()}>
						<DetailAction
							source={require('../assets/chevron_down.png')}
							style={
								showMap
									? {
											transform: [{rotateZ: '180deg'}],
									  }
									: {}
							}
						/>
					</TouchableOpacity>
				</DetailCell>
				{renderMap()}
			</View>
		);
	}, [event.location, renderMap, showMap, toggleMap]);

	return (
		<ScrollView
			style={{
				backgroundColor: appearance.BACKGROUND,
			}}
		>
			{event.image ? (
				<View>
					<HeaderImage image={getCdnIdentifier(event, language)} />
				</View>
			) : null}
			<BigCard>
				<Horizontal>
					<Flex>
						<Title style={{color: appearance.TITLE}}>
							{getTranslatedPromotionField(event, 'name', language)}
						</Title>
						<Promoter style={{color: appearance.SUBTITLE}}>
							{rawStrings.BY[language]}{' '}
							{getTranslatedPromotionField(event, 'promoter', language)}
						</Promoter>
					</Flex>
					<FactContainer>
						<FactIcon
							style={{tintColor: appearance.SUBTITLE}}
							source={require('../assets/eye.png')}
						/>
						<ViewsLabel style={{color: appearance.SUBTITLE}}>
							{event.statistics ? event.statistics.click || '0' : '0'}
						</ViewsLabel>
					</FactContainer>
				</Horizontal>
				{renderCTAButton()}
				{renderTime()}
				{renderLocation()}
				<Description>
					{event.logo ? (
						<Image
							source={{
								uri: getImageUrl({
									cdn_identifier: event.logo.cdn_identifier,
									height: event.logo.height * 2,
									width: event.logo.width * 2,
									crop: null,
								}) as string,
							}}
							style={{
								height: event.logo.height,
								width: event.logo.width,
								marginTop: 10,
							}}
						/>
					) : null}
					<MarkdownView
						styles={markdownStyles(appearance)}
						onLinkPress={(link: string) => {
							openLink(link);
						}}
					>
						{stripIndent(
							getTranslatedPromotionField(event, 'description', language) || ''
						)}
					</MarkdownView>
				</Description>
			</BigCard>
			<PromoteYourEvent />
		</ScrollView>
	);
};

export default PromotedEvent;
