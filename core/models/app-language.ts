export type AppLanguage = 'de' | 'en';
export type AppLanguageDeprecated = AppLanguage | 'it';

export type LanguageState = {
	deviceLanguage: AppLanguage;
	selectedLanguage: AppLanguage;
};
