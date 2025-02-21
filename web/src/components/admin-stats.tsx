import {Heading, Stat} from '@jonny/rebass';
import React, {Component} from 'react';
import styled from 'styled-components';
import {apiRequest} from '../../../core/functions/api-request';
import Padded from './layout/padded';

const StatContainer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
`;

type State = {
	uzhCount: number | null;
	ethCount: number | null;
	dau: number | null;
	mau: number | null;
	ratings: number | null;
	reviews: number | null;
	messages: number | null;
};

const numOrLoading = (num: number | null) => {
	if (num === null) {
		return <div>...</div>;
	}

	return num;
};

class AdminStats extends Component<{}, State> {
	state: State = {
		uzhCount: null,
		ethCount: null,
		dau: null,
		mau: null,
		ratings: null,
		reviews: null,
		messages: null,
	};

	componentDidMount() {
		apiRequest<number>('/stats/count/uzh')
			.then((uzhCount) => {
				this.setState({
					uzhCount,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/count/eth')
			.then((ethCount) => {
				this.setState({
					ethCount,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/mau')
			.then((mau) => {
				this.setState({
					mau,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/dau')
			.then((dau) => {
				this.setState({
					dau,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/chatmessages')
			.then((messages) => {
				this.setState({
					messages,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/ratings')
			.then((ratings) => {
				this.setState({
					ratings,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		apiRequest<number>('/stats/reviews')
			.then((reviews) => {
				this.setState({
					reviews,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	renderContent() {
		return (
			<div>
				<Heading level={1}>Statistiken</Heading>
				<StatContainer>
					<Stat
						style={{flex: 1}}
						label="App-Nutzer UZH"
						value={numOrLoading(this.state.uzhCount)}
					/>
					<Stat
						style={{flex: 1}}
						label="App-Nutzer ETH"
						value={numOrLoading(this.state.ethCount)}
					/>
				</StatContainer>
				<StatContainer>
					<Stat
						style={{flex: 1}}
						label="daily active Users"
						value={numOrLoading(this.state.dau)}
					/>
					<Stat
						style={{flex: 1}}
						label="monthly active Users"
						value={numOrLoading(this.state.mau)}
					/>
				</StatContainer>
				<StatContainer>
					<Stat
						style={{flex: 1}}
						label="Bewertungen"
						value={numOrLoading(this.state.ratings)}
					/>
					<Stat
						style={{flex: 1}}
						label="Rezensionen"
						value={numOrLoading(this.state.reviews)}
					/>
				</StatContainer>
				<StatContainer>
					<Stat
						style={{flex: 1}}
						label="Chatnachrichten"
						value={numOrLoading(this.state.messages)}
					/>
				</StatContainer>
			</div>
		);
	}

	render() {
		return <Padded {...this.props}>{this.renderContent()}</Padded>;
	}
}

export default AdminStats;
