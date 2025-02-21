import React from 'react';
import styled from 'styled-components';
import {getNameWithoutTitle} from '../../../core/models/person';
import {InnerWrapper, Wrapper} from './layout/entity-preview';

const Subtitle = styled.div`
	color: gray;
	font-size: 12px;
	margin-top: -2px;
`;

const PersonPreview = (props) => {
	return (
		<Wrapper>
			<InnerWrapper>
				<div>
					<div>{getNameWithoutTitle(props.person)}</div>
					{props.subtitle ? <Subtitle>{props.subtitle}</Subtitle> : null}
				</div>
			</InnerWrapper>
		</Wrapper>
	);
};

export default PersonPreview;
