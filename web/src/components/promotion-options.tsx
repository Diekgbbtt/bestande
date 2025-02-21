import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';

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

const LeadImageContainer = styled.div`
	height: 240px;
	${mobile`
		text-align: center;
	`}
`;

const DescriptionContainer = styled.div`
	height: 120px;
	${mobile`
		height: auto;	
		margin-bottom: 10px;
	`}
`;

export const PromotionOptions = () => {
	return (
		<div>
			<div style={{height: 50}} />
			<FeatureRow>
				<Feature>
					<FeatureTitle>Swiper</FeatureTitle>
					<LeadImageContainer>
						<img src="/static/banner-swiper.png" alt="Swiper" />
					</LeadImageContainer>
					<DescriptionContainer>
						<FeatureDescription>
							Ein zweiter Banner, welcher durch eine Wischbewegung offenbart
							wird.
						</FeatureDescription>
						<FeatureDescription>
							Somit kann doppelt so viel visueller Inhalt angezeigt werden.
						</FeatureDescription>
					</DescriptionContainer>
					<FeatureDescription>
						<strong style={{fontFamily: 'Roboto'}}>+50.– pro Woche</strong>
					</FeatureDescription>
				</Feature>
				<Feature>
					<FeatureTitle>Mehrsprachigkeit</FeatureTitle>
					<LeadImageContainer>
						<img src="/static/swiper-languages.png" alt="Sprachen" />
					</LeadImageContainer>
					<DescriptionContainer>
						<FeatureDescription>
							Die Werbebanner sind jeweils exklusiv – niemand anderes wird in
							dieser Woche beworben.
						</FeatureDescription>
					</DescriptionContainer>
					<FeatureDescription>
						<strong style={{fontFamily: 'Roboto'}}>kostenlos</strong>
					</FeatureDescription>
				</Feature>
				<Feature>
					<FeatureTitle>A/B-Testing</FeatureTitle>
					<LeadImageContainer>
						<img src="/static/banner-ab-testing.png" alt="A/B Testing" />
					</LeadImageContainer>
					<DescriptionContainer>
						<FeatureDescription>
							Die Werbung erscheint nativ in der App, deshalb erscheint sie auch
							mit Werbeblocker.
						</FeatureDescription>
					</DescriptionContainer>
					<FeatureDescription>
						<strong style={{fontFamily: 'Roboto'}}>kostenlos</strong>
					</FeatureDescription>
				</Feature>
			</FeatureRow>
		</div>
	);
};
