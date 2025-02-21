import React from 'react';
import {Keyboard, TouchableOpacity} from 'react-native';
import {getNewestSemesterFromSearchResult} from '../../../core/functions/get-newest-semester-from-search-result';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';
import {globalNavigate} from '../api/set-master-navigator';
import {SearchResult} from './SearchResult';

export const TouchableSearchResult: React.FC<{
	result: AlgoliaCreditResult;
}> = ({result}) => {
	const onPress = React.useCallback(() => {
		Keyboard.dismiss();
		globalNavigate('CreditDetailView', {
			moduleId: result.uni_identifier,
			semester: getNewestSemesterFromSearchResult(result) as string,
			institution: result.university,
			credit: null,
			chatFirst: false,
		});
	}, [result]);

	return (
		<TouchableOpacity onPress={onPress}>
			<SearchResult result={result} />
		</TouchableOpacity>
	);
};
