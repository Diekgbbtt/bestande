import React, {useCallback, useRef} from 'react';
import {Platform, StyleSheet, TextInput} from 'react-native';
import styled from 'styled-components';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const TextContainer = styled(TextInput)`
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
	color: ${(props) => props.theme.TITLE};
`;

const styles = StyleSheet.create({
	textInput: {
		paddingLeft: 16,
		fontSize: 16,
		// Android seems to be 8 px higher for some reasong
		paddingTop: Platform.select({
			android: 6,
			default: 10,
		}),
		paddingBottom: Platform.select({
			android: 6,
			default: 10,
		}),
		borderRadius: 20,
		lineHeight: 20,
		...Platform.select({
			web: {
				outlineWidth: 0,
				outlineColor: 'transparent',
				outlineOffset: 0,
			},
		}),
	},
});

interface ComposerProps {
	text: string;
	onTextChanged: (text: string) => void;
}

export const ChatComposer: React.FC<ComposerProps> = ({
	text,
	onTextChanged,
}) => {
	const ref = useRef<TextInput>(null);
	const appearance = useAppearance();

	const onChangeText = useCallback(
		(newText: string) => {
			onTextChanged?.(newText);
		},
		[onTextChanged]
	);

	const language = useLanguage();

	const placeholder = rawStrings.TYPE_A_MESSAGE[language];

	const onTouchStart = useCallback(() => {
		ref.current?.focus();
	}, []);

	return (
		<TextContainer
			ref={ref}
			testID={placeholder}
			accessible
			accessibilityLabel={placeholder}
			placeholder={placeholder}
			placeholderTextColor={appearance.SUBTITLE}
			editable
			onChangeText={onChangeText}
			multiline
			style={styles.textInput}
			value={text}
			onTouchStart={onTouchStart}
			enablesReturnKeyAutomatically
			underlineColorAndroid="transparent"
		/>
	);
};
