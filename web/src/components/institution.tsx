import React from 'react';
import {Route, Switch} from 'react-router-dom';
import styled from 'styled-components';
import {semesterRegex} from '../helpers/semester-regex';
import {rightPane} from './layout/pane';
import {Module} from './module';
import {SearchPage} from './search-page';

const Container = styled.div`
	flex-direction: column;
	display: flex;
	flex: 1;
`;

export const Institution = (props) => {
	const {match, location, history, ...otherProps} = props;

	return (
		<Container {...otherProps}>
			<Switch>
				<Route exact path={`${match.path}/search`} component={SearchPage} />

				<Route
					path={`${match.path}/:id/:semester${semesterRegex}/:content?`}
					component={rightPane(Module)}
				/>
			</Switch>
		</Container>
	);
};
