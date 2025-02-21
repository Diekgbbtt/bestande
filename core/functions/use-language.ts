import {useAppState} from './use-app-state';

export const useLanguage = () => {
	return useAppState((s) => s.language.selectedLanguage);
};
