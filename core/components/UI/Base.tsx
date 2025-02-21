import {AppearanceMap} from '../../functions/use-appearance';

declare module 'styled-components' {
	interface DefaultTheme extends AppearanceMap {
		promotedEventHeight: number;
	}
}

export const BASE_PADDING = 7;
