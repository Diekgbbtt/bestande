import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {CreditConfig, CreditStatus} from '../../../core/models/credit';
import {getConfig} from '../api/get-config';

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
	},
	ball: {
		height: 12,
		width: 12,
		backgroundColor: 'black',
		marginRight: 12,
		borderRadius: 7,
		marginLeft: 1,
		alignSelf: 'center',
		marginTop: 1,
	},
	label: {
		flex: 1,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
});

const renderBall = (config: CreditConfig) => {
	const {color} = config;
	return <View style={[styles.ball, {backgroundColor: color}]} />;
};

const renderLabel = (config: CreditConfig) => {
	return (
		<Text style={[styles.label, {color: config.color}]}>{config.label}</Text>
	);
};

export const ModuleStatus: React.FC<{
	status: CreditStatus;
}> = ({status}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	const config = getConfig(status, language, appearance);
	return (
		<View style={[styles.wrapper, {flex: 6}]}>
			{renderBall(config)}
			{renderLabel(config)}
		</View>
	);
};
