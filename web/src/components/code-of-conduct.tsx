import {Heading} from '@jonny/rebass';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {Container} from '../../../core/components/layout/container';
import {GREEN} from '../../../core/models/colors';
import rawStrings from '../../../core/raw-strings';

const Icon = styled.img`
	width: 48px;
	height: 48px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 40px;
`;

const RowIcon = styled.div`
	margin-right: 20px;
`;

const RowDescription = styled.div``;

export const CodeOfConduct = () => {
	return (
		<div style={{flex: 1}}>
			<Helmet title="Community-Regeln" />
			<div
				style={{
					paddingTop: 100,
					paddingBottom: 20,
					position: 'relative',
					background: GREEN,
				}}
			>
				<Container>
					<HeaderContainer>
						<TextContainer>
							<Heading
								style={{
									color: 'white',
									textShadow: '1px 1px rgba(0, 0, 0, 0.4)',
								}}
							>
								Community-Regeln
							</Heading>
						</TextContainer>
					</HeaderContainer>
				</Container>
			</div>

			<Container>
				<p>
					Dies sind die Regeln, die für den Chat gelten, aber auch unsere
					Grundsätze für die Moderation von Fächerbewertungen wiederspiegeln.
					Aufgrund dieser Regeln entscheiden wir, welche Inhalte auf Bestande
					akzeptabel sind und welche nicht.
				</p>
				<Row>
					<RowIcon>
						<Icon src="/static/comment-alt-smile-duotone.png" />
					</RowIcon>
					<RowDescription>
						<div style={{fontWeight: 'bold'}}>{rawStrings.TOPIC.de}</div>
						{'\n'}
						{rawStrings.KEEP_DISCUSSION_FOCUSED.de}
					</RowDescription>
				</Row>
				<Row>
					<RowIcon>
						<Icon src="/static/chat-blue.png" />
					</RowIcon>
					<RowDescription>
						<div style={{fontWeight: 'bold'}}>
							{rawStrings.PROHIBITED_MESSAGES.de}
						</div>
						{'\n'}
						{rawStrings.PROHIBITED_MESSAGES_LIST.de}
					</RowDescription>
				</Row>
				<Row>
					<RowIcon>
						<Icon src="/static/gavel.png" />
					</RowIcon>
					<RowDescription>
						<div style={{fontWeight: 'bold'}}>{rawStrings.MODERATION.de}</div>
						{'\n'}
						{rawStrings.MODERATION_TEXT.de}
					</RowDescription>
				</Row>
				<div style={{height: 50}} />
			</Container>
		</div>
	);
};
