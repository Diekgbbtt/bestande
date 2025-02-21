import React from 'react';
import styled from 'styled-components';
import {BLUE} from '../../../../core/models/colors';

const Container = styled.div`
	flex-direction: row;
	display: flex;
`;

const Panel = styled.div`
	background: ${BLUE};
	height: 90px;
	width: 100px;
	border-radius: 3px;
`;

const Column = styled.div``;

const Timetable = () => {
	return (
		<Container>
			<Column style={{marginRight: 5}}>
				<Panel />
				<Panel style={{height: 60, marginTop: 5}} />
			</Column>
			<Column>
				<Panel style={{height: 120, marginTop: 50}} />
			</Column>
		</Container>
	);
};

export default Timetable;
