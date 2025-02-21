import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';

const Label = styled(Text)`
	margin-left: 12px;
	margin-right: 12px;
	margin-top: 12px;
	margin-bottom: 12px;
`;

export const BoldHeader = (props: {children: ReactNode}) => {
	const appearance = useAppearance();
	return (
		<View>
			<Label
				style={{...uiKit.subheadEmphasizedObject, color: appearance.TITLE}}
			>
				{props.children}
			</Label>
		</View>
	);
};
