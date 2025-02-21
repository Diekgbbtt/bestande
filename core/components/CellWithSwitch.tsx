import {lighten} from 'polished';
import React from 'react';
import {Platform, Switch, View} from 'react-native';
import {globalStyles} from '../functions/styles';
import {useAppearance} from '../functions/use-appearance';
import {Base, Content, Label} from './Base';
import {UnifiedProgress} from './UnifiedProgress';

type Props = {
	tintColor?: string;
	loading: boolean;
	enabled: boolean;
	onChange: (value: boolean) => void;
	text: string;
	disabled?: boolean;
};

export const CellWithSwitch = (props: Props) => {
	const appearance = useAppearance();
	const tintColor = props.tintColor || appearance.BLUE_TINT;
	return (
		<Base padded>
			<Content>
				<Label>{props.text}</Label>
			</Content>
			<View style={globalStyles.flex1} />
			{props.loading ? (
				<View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
					<UnifiedProgress />
				</View>
			) : (
				<Switch
					// @ts-expect-error
					trackColor={
						Platform.OS === 'ios'
							? {true: tintColor, false: null}
							: {
									true: lighten(0.4, appearance.BLUE_TINT),
									false: Platform.OS === 'web' ? 'rgba(0, 0, 0, 0.1)' : null,
							  }
					}
					disabled={Boolean(props.disabled)}
					style={{alignSelf: 'center'}}
					thumbColor={
						Platform.OS === 'ios'
							? undefined
							: props.enabled
							? appearance.BLUE_TINT
							: undefined
					}
					value={props.enabled}
					onValueChange={props.onChange}
				/>
			)}
		</Base>
	);
};
