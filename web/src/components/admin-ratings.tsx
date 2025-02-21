import Heading from '@jonny/rebass/dist/Heading';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {apiRequest} from '../../../core/functions/api-request';
import {moduleGetUrl} from '../../../core/models/module';
import {RatingWithModule} from '../api/ratings';
import {ErrorCode} from './errorcode';
import Padded from './layout/padded';

const RatingContainer = styled.div`
	border-bottom: 1px solid gray;
	padding-top: 10px;
	padding-bottom: 10px;
`;

const LoadMore = styled.button`
	text-align: center;
`;

const AdminRating = ({rating}: {rating: RatingWithModule}) => {
	const [censored, setCensored] = React.useState(false);
	const censor = async (id: string) => {
		await apiRequest(`/ratings/${id}/censor`, {
			method: 'POST',
		});
		setCensored(true);
	};

	return (
		<RatingContainer>
			<strong>Datum:</strong> {new Date(rating.date).toDateString()}
			<br />
			<strong>ID:</strong> {rating._id} <br />
			{rating.module ? (
				<span>
					<strong>Modul:</strong>{' '}
					<Link to={moduleGetUrl(rating.module)}>
						{rating.module.university} - {rating.module.short_name}
					</Link>
				</span>
			) : null}
			<br />
			<strong>Bewertung: </strong>
			{new Array(rating.score).fill(Boolean).map((a, i) => {
				return (
					// eslint-disable-next-line
					<i key={i} className="material-icons">
						star
					</i>
				);
			})}
			<br />
			{rating.censored || censored ? (
				<span style={{color: 'red'}}>
					<strong>Zensiert:</strong> Ja
				</span>
			) : (
				<span>
					<strong>Rezension: </strong> {rating.review}
					<br />
					<button
						type="button"
						onClick={() => {
							// eslint-disable-next-line no-alert
							if (confirm('Zensieren?')) {
								censor(rating._id as string);
							}
						}}
					>
						Censor
					</button>
				</span>
			)}
			<br />
		</RatingContainer>
	);
};

type State = {
	ratings: RatingWithModule[];
	err: Error | null;
};

class AdminRatings extends Component {
	state: State = {
		ratings: [],
		err: null,
	};

	load() {
		apiRequest<{ratings: RatingWithModule[]}>(
			'/ratings?offset=' + this.state.ratings.length
		)
			.then(({ratings}) => {
				return this.setState((prevState: State) => ({
					ratings: [...prevState.ratings, ...ratings],
				}));
			})
			.catch((err) => {
				this.setState({
					err,
				});
			});
	}

	componentDidMount() {
		this.load();
	}

	renderRatings() {
		if (!this.state.ratings) {
			return null;
		}

		return (
			<div>
				{this.state.ratings.map((r) => {
					return <AdminRating key={r._id as string} rating={r} />;
				})}
				<LoadMore onClick={() => this.load()}>Mehr laden</LoadMore>
			</div>
		);
	}

	render() {
		if (this.state.err) {
			return (
				<Padded {...this.props}>
					<ErrorCode error={this.state.err} />
				</Padded>
			);
		}

		return (
			<Padded {...this.props}>
				<HeaderContainer>
					<TextContainer>
						<Heading>Bewertungen</Heading>
					</TextContainer>
				</HeaderContainer>
				{this.renderRatings()}
			</Padded>
		);
	}
}

export default AdminRatings;
