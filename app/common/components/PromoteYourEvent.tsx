import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {openLink} from '../../../core/functions/open-link';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const DetailCell = styled(View)`
	flex-direction: row;
	align-items: center;
	padding: 10px;
	padding-left: 15px;
`;

const DetailLabel = styled(Text)`
	flex: 1;
	color: rgba(0, 0, 0, 0.3);
`;

const DetailIcon = styled(Image)`
	height: 24px;
	width: 24px;
	margin-left: -2px;
	margin-right: 8px;
`;

const PromoteYourEvent = () => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<TouchableOpacity onPress={() => openLink('https://bestande.ch/werbung')}>
			<DetailCell style={{backgroundColor: appearance.BACKGROUND}}>
				<DetailIcon
					style={{tintColor: appearance.ICON_TINT}}
					source={require('../assets/promote.png')}
				/>
				<DetailLabel style={{color: appearance.SUBTITLE}}>
					{rawStrings.PROMOTED_BESTANDE_EVENTS[language]}
				</DetailLabel>
			</DetailCell>
		</TouchableOpacity>
	);
};

export default PromoteYourEvent;
