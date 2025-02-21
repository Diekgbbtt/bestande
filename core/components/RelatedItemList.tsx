import React, {useMemo} from 'react';
import {View} from 'react-native';
import {RelatedResponse} from '../reducers/api';
import {VSpace} from './Base';
import {RelatedItem} from './RelatedItem';

export const RelatedItemList: React.FC<{
	modules: RelatedResponse;
	totalCount: number;
}> = ({modules, totalCount}) => {
	// TODO: Do this filtering on the backend
	const onlyWithModule = useMemo(() => modules.filter((m) => m.module), [
		modules,
	]);

	return (
		<View>
			<VSpace />
			{onlyWithModule.map((related) => {
				return (
					<RelatedItem
						key={related.module?.uni_identifier}
						related={related}
						totalCount={totalCount}
					/>
				);
			})}
		</View>
	);
};
