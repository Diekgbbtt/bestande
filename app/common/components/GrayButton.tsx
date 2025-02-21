import React, {ReactChild} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Base, Content} from '../../../core/components/Base';
import {globalStyles} from '../../../core/functions/styles';
import {useAppearance} from '../../../core/functions/use-appearance';

export const GrayButton = (
	props: TouchableOpacityProps & {children: ReactChild}
) => {
	const {children, ...otherProps} = props;
	const appearance = useAppearance();
	return (
		<TouchableOpacity {...otherProps}>
			<Base
				padded
				style={{
					backgroundColor: appearance.BASE_COLOR,
				}}
			>
				<Content style={globalStyles.flex1}>{children}</Content>
			</Base>
		</TouchableOpacity>
	);
};
