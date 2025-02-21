import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components';
import {ThemeProvider as ThemeProviderNative} from 'styled-components/native';
import {AccountWatcher} from '../../../core/components/AccountWatcher';
import {ChatRoomSubscription} from '../../../core/components/ChatRoomSubscription';
import {ChatServerManager} from '../../../core/components/ChatServerManager';
import {CreditSyncer} from '../../../core/components/CreditSyncer';
import {Hud} from '../../../core/components/Hud';
import {HudManager} from '../../../core/components/HudManager';
import {Config} from '../../../core/data/Config';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {
	AppearanceMap,
	useAppearance,
} from '../../../core/functions/use-appearance';
import {getBookedCredits} from '../api/get-booked-credits';
import {CoronaFetcher} from './CoronaFetcher';
import {DarkModeWatcher} from './DarkModeWatcher';
import {GradeOptManager} from './GradeOptManager';
import {PushNotificationManager} from './PushNotificationManager';
// @ts-expect-error
import TabBar from './tabbar';

declare module 'styled-components' {
	interface DefaultTheme extends AppearanceMap {
		promotedEventHeight: number;
	}
}

export const Main = () => {
	const appearanceMap = useAppearance();
	const onlyBooked = useAppState((state) => getBookedCredits(state));
	const ready = useAppState((state) => state.ready.app);

	return (
		<ThemeProviderNative
			theme={{
				promotedEventHeight: Config.PROMOTED_EVENTS ? 89 : 0,
				...appearanceMap,
			}}
		>
			<ThemeProvider
				theme={{
					promotedEventHeight: Config.PROMOTED_EVENTS ? 89 : 0,
					...appearanceMap,
				}}
			>
				<SafeAreaProvider>
					<ActionSheetProvider>
						<View style={globalStyles.flex1}>
							<StatusBar
								barStyle="light-content"
								backgroundColor={appearanceMap.STATUS_BAR_COLOR}
							/>
							<DarkModeWatcher />
							{ready ? (
								<>
									<PushNotificationManager />
									<ChatServerManager />
									<GradeOptManager />
									{Config.COURSE_SYNC ? <CreditSyncer /> : null}
									{Config.COURSE_SYNC ? <AccountWatcher /> : null}
									{onlyBooked.map((credit) => (
										<ChatRoomSubscription
											key={
												getChatRoomIdentifier(
													getModuleId(credit) as string,
													CreditHelpers.getInstitution(credit)
												) + getUniqueIdentifier(credit)
											}
											university={CreditHelpers.getInstitution(credit)}
											uni_identifier={getModuleId(credit) as string}
										/>
									))}
									<Hud ref={(hud) => HudManager.setHud(hud as Hud)} />
									<CoronaFetcher />
								</>
							) : null}
							<TabBar />
						</View>
					</ActionSheetProvider>
				</SafeAreaProvider>
			</ThemeProvider>
		</ThemeProviderNative>
	);
};
