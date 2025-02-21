import {Label} from '@jonny/rebass';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import {BLUE} from '../models/colors';

const StyledLabel = styled(Label)``;

const InfoContainer = styled.div`
	margin-bottom: 5px;
`;

const Description = styled.div`
	a {
		color: ${BLUE};
		border-bottom: 1px solid ${BLUE};
		&:hover {
			background: rgb(0, 0, 255, 0.04);
		}
	}
	p {
		margin-top: 0;
		margin-bottom: 0;
	}
	color: #222;
`;

const Section = (props: {content?: string | null; title: string}) => {
	if (!props.content) {
		return null;
	}

	return (
		<InfoContainer>
			<StyledLabel>{props.title}</StyledLabel>
			<Description dangerouslySetInnerHTML={{__html: props.content}} />
		</InfoContainer>
	);
};

export default Section;

