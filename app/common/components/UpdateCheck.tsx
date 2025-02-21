import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {VSpace} from '../../../core/components/Base';
import {appStatus} from '../../../core/functions/api';
import {useAppearance} from '../../../core/functions/use-appearance';
import {ExternalLink} from './ExternalLink';
import WarningContainer from './WarningContainer';

type State = {
	link: string | null;
	upToDate: boolean;
	warning: string | null;
	warningColor: string | null;
};

export const UpdateCheck = () => {
	const [state, setState] = useState<State>({
		upToDate: true,
		link: null,
		warning: null,
		warningColor: null,
	});
	const appearance = useAppearance();

	const fetchStatus = useCallback(async () => {
		try {
			const response = await appStatus(DeviceInfo.getVersion(), Platform.OS);
			setState({
				upToDate: response.upToDate,
				link: response.link,
				warning: response.warning,
				warningColor: response.warningColor,
			});
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	const renderNotUpToDate = useCallback(() => {
		if (!state.upToDate) {
			return (
				<View>
					<ExternalLink
						text="Update verfügbar – hier tippen"
						url={state.link as string}
						background={appearance.BLUE_TINT}
						color="white"
					/>
					<VSpace />
				</View>
			);
		}

		return null;
	}, [appearance.BLUE_TINT, state.link, state.upToDate]);

	const renderWarning = useCallback(() => {
		if (!state.warning) {
			return null;
		}

		return (
			<WarningContainer
				warning={state.warning}
				background={state.warningColor as string}
			/>
		);
	}, [state.warning, state.warningColor]);

	return (
		<View>
			{renderNotUpToDate()}
			{renderWarning()}
		</View>
	);
};
