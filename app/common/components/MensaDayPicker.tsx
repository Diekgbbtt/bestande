import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import React from 'react';
import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import {MensaDay} from '../../../core/data/uzh-mensa';
import {getTwoLetterLabel} from '../../../core/functions/mensa-helpers';
import {MensaInject, selectMensa} from '../../../core/functions/selectors';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {changeDay, ChangeDay} from '../../../core/reducers/food';
import {AppState} from '../../../core/types/app-state';
import {Container, Item, Label, Touchable} from './NativeHeader';

const TodayIcon = styled(Image)<{
	isSelected?: boolean;
}>`
	width: 14px;
	height: 14px;
	margin-right: 3px;
	margin-top: -5px;
`;

const Subtitle = styled(Text)<{
	isSelected?: boolean;
}>`
	font-size: 10px;
	font-weight: bold;
	margin-top: -16px;
	margin-bottom: 8px;
`;

const WeekdayToday = ({
	today,
	isSelected,
}: {
	today: boolean;
	isSelected: boolean;
}) => {
	const appearance = useAppearance();
	if (!today) {
		return null;
	}

	return (
		<TodayIcon
			style={{
				tintColor: isSelected ? 'white' : appearance.HEADER_SUBTITLE_COLOR,
			}}
			isSelected={isSelected}
			source={require('../assets/twotone_calendar_today_black_48dp.png')}
		/>
	);
};

const WeekdayComp = ({
	day,
	currentDay,
	change,
	resolvedDate,
}: MensaInject & {
	day: MensaDay;
	change: (day: MensaDay) => ChangeDay;
}) => {
	const language = useLanguage();
	const date = resolvedDate(day);
	const today = isToday(new Date(date as number));
	const isSelected = day === currentDay;
	const appearance = useAppearance();
	return (
		<Touchable onPress={() => change(day)}>
			<Item style={{flexDirection: 'column'}}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<WeekdayToday isSelected={isSelected} today={today} />
					<Label isSelected={isSelected}>
						{getTwoLetterLabel(day, language)}
					</Label>
				</View>
				{date ? (
					<Subtitle
						isSelected={isSelected}
						style={{
							color: isSelected ? 'white' : appearance.HEADER_SUBTITLE_COLOR,
						}}
					>
						{format(new Date(date), 'd.M')}
					</Subtitle>
				) : null}
			</Item>
		</Touchable>
	);
};

const Weekday = connect(
	(state: AppState) => selectMensa(state) as MensaInject,
	{
		change: changeDay,
	}
)(WeekdayComp);

const MensaDayPicker = () => {
	return (
		<Container>
			<Weekday day="montag" />
			<Weekday day="dienstag" />
			<Weekday day="mittwoch" />
			<Weekday day="donnerstag" />
			<Weekday day="freitag" />
		</Container>
	);
};

export default MensaDayPicker;
