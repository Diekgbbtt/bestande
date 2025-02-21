import {Heading} from '@jonny/rebass';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {Container} from '../../../core/components/layout/container';
import {mobile} from '../../../core/components/layout/responsive';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {GREEN} from '../../../core/models/colors';
import {linkStyle} from './link';
import { Footer } from './footer';

const Members = styled.div`
	flex-direction: row;
	display: flex;
	text-align: center;
	margin-top: 40px;
	${mobile`
		display: block;
	`};
`;

const MemberContainer = styled.div`
	text-align: center;
`;

const MemberName = styled.div`
	font-weight: bold;
	font-family: Montserrat;
`;

const MemberInstagram = styled.a`
	color: #bc2a8d;
	font-weight: bold;
`;

const A = styled.a`
	${linkStyle};
`;

const Member = ({image, name, instagram, small}) => {
	return (
		<MemberContainer>
			<img
				style={{boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)'}}
				// src={getImageUrl({
				// 	cdn_identifier: image,
				// 	format: 'png',
				// 	crop: 'faces',
				// 	width: small ? 150 : 200,
				// 	height: small ? 150 : 200,
				// })}
				src={image}
			/>
			<MemberName>{name}</MemberName>
			<MemberInstagram
				href={`https://instagram.com/${instagram}`}
				target="_blank"
			>
				@{instagram}
			</MemberInstagram>
		</MemberContainer>
	);
};

export const About = () => {
	return (
		<>
			<Helmet title="Über uns" />
			<div style={{flex: 1}}>
				{/* <div
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
									Über uns
								</Heading>
							</TextContainer>
						</HeaderContainer>
					</Container>
				</div> */}
				<Container style={{paddingTop: 30, paddingBottom: 60}}>
					<h2 style={{marginBottom: 0, paddingBottom: 0}}>About Bestande</h2>
					<p style={{marginTop: 10, paddingTop: 0}}>
						Bestande is an independent student-led service offered by the VSUZH (Verband Studierende Universität Zürich). The Bestande app has been relaunched after a one year long hiatus by Informatics student Tarek Alakmeh during the summer 2023. Originally, Bestande was developed in 2015 by UZH student Jonny Burger. He extended and maintained the app for seven years and is passing the app on to the ICU and VSUZH as of 2023.
						Since then the app is maintained and continuously extended by a student team of the Informatics Student Association (ICU). 
					</p>

					<h2 style={{marginBottom: 0, paddingBottom: 0}}>Bestande Team</h2>
					<p style={{marginTop: 10, paddingTop: 0}}>
						<b>Tarek Alakmeh</b> - Initiator & Co-Lead <br/>
						<b>Jonas Blum</b> - Co-Lead <br/>
						<b>Nils Grob</b> - Developer <br/>
						<b>Robert Hemengül</b> - Developer <br/>
						<b>Dario Monopoli</b> - Developer <br/>
					</p>
					<p>
						<a href='mailto:info@bestande.ch'>Join our developer team!</a>
					</p>
					<p>
						<i>For regulatory requests or complaints contact our control body: <a href='mailto:inko@vsuzh.ch'>Informatik Kommission VSUZH</a></i>
					</p>
				</Container>
				<Footer />
			</div>
		</>
	);
};
