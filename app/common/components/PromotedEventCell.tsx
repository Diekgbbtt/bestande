import React, {useEffect} from 'react';
import {Platform, TouchableHighlight, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {addImpression} from '../../../core/functions/api';
import {Colors} from '../../../core/functions/Colors';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {openLink} from '../../../core/functions/open-link';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {CLICK, VIEW} from '../../../core/models/impression-level';
import {PROMOTION} from '../../../core/models/impression-type';
import {PromotionResponse} from '../../../core/models/promotion';

const Label = styled(Text)`
	color: white;
	background-color: rgba(0, 0, 0, 0);
	font-size: 12px;
`;

const Img = styled(Image)`
	width: 135;
	height: 70;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	opacity: 0.6;
`;

const Cell = styled(TouchableHighlight)`
	background-color: ${Colors.Orange};
	margin: 3px;
	margin-top: 6px;
	border-radius: 2px;
	overflow: hidden;
	background-color: black;
	height: 70px;
`;

const ContentView = styled(View)`
	padding: 4px;
`;

export const PromotedEventCell: React.FC<{
	promotion: PromotionResponse;
}> = ({promotion}) => {
	const language = useLanguage();
	const navigation = useNavigationInNative();
	const identifier = useAppState((state) => getUserHash(state, null));
	const institution = useAppState((state) => state.institution.institution);
	useEffect(() => {
		addImpression({
			institution,
			identifier,
			content: PROMOTION,
			content_id: promotion._id,
			platform: Platform.OS,
			level: VIEW,
			language,
		})
			.then((impression) => {
				console.log('Added promoted event impression', impression);
			})
			.catch((err) => {
				console.log('Could not add promoted event impression', err);
			});
	}, [identifier, institution, language, promotion._id]);
	return (
		<Cell
			onPress={() => {
				addImpression({
					institution,
					identifier,
					content: PROMOTION,
					content_id: promotion._id,
					platform: Platform.OS,
					level: CLICK,
					language,
				})
					.then((impression) => {
						console.log('Added promoted event impression', impression);
					})
					.catch((err) => {
						console.log('Could not add promoted event impression', err);
					});
				if (promotion.open_in_browser) {
					openLink(promotion.promoter_link);
				} else {
					navigation.navigate('PromotedEvent', {
						event: promotion,
					});
				}
			}}
		>
			<View>
				{promotion.image ? (
					<Img
						source={{
							uri: getImageUrl({
								height: 140,
								width: 270,
								cdn_identifier: promotion.image.cdn_identifier,
								crop: null,
							}),
						}}
					/>
				) : null}
				<ContentView>
					<Label>{promotion.name}</Label>
					<Label style={{fontStyle: 'italic'}}>{promotion.promoter}</Label>
					{promotion.live ? null : <Label>ENTWURF</Label>}
				</ContentView>
			</View>
		</Cell>
	);
};
