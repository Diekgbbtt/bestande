import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';

const PriceNumber = styled.div`
	font-size: 2em;
	font-weight: bold;
	font-family: Roboto;
	margin-bottom: -10px;
`;

const PriceSubtitle = styled.div`
	font-size: 16px;
`;

const Feature = styled.div`
	font-size: 0.9em;
	margin-right: 30px;
	${mobile`
		width: 100%;
		margin-right: 0;
	`}
`;

const FeatureTitle = styled.div`
	font-family: Montserrat;
	font-weight: bold;
	${mobile`
		margin-top: 30px;
	`}
`;

const FeatureDescription = styled.div`
	ul {
		margin-top: 0;
		padding-left: 16px;
	}
`;

const FeatureRow = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		flex-direction: column;
	`}
`;

export const PromotionPricing = () => {
	return (
		<div>
			<div style={{height: 50}} />
			<div style={{display: 'inline-block', width: 200}}>
				<PriceNumber>400.–</PriceNumber>
				<PriceSubtitle>pro Woche</PriceSubtitle>
			</div>
			<div style={{display: 'inline-block', width: 200}}>
				<PriceNumber>2000.–</PriceNumber>
				<PriceSubtitle>für 6 Wochen</PriceSubtitle>
			</div>
			<div style={{height: 50}} />
			<FeatureRow>
				<Feature>
					<FeatureTitle>Studentenrabatt</FeatureTitle>
					<FeatureDescription>
						Projekte welche von aktiven Studierenden initiiert wurden erhalten
						einen Rabatt von 40%.
					</FeatureDescription>
				</Feature>
				<Feature>
					<FeatureTitle>Exklusivität</FeatureTitle>
					<FeatureDescription>
						Die Werbebanner sind jeweils exklusiv – niemand anderes wird in
						dieser Woche beworben.
					</FeatureDescription>
				</Feature>
				<Feature>
					<FeatureTitle>Sicher vor Adblock</FeatureTitle>
					<FeatureDescription>
						Die Werbung erscheint nativ in der App, deshalb erscheint sie auch
						mit Werbeblocker.
					</FeatureDescription>
				</Feature>
			</FeatureRow>
		</div>
	);
};
