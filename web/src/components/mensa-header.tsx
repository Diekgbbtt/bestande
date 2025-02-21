import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';
import {MensaApiResponse} from '../../../core/types/food';
import MensaOpening from './mensa-opening';

const MensaName = styled.div`
	font-weight: bold;
`;

const MensaHeaderView = styled.div`
	background: ${darken(0.02, '#ffffff')};
	padding: 12px;
	border-radius: 2px;
	${mobile`
		margin-bottom: 0;
	`};
`;

export const MensaHeader = (props: {mensa: MensaApiResponse}) => {
	const {mensa} = props;
	return (
		<MensaHeaderView>
			<MensaName>{mensa.name}</MensaName>
			<MensaOpening closed={mensa.plan.length === 0} mensa={mensa} />
		</MensaHeaderView>
	);
};
