import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native-normalized';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import {getTypingIndicatorString} from '../api/get-typing-indicator-string';
import {getTypingIndicator} from '../api/get-typing-indicators';

const Container = styled(Animated.View)`
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 10px;
	position: absolute;
	bottom: 0;
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
	width: 100%;
	z-index: 0;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 12px;
`;

export const ChatTypingIndicator = (props: {
	uni_identifier: string;
	university: Institution;
}) => {
	const usersTyping = useAppState((state) =>
		getTypingIndicator(state, props.uni_identifier, props.university)
	);
	const language = useLanguage();
	const animatedTyping = useSharedValue(1);

	const [label, setLabel] = useState(
		getTypingIndicatorString(language, usersTyping)
	);

	const updateLabel = useCallback(() => {
		setLabel(getTypingIndicatorString(language, usersTyping));
	}, [language, usersTyping]);

	useEffect(() => {
		if (usersTyping.length === 0) {
			animatedTyping.value = withTiming(
				1,
				{duration: animatedTyping.value === 1 ? 0 : 100},
				() => {
					runOnJS(updateLabel)();
				}
			);
		} else {
			updateLabel();
			if (animatedTyping.value !== 0) {
				animatedTyping.value = withTiming(0, {
					duration: 100,
				});
			}
		}
	}, [animatedTyping, language, updateLabel, usersTyping]);

	const style = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: animatedTyping.value * 40,
				},
			],
		};
	});

	return (
		<Container style={style}>
			<Label>{label}</Label>
		</Container>
	);
};
