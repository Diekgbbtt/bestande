import React, {Fragment} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {AnimatedNativeScrollView} from '../components/AnimatedScrollView';
import {CheckItem, Count, Label, VSpace} from '../components/Base';
import {BlockTextTitle} from '../components/BlockTextTitle';
import {Dismisser} from '../components/Dismisser';
import {
	selectFilterState,
	selectMensaLabels,
	selectMensaPlan,
} from '../functions/selectors';
import {useAppState} from '../functions/use-app-state';
import {useLanguage} from '../functions/use-language';
import {usePull} from '../functions/use-pull';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import rawStrings from '../raw-strings';
import {turnOffFilter, turnOnFilter} from '../reducers/food';
import {SafeSideSpace} from './SafeSideSpace';

const Container = styled(AnimatedNativeScrollView)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

export const CategoriesFilter: React.FC = () => {
	const language = useLanguage();
	const labels = useAppState((state) => selectMensaLabels(state));
	const filterState = useAppState((state) => selectFilterState(state));
	const mensaPlan = useAppState((state) => selectMensaPlan(state));

	const navigation = useNavigationInNative();
	const dispatch = useDispatch();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	if (labels.length === 0) {
		return null;
	}

	return (
		<Container {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />
			<SafeSideSpace>
				<View style={{padding: 12}}>
					<BlockTextTitle>
						{rawStrings.CATEGORY_FILTER[language]}
					</BlockTextTitle>
					<VSpace />
					<VSpace />
					{labels.map((l) => {
						const active = filterState[l.key] !== false;
						return (
							<Fragment key={l.key}>
								<CheckItem
									active={active}
									onPress={() => {
										if (filterState[l.key] === false) {
											dispatch(turnOnFilter(l.key));
										} else {
											dispatch(turnOffFilter(l.key));
										}
									}}
								>
									<Label active={active}>{l.label[language]}</Label>
									<Count active={active}>
										(
										{
											(mensaPlan.data || [])
												.filter((m) => m.plan.length > 0)
												.filter((m) => m.tags.find((t) => t.key === l.key))
												.length
										}
										)
									</Count>
								</CheckItem>
								<VSpace />
							</Fragment>
						);
					})}
				</View>
			</SafeSideSpace>
		</Container>
	);
};
