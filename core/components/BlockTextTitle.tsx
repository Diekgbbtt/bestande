import React from 'react';
import {TextProps, TextStyle} from 'react-native';
import {Text} from 'react-native-normalized';
import {truthy} from '../functions/truthy';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';

export type BlockTextProps = TextProps & {
	children: string;
	style?: TextStyle;
};

export const BlockTextTitle = ({
	style,
	children,
	...otherProps
}: BlockTextProps) => {
	const appearance = useAppearance();
	return (
		<Text
			style={[
				uiKit.subheadEmphasizedObject,
				{color: appearance.TITLE},
				style,
			].filter(truthy)}
			{...otherProps}
		>
			{children}
		</Text>
	);
};
