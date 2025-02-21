import React from 'react';
import styled from 'styled-components';
import {thousands} from '../../../../core/functions/format-thousands';
import {HelpBadge} from '../help-badge';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 6px;
`;

const Value = styled.div`
	font-size: 24px;
`;

const Metric = styled.div`
	color: #444;
	text-transform: uppercase;
	font-size: 13px;
	margin-top: -2px;
`;

const Statistic = ({label, value}) => {
	return (
		<div style={{flex: 1}}>
			<Value>{value}</Value>
			<Metric>{label}</Metric>
		</div>
	);
};

const Metrics = ({response}) => {
	const {open_in_browser} = response.promotion;
	const ctr = response.impressions[1] / Math.max(1, response.impressions[0]);
	return (
		<div>
			<Container>
				<Statistic
					label="Kontakte"
					value={thousands(response.impressions[0], "'")}
				/>
				<Statistic
					label="Klicks"
					value={thousands(response.impressions[1], "'")}
				/>
				{open_in_browser ? null : (
					<Statistic
						label="Action calls"
						value={thousands(response.impressions[2], "'")}
					/>
				)}
			</Container>
			<Container>
				<Statistic
					label={
						<span>
							Click-Through rate{' '}
							<HelpBadge content="Der Anteil der Leute, die auf die Werbung geklickt haben." />
						</span>
					}
					value={(ctr * 100).toFixed(2) + '%'}
				/>
				{response.promotion.price ? (
					<Statistic
						label={
							<span>
								Tausendkontaktpreis{' '}
								<HelpBadge content="Der Preis pro 1000 Personen, denen der Inhalt angezeigt wird." />
							</span>
						}
						value={
							'CHF ' +
							(
								(response.promotion.price / response.impressions[0]) *
								1000
							).toFixed(2)
						}
					/>
				) : null}
			</Container>
		</div>
	);
};

export default Metrics;
