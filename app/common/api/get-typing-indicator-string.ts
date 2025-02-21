import {formatString} from '../../../core/functions/format-string';
import {AppLanguage} from '../../../core/models/app-language';
import rawStrings from '../../../core/raw-strings';
import {TypingIndicator} from '../../../core/types/chat';

export const getTypingIndicatorString = (
	language: AppLanguage,
	typingIndicators: TypingIndicator[]
) => {
	if (typingIndicators.length === 1) {
		return formatString(
			rawStrings.ONE_IS_TYPING[language],
			typingIndicators[0].user.username
		);
	}

	if (typingIndicators.length === 2) {
		return formatString(
			rawStrings.TWO_ARE_TYPING[language],
			typingIndicators[0].user.username,
			typingIndicators[1].user.username
		);
	}

	return formatString(
		rawStrings.N_ARE_TYPING[language],
		String(typingIndicators.length)
	);
};
