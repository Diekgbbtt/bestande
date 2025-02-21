import {Heading} from '@jonny/rebass';
import React from 'react';
import Helmet from 'react-helmet';
import {GREEN} from '../models/colors';
import {HeaderContainer, TextContainer} from './header-container';
import {Container} from './layout/container';

// ts-unused-exports:disable-next-line
export const ChangelogHeader = () => {
	return (
		<div
			style={{
				paddingTop: 100,
				paddingBottom: 20,
				position: 'relative',
				backgroundColor: GREEN,
			}}
		>
			<Helmet title="Changelog" />
			<Container>
				<HeaderContainer>
					<TextContainer>
						<Heading
							style={{
								color: 'white',
								textShadow: '1px 1px rgba(0, 0, 0, 0.4)',
							}}
						>
							Changelog
						</Heading>
					</TextContainer>
				</HeaderContainer>
			</Container>
		</div>
	);
};
