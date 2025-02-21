import React, {useCallback, useMemo} from 'react';
import {TextProps} from 'react-native';
import {Text} from 'react-native-normalized';
import {Tag} from '../../../core/components/FilterBase';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';

export type SearchFacet = {
	type:
		| 'departments'
		| 'faculty'
		| 'semester'
		| 'credits'
		| 'ratings'
		| 'passrate';
	name: string;
};

export const SearchLightLabel: React.FC<{
	active: boolean;
}> = ({active, children}) => {
	const appearance = useAppearance();

	const style: TextProps['style'] = useMemo(() => {
		return [
			uiKit.bodyEmphasizedObject,
			{
				color: active ? 'white' : appearance.BUTTON_LABEL_COLOR,
				fontSize: 14,
				fontWeight: 'normal',
			},
		];
	}, [active, appearance.BUTTON_LABEL_COLOR]);
	return <Text style={style}>{children}</Text>;
};

const CountIndicator: React.FC<{
	active: boolean;
	count: number | null;
}> = ({active, count}) => {
	if (count === null) {
		return null;
	}

	return <SearchLightLabel active={active}>({count})</SearchLightLabel>;
};

export const SearchFacetButton: React.FC<{
	type: SearchFacet['type'];
	name: string;
	count: number | null;
	setFacet: (facet: SearchFacet) => void;
	active: boolean;
}> = ({name, count, type, setFacet, active}) => {
	const onPress = useCallback(() => {
		setFacet({type, name});
	}, [name, setFacet, type]);

	return (
		<Tag onPress={onPress} active={active}>
			{name} <CountIndicator active={active} count={count} />
		</Tag>
	);
};
