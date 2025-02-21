import DateTimePicker from '@react-native-community/datetimepicker';
import format from 'date-fns/format';
import React, {useCallback, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {Row} from '../../../core/components/Primitives';
import {Spacer} from '../../../core/components/UI/Spacer';
import {getAppearance} from '../../../core/functions/get-appearance';
import {useAppState} from '../../../core/functions/use-app-state';

const Centered = styled(Row)`
	justify-content: center;
`;

const Width300 = styled(View)`
	width: 300px;
`;

const DateButton = styled(View)`
	padding: 10px 20px;
	border-radius: 6px;
	border-width: 1px;
	border-color: ${(props) => props.theme.BLUE_TINT};
`;

const Label = styled(Text)`
	font-size: 16px;
	color: ${(props) => props.theme.BLUE_TINT};
`;

export const SmallCalendar: React.FC<
	React.ComponentProps<typeof DateTimePicker>
> = (props) => {
	const [showDate, setShowDate] = useState(false);
	const [showTime, setShowTime] = useState(false);

	const theme = useAppState((s) => getAppearance(s.appearance));

	const onChangeDate = useCallback(
		(e: any, d: Date) => {
			setShowDate(false);
			if (d) {
				props.onChange?.(e, d);
			}
		},
		[props]
	);

	const onChangeTime = useCallback(
		(e: any, d: Date) => {
			setShowTime(false);
			if (d) {
				props.onChange?.(e, d);
			}
		},
		[props]
	);

	const toggleDate = useCallback(() => {
		setShowDate(true);
	}, []);

	const toggleTime = useCallback(() => {
		setShowTime(true);
	}, []);

	if (Platform.OS === 'android') {
		return (
			<Centered>
				{showDate ? (
					<DateTimePicker
						display="default"
						value={props.value}
						mode="date"
						onChange={onChangeDate}
						themeVariant={theme}
					/>
				) : null}
				{showTime ? (
					<DateTimePicker
						display="default"
						value={props.value}
						mode="time"
						onChange={onChangeTime}
						themeVariant={theme}
					/>
				) : null}
				<TouchableOpacity onPress={toggleDate}>
					<DateButton>
						<View>
							<Label>{format(props.value, 'dd.MM.yyyy')}</Label>
						</View>
					</DateButton>
				</TouchableOpacity>
				<Spacer />
				<TouchableOpacity onPress={toggleTime}>
					<DateButton>
						<View>
							<Label>{format(props.value, 'HH:mm')}</Label>
						</View>
					</DateButton>
				</TouchableOpacity>
			</Centered>
		);
	}

	return (
		<Centered>
			<Width300>
				<DateTimePicker
					{...props}
					// @ts-expect-error weird type error
					themeVariant={theme}
				/>
			</Width300>
		</Centered>
	);
};
