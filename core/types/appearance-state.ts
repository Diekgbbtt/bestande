export type Appearance = 'light' | 'dark';
export type AppearanceSetting = 'explicit-light' | 'explicit-dark' | 'auto';

export type AppearanceState = {
	systemSetting: Appearance;
	preference: AppearanceSetting;
};
