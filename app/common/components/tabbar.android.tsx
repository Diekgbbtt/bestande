import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {getAppearance} from '../../../core/functions/get-appearance';
import {hasGodmodeAccess} from '../../../core/functions/has-godmode-access';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import {Appearance} from '../../../core/types/appearance-state';
import {NotificationEvents} from '../api/NotificationEvents';
import {BottomTabNavigator} from '../api/Routes';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const MemoizedTabBar: React.FC<{
	ready: boolean;
	language: AppLanguage;
	theme: Appearance;
	isGod: boolean;
}> = React.memo(({ready, language, theme, isGod}) => {
	useEffect(() => {
		// Literally do nothing, but trigger a rerender when one of the props changes
	}, [ready, language, theme, isGod]);

	const tabBar = React.useRef<NavigationContainerRef>(null);
	React.useEffect(() => {
		const listener = (data: {
			uni_identifier?: string;
			university?: Institution;
		}) => {
			if (!tabBar.current) {
				return;
			}

			tabBar.current.dispatch(
				CommonActions.navigate({
					name: 'CreditDetailView',
					params: {
						moduleId: data.uni_identifier,
						institution: data.university,
					},
				})
			);
		};

		NotificationEvents?.on?.('new-notification', listener);
		return () => {
			NotificationEvents?.off?.('new-notification', listener);
			// noop
		};
	}, [tabBar]);

	if (!ready) {
		return (
			<Container>
				<UnifiedProgress />
			</Container>
		);
	}

	return <BottomTabNavigator />;
});

const TabBar = () => {
	const isGod = useAppState((state) => hasGodmodeAccess(state));

	const language = useLanguage();
	const theme = useAppState((state) => getAppearance(state.appearance));
	const ready = useAppState((state) => state.ready.app);
	return (
		<MemoizedTabBar
			isGod={isGod}
			language={language}
			theme={theme}
			ready={ready}
		/>
	);
};

// ts-unused-exports:disable-next-line
export default TabBar;
