import {useActionSheet} from '@expo/react-native-action-sheet';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	align-items: flex-end;
`;

const Label = styled(Text)`
	font-size: 14px;
	color: ${(props) => props.theme.SUBTITLE};
	font-weight: bold;
`;

const ArrowDown = styled(Image)`
	height: 30px;
	width: 30px;
	tint-color: ${(props) => props.theme.SUBTITLE};
	margin-top: -1px;
`;

const Touchable = styled(TouchableOpacity)`
	flex-direction: row;
	align-items: center;
`;

export type SortOption<T extends string> = {
	key: T;
	str: keyof typeof rawStrings;
};

type Props<T extends string> = {
	availableOptions: SortOption<T>[];
	setSort: (option: T) => void;
	current: T;
};

export const SortPicker = <T extends string>({
	setSort,
	availableOptions,
	current,
}: Props<T>) => {
	const language = useLanguage();
	const actionSheet = useActionSheet();

	const currentOption = availableOptions.find(
		(o) => o.key === current
	) as SortOption<T>;

	const onChangerPress = React.useCallback(() => {
		const cancel = rawStrings.CANCEL[language];

		const options = [
			...availableOptions.map((o) => rawStrings[o.str][language]),
			cancel,
		];
		actionSheet.showActionSheetWithOptions(
			{options, cancelButtonIndex: options.indexOf(cancel)},
			(index) => {
				const selectedKey = availableOptions.find((o, i) => index === i);
				if (!selectedKey) {
					return;
				}

				setSort(selectedKey.key);
			}
		);
	}, [actionSheet, availableOptions, language, setSort]);
	return (
		<Container>
			<Touchable onPress={onChangerPress}>
				<Label>{rawStrings[currentOption.str][language].toUpperCase()}</Label>
				<ArrowDown
					source={require('../assets/baseline_arrow_drop_down_black_48dp.png')}
				/>
			</Touchable>
		</Container>
	);
};
