import memoize from 'lodash/memoize';
import {Platform, StyleSheet} from 'react-native';
import {User} from '../types/user-state';
import {AppearanceMap} from './use-appearance';

const styles = StyleSheet.create({
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	},
	strikethrough: {
		textDecorationLine: 'line-through',
	},
	code: {
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
	},
	username: {
		fontWeight: 'bold',
	},
});

const boldPattern = /(\s\*|^\*)(?=\S)([\s\S]*?\S)\*(?![*\S])/gm;
const italicPattern = /(\s_|^_)(?=\S)([\s\S]*?\S)_(?![_\S])/gm;
const strikethroughPattern = /(\s~|^~)(?=\S)([\s\S]*?\S)~(?![~\S])/gm;
const codePattern = /(\s`|^`)(?=\S)([\s\S]*?\S)`(?![`\S])/gm;
const usernamePattern = /\[(?=\S)user:([\s\S]*?\S)(?![\]\S])/g;

const renderBoldText = (matchingString: string) => {
	const match = matchingString.match(boldPattern) as RegExpMatchArray;
	return `${match[0].replace(/\*(.*)\*/, '$1')}`;
};

const renderItalicText = (matchingString: string) => {
	const match = matchingString.match(italicPattern) as RegExpMatchArray;
	return `${match[0].replace(/_(.*)_/, '$1')}`;
};

const renderStrikethroughText = (matchingString: string) => {
	const match = matchingString.match(strikethroughPattern) as RegExpMatchArray;
	// actually makes a difference...
	return `${match[0].replace(/\~(.*)\~/, '$1')}`; // eslint-disable-line no-useless-escape
};

const renderCodePattern = (matchingString: string) => {
	const match = matchingString.match(codePattern) as RegExpMatchArray;
	// actually makes a difference...
	return `${match[0].replace(/\`(.*)\`/, '$1')}`; // eslint-disable-line no-useless-escape
};

const renderUsernamePattern = (users: User[]) => (matchingString: string) => {
	const match = matchingString.match(usernamePattern) as RegExpMatchArray;
	try {
		const userId = match[0].match(/\[user:(.*)\]/)?.[1] as string;
		const username = users.find((u) => u.id === userId)?.username as string;
		return `@${match[0].replace(/\[user:(.*)\]/, username)}`;
	} catch (err) {
		return '';
	}
};

export const parsePatterns = memoize(
	(users: User[], appearance: AppearanceMap) => [
		{
			pattern: boldPattern,
			style: styles.bold,
			renderText: renderBoldText,
		},
		{
			pattern: italicPattern,
			style: styles.italic,
			renderText: renderItalicText,
		},
		{
			pattern: strikethroughPattern,
			style: styles.strikethrough,
			renderText: renderStrikethroughText,
		},
		{
			pattern: codePattern,
			style: [
				styles.code,
				{backgroundColor: appearance.MESSAGE_MONOSPACE_BACKGROUND},
			],
			renderText: renderCodePattern,
		},
		{
			pattern: usernamePattern,
			style: [
				styles.username,
				{
					backgroundColor: appearance.BORDER_COLOR,
				},
			],
			renderText: renderUsernamePattern(users),
		},
	]
);
