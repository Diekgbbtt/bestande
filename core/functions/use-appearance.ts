import {darken, lighten} from 'polished';
import {Appearance, AppearanceState} from '../types/appearance-state';
import {Colors} from './Colors';
import {getAppearance} from './get-appearance';
import {useAppState} from './use-app-state';

export type AppearanceMap = {
	BACKGROUND: string;
	TITLE: string;
	SECTION_HEADER_BACKGROUND: string;
	SUBTITLE: string;
	ICON_TINT: string;
	COUNTS_INDICATOR_LEGEND: string;
	CHAT_PREVIEW_SYSTEM_MESSAGE: string;
	CHAT_PREVIEW_MESSAGE: string;
	INTERSTITIAL_BACKGROUND: string;
	TABBAR_COLOR: string;
	TABBAR_BORDER: string;
	TABBAR_ICONTINT: string;
	BASE_COLOR: string;
	BUTTON_LABEL_COLOR: string;
	BORDER_COLOR: string;
	COMMENT: string;
	HEADER_BACKGROUND: string;
	BLUE_TINT: string;
	BAR_FILL: string;
	BAR_BACKGROUND: string;
	REVIEW_BACKGROUND: string;
	THEME: string;
	HEADER_SUBTITLE: string;
	UZH_LOGO_TINT_COLOR: string;
	HEADER_SUBTITLE_COLOR: string;
	HEADER_INPUT_COLOR: string;
	TAG_BACKGROUND: string;
	MEAL_DESCRIPTION: string;
	MEAL_TAG_BORDER: string;
	STATUS_BAR_COLOR: string;
	NO_USERNAME_AVAILABLE_BG: string;
	MESSAGE_DELETED: string;
	MESSAGE_MONOSPACE_BACKGROUND: string;
	MESSAGE_FLASH: string;
};

// eslint-disable-next-line complexity
export const mapAppearance = (appearance: Appearance): AppearanceMap => {
	return {
		THEME: appearance,
		BACKGROUND: appearance === 'dark' ? '#222' : '#fff',
		TITLE: appearance === 'dark' ? '#fff' : '#000',
		SECTION_HEADER_BACKGROUND: appearance === 'dark' ? '#0a0a0a' : '#efefef',
		SUBTITLE: appearance === 'dark' ? darken(0.3, '#ffffff') : 'gray',
		ICON_TINT: appearance === 'dark' ? darken(0.2, '#ffffff') : 'gray',
		COUNTS_INDICATOR_LEGEND:
			appearance === 'dark' ? lighten(0.4, '#000000') : darken(0.4, '#ffffff'),
		CHAT_PREVIEW_SYSTEM_MESSAGE: appearance === 'dark' ? '#555' : '#aaa',
		CHAT_PREVIEW_MESSAGE: appearance === 'dark' ? '#999' : '#666',
		INTERSTITIAL_BACKGROUND:
			appearance === 'dark' ? lighten(0.15, '#000000') : '#fafafa',
		TABBAR_COLOR: appearance === 'dark' ? '#2a2a2a' : '#fff',
		TABBAR_BORDER: appearance === 'dark' ? '#3a3a3a' : '#a7a7aa',
		MESSAGE_DELETED:
			appearance === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
		TABBAR_ICONTINT:
			appearance === 'dark'
				? 'rgba(255, 255, 255, 0.5)'
				: 'rgba(0, 0, 0, 0.35)',
		BASE_COLOR:
			appearance === 'dark'
				? 'rgba(255, 255, 255, 0.05)'
				: 'rgba(0, 0, 0, 0.05)',
		BUTTON_LABEL_COLOR:
			appearance === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
		BORDER_COLOR:
			appearance === 'dark'
				? 'rgba(255, 255, 255, 0.15)'
				: 'rgba(0, 0, 0, 0.1)',
		COMMENT: appearance === 'dark' ? '#D2DD0E' : '#960',
		HEADER_BACKGROUND: appearance === 'dark' ? '#444' : '#444',
		BLUE_TINT: appearance === 'dark' ? lighten(0.2, Colors.Blue) : Colors.Blue,
		BAR_FILL: appearance === 'dark' ? '#aaaaaa' : '#999999',
		BAR_BACKGROUND: appearance === 'dark' ? '#555555' : '#eeeeee',
		REVIEW_BACKGROUND: appearance === 'dark' ? lighten(0.3, '#000') : '#edf4ff',
		HEADER_SUBTITLE: darken(0.3, '#ffffff'),
		UZH_LOGO_TINT_COLOR: appearance === 'dark' ? '#fff' : '#000000',
		HEADER_SUBTITLE_COLOR: appearance === 'dark' ? '#999' : '#999',
		HEADER_INPUT_COLOR: 'rgba(255, 255, 255, 0.5)',
		TAG_BACKGROUND:
			appearance === 'dark'
				? lighten(0.2, 'rgb(0, 0, 0)')
				: darken(0.055, 'rgb(255, 255, 255)'),
		MEAL_DESCRIPTION:
			appearance === 'dark'
				? lighten(0.25, '#ffffff')
				: darken(0.25, '#000000'),
		MEAL_TAG_BORDER:
			appearance === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
		STATUS_BAR_COLOR: appearance === 'dark' ? '#444' : Colors.Green,
		NO_USERNAME_AVAILABLE_BG: appearance === 'dark' ? '#0f0f0f' : '#f5f5f5',
		MESSAGE_MONOSPACE_BACKGROUND:
			appearance === 'dark'
				? 'rgba(255, 255, 255, 0.05)'
				: 'rgba(0, 0, 0, 0.05)',
		MESSAGE_FLASH: appearance === 'dark' ? '#000' : lighten(0.5, Colors.Blue),
	};
};

const light = mapAppearance('light');
const dark = mapAppearance('dark');

export const getAppearanceMap = (state: AppearanceState) => {
	const appearance = getAppearance(state);
	return appearance === 'dark' ? dark : light;
};

export const useAppearance = () => {
	const appearance = useAppState((state) => getAppearance(state.appearance));
	return appearance === 'dark' ? dark : light;
};
