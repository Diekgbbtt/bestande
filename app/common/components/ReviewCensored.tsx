import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const ReviewCensored = () => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<View style={{padding: 10}}>
			<Text style={{color: appearance.SUBTITLE, fontStyle: 'italic'}}>
				{rawStrings.COMMENT_GOT_DELETED_BY_BESTANDE[language]}
			</Text>
		</View>
	);
};

export default ReviewCensored;
