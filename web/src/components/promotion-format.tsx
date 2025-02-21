import {darken, lighten} from 'polished';
import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';

const Feature = styled.div`
	position: absolute;
	left: 50%;
	width: 180px;
	font-size: 0.9em;
	${mobile`
		position: static;
		margin-left: 0 !important;
		width: 100%;
		margin-bottom: 10px;
	`}
`;

const FeatureTitle = styled.div`
	font-family: Montserrat;
	font-weight: bold;
`;

const FeatureDescription = styled.div`
	ul {
		margin-top: 0;
		padding-left: 16px;
	}
`;

const Numbered = styled.div`
	background: linear-gradient(to right, white, ${darken(0.03, '#ffffff')});
	height: 20px;
	width: 20px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.75em;
	font-weight: bold;
	color: ${lighten(0.2, '#000000')};
	display: none;
	${mobile`
		display: flex;
		`}
`;

const NumberedOnImage = styled(Numbered)`
	left: 50%;
	top: 0;
	position: absolute;
`;

const Arrow = styled.img`
	display: block;
	${mobile`
		display: none;
	`}
`;

const BottomPadding = styled.div`
	height: 120px;
	${mobile`
		height: 0;
	`}
`;

export const PromotionFormat = () => {
	return (
		<div style={{position: 'relative'}}>
			<div style={{height: 50}} />
			<Arrow
				src="/static/banner-arrow-1.png"
				alt="Banner Arrow 1"
				style={{
					position: 'absolute',
					left: '50%',
					width: 140,
					marginLeft: -320,
					marginTop: 80,
				}}
			/>
			<div style={{justifyContent: 'center', display: 'flex'}}>
				<img src="/static/banner-format.png" alt="Banner Format" />
			</div>
			<Arrow
				src="/static/banner-arrow-2.png"
				alt="Banner Arrow 2"
				style={{
					position: 'absolute',
					left: '50%',
					marginLeft: 170,
					width: 120,
					marginTop: -250,
				}}
			/>
			<Arrow
				src="/static/banner-arrow-3.png"
				style={{
					position: 'absolute',
					left: '50%',
					marginLeft: 170,
					width: 120,
					marginTop: -150,
				}}
				alt="Banner Arrow 3"
			/>
			<Feature style={{marginLeft: -340, top: 210}}>
				<Numbered style={{marginBottom: 10, marginTop: 15}}>1</Numbered>

				<FeatureTitle>Titel</FeatureTitle>
				<FeatureDescription>
					Activation-Text mit einer Länge von bis zu 30 Zeichen
				</FeatureDescription>
			</Feature>
			<Feature style={{marginLeft: 300, top: 165}}>
				<Numbered style={{marginBottom: 10, marginTop: 15}}>2</Numbered>
				<FeatureTitle>Promoter-Name</FeatureTitle>
				<FeatureDescription>
					Dies ist immer der Name der Entität, welche den Banner platziert hat.
				</FeatureDescription>
			</Feature>
			<Feature style={{marginLeft: 300, top: 295}}>
				<Numbered style={{marginBottom: 10, marginTop: 15}}>3</Numbered>
				<FeatureTitle>Grafik</FeatureTitle>
				<FeatureDescription>
					<ul>
						<li>3:1-Seitenverhältnis</li>
						<li>Nicht animiert</li>
						<li>Nicht transparent</li>
						<li>Vorgeschlagene Grösse: 780px Breite mal 260px Höhe</li>
					</ul>
				</FeatureDescription>
			</Feature>
			<NumberedOnImage style={{marginLeft: -80, top: 126}}>1</NumberedOnImage>
			<NumberedOnImage style={{marginLeft: 162, top: 126}}>2</NumberedOnImage>
			<NumberedOnImage style={{marginLeft: 80, top: 220}}>3</NumberedOnImage>
			<BottomPadding />
		</div>
	);
};
