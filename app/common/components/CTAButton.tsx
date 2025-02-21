import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {CheckItem} from '../../../core/components/Base';
import {globalStyles} from '../../../core/functions/styles';

const CTALabel = styled(Text)`
	color: white;
`;

const CTADomain = styled(Text)`
	color: rgba(255, 255, 255, 0.5);
	text-align: right;
`;

const CTAView = styled(View)`
	flex-direction: row;
	justify-content: center;
`;

export const CTAButton = (props: {
	label: string;
	domain: string;
	onPress: () => void;
}) => {
	const {label, domain, ...otherProps} = props;
	return (
		<CheckItem active {...otherProps} noCheck>
			<CTAView>
				<View>
					<CTALabel>{label}</CTALabel>
				</View>
				{domain ? (
					<View style={globalStyles.flex1}>
						<CTADomain>{domain}</CTADomain>
					</View>
				) : null}
			</CTAView>
		</CheckItem>
	);
};
