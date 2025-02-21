import React from 'react';
import {ImageURISource, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Button, ButtonLabel} from '../../../core/components/BigButton';
import {Colors} from '../../../core/functions/Colors';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	padding-left: 12px;
	padding-right: 12px;
`;

const Row = styled(View)`
	flex-direction: row;
	margin-bottom: 8px;
	margin-top: 8px;
	margin-left: 4px;
	margin-right: 4px;
`;

const ItemContainer = styled(View)`
	flex: 1;
	align-items: center;
	padding-left: 4px;
	padding-right: 4px;
`;

const Label = styled(Text)`
	text-align: center;
`;

const Icon = styled(Image)`
	height: 30px;
	width: 30px;
	margin-bottom: 5px;
`;

const Title = styled(Text)`
	font-weight: bold;
	text-align: center;
	margin-top: 12px;
	margin-bottom: 12px;
`;

const Item = ({
	description,
	icon,
}: {
	description: string;
	icon: ImageURISource;
}) => {
	const appearance = useAppearance();
	return (
		<ItemContainer>
			<Icon
				style={{
					tintColor: Colors.Blue,
				}}
				source={icon}
			/>
			<Label style={{color: appearance.SUBTITLE}}>{description}</Label>
		</ItemContainer>
	);
};

export const FeatureShowcase = ({onStart}: {onStart: () => void}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<Title style={{color: appearance.TITLE}}>
				{rawStrings.INTRO_TEXT[language]}
			</Title>
			<Row>
				<Item
					description={rawStrings.VIEW_YOUR_TIMETABLE[language]}
					icon={require('../assets/twotone_calendar_today_black_48dp.png')}
				/>
				<Item
					description={rawStrings.SEE_INFOS_STATS[language]}
					icon={require('../assets/twotone_info_black_48dp.png')}
				/>
				<Item
					description={rawStrings.READ_REVIEWS[language]}
					icon={require('../assets/twotone_star_black_48dp.png')}
				/>
			</Row>
			<Row>
				<Item
					description={rawStrings.FIND_FOOD[language]}
					icon={require('../assets/twotone_fastfood_black_48dp.png')}
				/>
				<Item
					description={rawStrings.FIND_BUILDINGS[language]}
					icon={require('../assets/twotone_location_on_black_48dp.png')}
				/>
				<Item
					description={rawStrings.CHAT_WITH_OTHER_PEOPLE[language]}
					icon={require('../assets/twotone_chat_bubble_black_48dp.png')}
				/>
			</Row>
			<View style={{height: 10}} />
			<Button onPress={() => onStart()}>
				<ButtonLabel>{rawStrings.GET_STARTED[language]}</ButtonLabel>
			</Button>
		</Container>
	);
};
