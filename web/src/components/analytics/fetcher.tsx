import {Input} from '@jonny/rebass';
import React, {useEffect, useState} from 'react';
import Helmet from 'react-helmet';
import {match} from 'react-router';
import Analytics from '.';
import {Container} from '../../../../core/components/layout/container';
import {apiRequest} from '../../../../core/functions/api-request';
import {AnalyticsResponse} from '../../api/promotions/analytics';
import {SubmitButton} from '../button';
import {Spinner} from '../spinner';

const NewAnalyticsFetcher = (props: {
	match: match<{
		id: string;
	}>;
}) => {
	const [data, setData] = useState<AnalyticsResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [submitted, setSubmitted] = useState<boolean>(false);

	const load = React.useCallback(() => {
		setLoading(true);
		setSubmitted(true);
		apiRequest<AnalyticsResponse>(
			`/promotions/analytics/${props.match.params.id}?password=${password}`
		)
			.then((stats) => {
				setData(stats);
				setLoading(false);
			})
			.catch((err) => {
				setSubmitted(false);
				setLoading(false);
				// eslint-disable-next-line no-alert
				alert('Fehler: ' + JSON.stringify(err));
			});
	}, [props.match.params.id, password]);

	useEffect(() => {
		if (submitted) {
			load();
		}
	}, [load, password, props.match.params.id, submitted]);

	if (data) {
		return <Analytics response={data} />;
	}

	if (loading) {
		return (
			<div style={{textAlign: 'center', fontSize: 12, margin: 'auto'}}>
				<Container style={{width: '100%'}}>
					<Spinner />
					<br />
					<div>
						Statistiken werden berechnet... dies kann einige Sekunden dauern.
					</div>
				</Container>
			</div>
		);
	}

	return (
		<div style={{textAlign: 'center', fontSize: 12, margin: 'auto'}}>
			<Container
				style={{
					maxWidth: 320,
					paddingTop: 30,
				}}
			>
				<Helmet title="Werbe-Statistiken" />
				<form
					onSubmit={() => {
						load();
					}}
				>
					<p>Bitte gib das Passwort ein, das du von uns erhalten hast:</p>
					<Input
						name="password"
						type="password"
						autoComplete="bestande-ad-analytics-password"
						label=""
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<SubmitButton
						style={{width: 280}}
						onClick={() => {
							load();
						}}
						value="Einloggen"
					/>
				</form>
			</Container>
		</div>
	);
};

export default NewAnalyticsFetcher;
