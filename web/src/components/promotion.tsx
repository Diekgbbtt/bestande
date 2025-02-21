import React from 'react';
import Helmet from 'react-helmet';
import {Route, Switch} from 'react-router-dom';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';
import AnalyticsFetcher from './analytics/fetcher';
import {grayGradient} from './layout/gray-gradient';
import {linkStyle} from './link';

const Container = styled.div`
	width: 100%;
	display: block;
	overflow: auto;
	overflow-wrap: normal;
`;

const PanelNarrower = styled.div<{
	stickRight?: boolean;
}>`
	flex: 2;
	justify-content: ${(props) => (props.stickRight ? 'flex-end' : 'center')};
	display: flex;
	${(props) =>
		props.stickRight
			? ''
			: mobile`
		padding: 0 20px;
		padding-top: 40px;
	`};
`;

const Button = styled.a`
	background: white;
	color: black;
	border-radius: 3px;
	padding: 12px 18px;
	font-size: 0.8em;
	font-weight: bold;
	border: 1px solid rgba(0, 0, 0, 0.1);
	cursor: pointer;
`;

const Title = styled.h1`
	font-family: Montserrat;
	margin-bottom: 0;
	line-height: 1.5;
`;

const Panel = styled.div`
	padding-top: 40px;
	display: flex;
	align-items: center;
	max-width: 1200px;
	margin: auto;
	${mobile`
		display: block;
	`};
`;

const PanelWider = styled.div`
	flex: 3;
	justify-content: center;
	display: flex;
	padding: 0 20px;
`;

const Subtitle = styled.h2`
	color: gray;
	padding-top: 0;
	font-size: 16px;
	font-family: Montserrat;
	overflow-wrap: normal;
	word-wrap: normal;
	hyphens: none;
	a {
		color: white;
	}
`;

const FocusAreaTitle = styled.div`
	font-weight: bold;
	text-align: right;
	font-size: 1.3em;
	${mobile`
		text-align: center;
	`}
`;

const Textbox = styled.div`
	max-width: 600px;
`;

const FocusArea = styled.div`
	flex: 1;
	text-align: right;
	padding-top: 20px;
	${mobile`
		text-align: center;
	`}
	i {
		display: block;
		font-size: 30px;
		opacity: 0.7;
	}
	span {
		font-size: 12px;
		line-height: 14px;
		color: rgba(0, 0, 0, 0.8);
	}
`;

const Metric = styled.div`
	flex: 1;
	text-align: right;
	${mobile`
	text-align: center;
	`}
`;

const MetricRow = styled.div`
	display: flex;
	flex-direction: row;
`;

const MetricNum = styled.div`
	font-weight: bold;
	font-size: 2em;
	margin-bottom: -8px;
	font-family: Montserrat;
`;

const MetricDescription = styled.div`
	font-size: 12px;
`;

const ReportingPanelRight = styled(PanelNarrower)`
	text-align: right;
	${mobile`
		text-align: center;
	`}
`;

const A = styled.a`
	${linkStyle};
`;

const PromotionView = () => {
	return (
		<Container>
			<Helmet title="Werbung" />
			<div style={{background: grayGradient}}>
				<Panel>
					<PanelWider style={{order: 2}}>
						<Textbox>
							<Title>Werbung auf Bestande</Title>
							<Subtitle>
								Bestande akzeptiert im Moment keine Werbeanfragen.
							</Subtitle>
						</Textbox>
					</PanelWider>
					<PanelNarrower style={{order: 1}}>
						<img src="/static/fan.png" alt="Bestande Fan" />
					</PanelNarrower>
				</Panel>
			</div>
			<div style={{borderTop: '1px solid rgba(0, 0, 0, 0.1)'}} />

			<div style={{height: 80}} />
		</Container>
	);
};

export const Promotion = ({match}) => (
	<Switch>
		<Route path={`${match.path}/analytics/:id`} component={AnalyticsFetcher} />
		<Route component={PromotionView} />
	</Switch>
);
