import {Message} from '@jonny/rebass';
import React from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Container} from '../../../../core/components/layout/container';
import {mobile} from '../../../../core/components/layout/responsive';
import {
	Label as OptionLabel,
	Option,
	OptionContainer,
} from '../../../../core/components/Options';
import {Colors} from '../../../../core/functions/Colors';
import rawStrings from '../../../../core/raw-strings';
import {AnalyticsResponse} from '../../api/promotions/analytics';
import {languageLabel} from '../../tasks/language-label';
import {platformLabel} from '../../tasks/platform-label';
import Title from '../splash-page/title';
import Campaign from './campaign';
import Metrics from './metrics';
import {PieChart} from './pie-chart';

const SmallTitle = styled.div`
	font-weight: bold;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		display: block;
	`};
`;

const Content = styled.div`
	flex: 1;
`;

const Spacer = styled.div`
	width: 20px;
	height: 20px;
`;

const Analytics = ({response}: {response: AnalyticsResponse}) => {
	/*
	const directions = sortBy(response.directions, d => 0 - d.count).map(
		({_id, count}) => ({
			name: _id
				.split(' ')
				.slice(1)
				.join(' '),
			value: count
		})
	); */
	return (
		<Container>
			<Helmet title={`Statistiken für Anzeige "${response.promotion.name}"`} />
			<Title>
				Statistiken für Anzeige {'"'}
				{response.promotion.name}
				{'"'}
			</Title>
			{response.abSeries?.length > 1 ? (
				<>
					<SmallTitle>A/B-Testing</SmallTitle>
					<OptionContainer>
						{response.abSeries.map((s, i) => {
							return (
								<Link key={s} to={`/werbung/analytics/${s}`} style={{flex: 1}}>
									<Option
										active={s === response.promotion._id}
										onPress={() => {
											// noop
										}}
									>
										<OptionLabel active={s === response.promotion._id}>
											Variante {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}
										</OptionLabel>
									</Option>
								</Link>
							);
						})}
					</OptionContainer>
					<Spacer />
				</>
			) : null}
			{response.series?.length > 1 ? (
				<>
					<SmallTitle>Banner</SmallTitle>
					<OptionContainer>
						{response.series.map((s, i) => {
							return (
								<Link key={s} to={`/werbung/analytics/${s}`} style={{flex: 1}}>
									<Option
										active={s === response.promotion._id}
										onPress={() => {
											// noop
										}}
									>
										<OptionLabel active={s === response.promotion._id}>
											Banner {i + 1}
										</OptionLabel>
									</Option>
								</Link>
							);
						})}
					</OptionContainer>
					<Spacer />
				</>
			) : null}
			{response.promotion.retired ? (
				<Message style={{backgroundColor: Colors.Green}}>
					Dieser Banner wurde während der Kampagne durch einen neuen Banner
					ersetzt und ist nicht mehr aktiv.
				</Message>
			) : null}
			<Row>
				<Content>
					<SmallTitle>Kampagne</SmallTitle>
					<Campaign response={response} />
				</Content>
				<Spacer />
				<Content>
					<SmallTitle>Statistiken</SmallTitle>
					<Metrics response={response} />
				</Content>
			</Row>

			<SmallTitle>Plattformen</SmallTitle>
			<PieChart
				data={response.platforms.map(({_id, count}) => ({
					name: platformLabel(_id),
					value: count,
				}))}
			/>
			<SmallTitle>Institutionen</SmallTitle>
			<PieChart
				data={response.institutions.map(({_id, count}) => ({
					name: rawStrings[_id].de,
					value: count,
				}))}
			/>
			<SmallTitle>Sprachen</SmallTitle>
			<PieChart
				data={response.languages.map(({_id, count}) => ({
					name: languageLabel(_id),
					value: count,
				}))}
			/>
		</Container>
	);
};

export default Analytics;
