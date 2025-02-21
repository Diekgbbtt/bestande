import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useAppearance} from '../functions/use-appearance';
import {ModulePreview} from '../models/module';
import {ApiResponse} from '../reducers/api';
import Stars from './Stars';

export const RatingSummary = ({
	result,
}: {
	result: Partial<ApiResponse> | Partial<ModulePreview>;
}) => {
	const appearance = useAppearance();
	const {ratingSummary} = result;
	return (
		<View style={{display: 'flex', flexDirection: 'row'}}>
			{result.ratingSummary?.average ? (
				<View
					style={{
						width: 70,
						marginLeft: -1,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Stars disabled size={14} rating={result.ratingSummary.average} />
				</View>
			) : null}
			{ratingSummary?.total && ratingSummary.total > 0 ? (
				<Text style={{fontSize: 12, color: appearance.SUBTITLE, marginLeft: 3}}>
					{`(${ratingSummary.total})`}
				</Text>
			) : null}
		</View>
	);
};
