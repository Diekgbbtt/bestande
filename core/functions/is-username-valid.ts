import {AppLanguage} from '../models/app-language';
import rawStrings from '../raw-strings';

const validCharacters = /[A-ZÄÖÜÉÀÈa-zäöüéàè0-9_\-@\s]/;

export const isUsernameValid = (
	username: string,
	currentUsername: string | null,
	language: AppLanguage
): string | null => {
	if (username.startsWith(' ')) {
		return rawStrings.USERNAME_CANNOT_START_WITH_SPACE[language];
	}

	if (username.startsWith(' ')) {
		return rawStrings.USERNAME_CANNOT_END_WITH_SPACE[language];
	}

	if (username.length < 3) {
		return rawStrings.USERNAME_MUST_BE_MINIMUM_LENGTH[language];
	}

	if (username.length > 25) {
		return rawStrings.USERNAME_MUST_BE_MAX_LENGTH[language];
	}

	if (
		currentUsername &&
		currentUsername.toLowerCase() === username.toLowerCase()
	) {
		return rawStrings.USERNAME_SAME_AS_CURRENT[language];
	}

	for (const char of username) {
		if (!validCharacters.exec(char)) {
			return rawStrings.CHARACTER_IS_NOT_ALLOWED[language] + ': ' + char;
		}
	}

	return null;
};
