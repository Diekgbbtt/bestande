import {StackActions, useLinkProps} from '@react-navigation/native';
import sortBy from 'lodash/sortBy';
import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Config} from '../data/Config';
import {getModuleId} from '../functions/get-module-id';
import {getSearchResultLink} from '../functions/get-search-result-link';
import {Related} from '../reducers/api';
import {VSpace} from './Base';
import {Correlation} from './Correlation';
import {ModulePreview} from './ModulePreview';

const ShadowView = styled(View)`
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

export const RelatedItem: React.FC<{related: Related; totalCount: number}> = ({
	related,
	totalCount,
}) => {
	const {module, count} = related;
	const A = Config.IS_WEBSITE ? Link : React.Fragment;

	const aProps = Config.IS_WEBSITE ? {to: getSearchResultLink(module)} : {};
	const linkProp = useLinkProps({
		to: `/credits/${module.university}/${getModuleId(module)}/${
			sortBy(module.semesters, (s) => 0 - s.period)[0].period_human
		}`,

		action: StackActions.push('CreditDetailView', {
			moduleId: getModuleId(module),
			institution: module.university,
			semester: sortBy(module.semesters, (s) => 0 - s.period)[0].period_human,
		}),
	});

	const onPress = React.useCallback(
		(e: GestureResponderEvent) => {
			if (Config.IS_WEBSITE) {
				return;
			}

			linkProp.onPress(e);
		},
		[linkProp]
	);

	// TODO: Only TouchableOpacity and pass {...linkProps}
	// once old web version has been removed
	return (
		// @ts-expect-error
		<A key={module.uni_identifier} {...aProps}>
			<TouchableOpacity onPress={onPress}>
				<ShadowView>
					<ModulePreview
						credit={module}
						suffix={<Correlation count={count} totalCount={totalCount} />}
					/>
				</ShadowView>
				<VSpace />
				<VSpace />
			</TouchableOpacity>
		</A>
	);
};
