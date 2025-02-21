import max from 'lodash/max';
import React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {getMoreRating, getRating} from '../../../core/actions/ratings';
import {Container} from '../../../core/components/layout/container';
import {desktop, mobile} from '../../../core/components/layout/responsive';
import Stars from '../../../core/components/stars-web';
import {getRatingsStateForModule} from '../../../core/functions/get-ratings-state-for-module';
import {
	useAppState,
	useIsomorphicState,
} from '../../../core/functions/use-app-state';
import {ApiResponse} from '../../../core/reducers/api';
import {RatingCore, RatingSortOption} from '../../../core/types/ratings';
import {authEvents} from '../auth.events';
import {auth, isLoggedIn} from '../firebase-frontend';
import AddRatingButtonWithModal from './add-rating-button';
import {OptionHeader} from './forms/radio';
import {Last9MonthsChange} from './last-9-months-change';
import {RatingSortPicker} from './rating-sort-picker';
import {Review} from './review';
import {Spinner} from './spinner';
import Rating from '../models/rating';
import {apiRequest} from '../../../core/functions/api-request';
import {get} from 'lodash';
import {ReviewEdit} from '../../../app/common/components/ReviewEdit';
import {ReviewEditable} from './review-editable';
import {CreateRatingDto} from '../api/dto/ratings.dto';
import {setUser} from '@sentry/react-native';
import {onAuthStateChanged} from 'firebase/auth';
import {useHistory} from 'react-router';
import {fi} from 'date-fns/locale';
import {SingleModuleRatingState} from '../../../core/types/module-ratings-state';
import {isStudentStillLoggedIn} from '../our-auth-flow';

const RatingSummary = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	padding-bottom: 20px;
	${mobile`
		display: block;
	`};
`;

const RatingLeft = styled.div`
	flex: 2;
	display: flex;
	flex-direction: row;
	background: white;
	padding-top: 20px;
`;

const RatingRight = styled.div`
	flex: 3;
`;

const RatingAverage = styled.div`
	font-size: 30px;
	font-weight: bold;
`;

const RatingTotal = styled.div`
	font-weight: bold;
	font-size: 12px;
`;

const BarContainer = styled.div`
	padding-top: 1px;
	padding-bottom: 1px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const LoadMoreButton = styled.div`
	background: rgba(0, 0, 0, 0.05);
	text-align: center;
	font-size: 14px;
	padding: 10px;
	cursor: pointer;
	&:hover {
		background: rgba(0, 0, 0, 0.1);
	}
`;

const RatingSummaryLeft = ({average, total}: {average?: number; total?: number}) => {
	return (
		<div
			style={{
				textAlign: 'center',
				flex: 1,
			}}
		>
			<RatingAverage>{average ? average.toFixed(1) : '-'}</RatingAverage>
			<RatingTotal>
				{total === 1 ? '1 Bewertung' : `${total} Bewertungen`}
			</RatingTotal>
		</div>
	);
};

const BarFill = styled.div<{
	fill: number;
}>`
	background: #999;
	height: 5px;
	border-radius: 4px;
	display: flex;
	width: ${(props) => props.fill * 100}%;
`;

const BarBackground = styled.div`
	background: #eee;
	height: 5px;
	border-radius: 4px;
	flex: 1;
`;

const RatingStarView = (props) => {
	const highestNoOfScore = max(
		Object.keys(props.overview).map((ov) => props.overview[ov])
	);
	return (
		<div style={{flex: 2}}>
			{new Array(5).fill(1).map((k, i) => {
				const fill = props.overview[5 - i] / highestNoOfScore;
				return (
					// eslint-disable-next-line react/no-array-index-key
					<BarContainer key={i}>
						<Stars
							stars={5 - i}
							style={{
								marginRight: 8,
								width: 80,
								justifyContent: 'flex-end',
							}}
						/>
						<BarBackground>
							<BarFill fill={isNaN(fill) ? 0 : fill} />
						</BarBackground>
					</BarContainer>
				);
			})}
		</div>
	);
};

const OnlyDesktop = styled.div`
	${mobile`
		display: none;
	`};
`;

const OnlyMobile = styled.div`
	${desktop`
		display: none;
	`};
`;

const ModuleRatings = (props: {module: ApiResponse}) => {
	const dispatch = useDispatch();
	const {uni_identifier, university} = props.module;
	const [sortOption, setSortOption] = React.useState<RatingSortOption>('best');
	const [mobileSortFilter, setMobileSortFilter] = React.useState<boolean>(false);

	const [myRating, setMyRating] = React.useState<Rating | null>(null);
	const [email, setEmail] = React.useState<string | undefined>(undefined);
	const history = useHistory();

	const ratings = useIsomorphicState((state) =>
		getRatingsStateForModule(
			state,
			university,
			uni_identifier,
			sortOption,
			email
		)
	);

	const ratingsForSummary = useAppState((state) =>
		getRatingsStateForModule(state, university, uni_identifier, 'best')
	);

	const getMyRating = async () => {
		try {
			const myRating: Rating | null = await apiRequest(
				`/institution/${'uzh'}/module/${uni_identifier}/ratings/mine`,
				{
					method: 'GET',
				}
			);
			setMyRating(myRating);
		} catch (e) {
			//
		}
	};

	React.useEffect(() => {
		getMyRating();
	}, [uni_identifier]);

	const submitRating = async (score: number, review: string) => {
		const createRatingDto: CreateRatingDto = {
			score: score,
			review: review,
			uni_identifier: uni_identifier,
			university: university,
		};
		try {
			await apiRequest(`/ratings`, {
				method: 'POST',
				body: JSON.stringify(createRatingDto),
			});
			getMyRating();
		} catch (e) {
			console.error(e);
		}
	};

	const deleteMyRating = async (id: string) => {
		if (myRating?._id !== id) {
			console.log('no my rating');
			return;
		}
		try {
			await apiRequest(`/ratings/${myRating._id}`, {
				method: 'DELETE',
			});
			setMyRating(null);
			dispatch(
				getRating({
					uni_identifier,
					institution: university,
					sortOption,
					token: null,
					email,
				})
			);
		} catch (e) {
			console.error(e);
		}
	};

	const updateMyRating = async (score: number, review: string, id: string) => {
		if (myRating?._id !== id) {
			console.log('no my rating');
			return;
		}
		try {
			const body = {score, review};
			console.log(body);
			await apiRequest(`/ratings/${myRating._id}`, {
				method: 'PUT',
				body: JSON.stringify(body),
			});

			myRating.score = score;
			myRating.review = review;
			setMyRating(myRating);
		} catch (e) {
			console.error(e);
		}
	};

	React.useEffect(() => {
		if (!ratings.data && !ratings.loading) {
			dispatch(
				getRating({
					uni_identifier,
					institution: university,
					sortOption,
					token: null,
					email,
				})
			);
		}

		if (
			!ratingsForSummary.data &&
			!ratingsForSummary.loading &&
			sortOption !== 'top'
		) {
			dispatch(
				getRating({
					uni_identifier,
					institution: university,
					sortOption,
					token: null,
					email,
				})
			);
		}
	}, [
		dispatch,
		ratings.data,
		ratings.loading,
		ratingsForSummary.data,
		ratingsForSummary.loading,
		sortOption,
		uni_identifier,
		university,
	]);

	const {error, data, loadingMore} = ratings;

	const clickLogin = () => {
		history.push('/login');
	};

	if (error) {
		return <div>Fehler: {error}</div>;
	}

	if (ratingsForSummary.loading || !ratingsForSummary.data) {
		return <Spinner />;
	}

	const refreshReviews = () => {
		dispatch(
			getRating({
				uni_identifier,
				institution: university,
				sortOption,
				token: null,
				email,
			})
		);
	};

	return (
		<>
			{/* <StickyFilterButton
				name="Sortierung"
				onClick={() => {
					setMobileSortFilter((s) => !s);
				}}
			/> */}
			<Container style={{paddingTop: 20}}>
				<OnlyMobile>
					{mobileSortFilter ? (
						<RatingSortPicker
							sortOption={sortOption}
							setSortOption={setSortOption}
						/>
					) : null}
				</OnlyMobile>
				<RatingSummary>
					<OnlyMobile>
						<RatingLeft>
							<RatingSummaryLeft
								average={ratingsForSummary.data.average as number}
								total={ratingsForSummary.data.totalInTimespan}
							/>
							<RatingStarView
								overview={ratingsForSummary.data.overview}
							/>
						</RatingLeft>
						<Last9MonthsChange
							previousAverage={ratingsForSummary.data.previousAverage}
							average={ratingsForSummary.data.average}
						/>
					</OnlyMobile>
					<OnlyDesktop style={{flex: 2}}>
						<RatingLeft>
							<RatingSummaryLeft
								average={ratingsForSummary.data.average as number}
								total={ratingsForSummary.data.totalInTimespan}
							/>
							<RatingStarView
								overview={ratingsForSummary.data.overview}
							/>
						</RatingLeft>
						<Last9MonthsChange
							previousAverage={ratingsForSummary.data.previousAverage}
							average={ratingsForSummary.data.average}
						/>
						<div style={{height: 20}} />
						<OptionHeader>Sortierung</OptionHeader>
						<RatingSortPicker
							sortOption={sortOption}
							setSortOption={setSortOption}
						/>
						{/* <DownloadBanner style={{marginTop: 40}}>
							Gib auch du deine Meinung ab!
						</DownloadBanner> */}
					</OnlyDesktop>
					<div style={{width: 20, height: 20}} />

					<RatingRight>
						{isStudentStillLoggedIn() && !myRating ? (
							<AddRatingButtonWithModal
								module={props.module}
								createRating={submitRating}
							/>
						) : isStudentStillLoggedIn() && myRating ? (
							<ReviewEditable
								key={myRating?._id}
								myReview={myRating as RatingCore}
								updateMyRating={updateMyRating}
								deleteMyRating={deleteMyRating}
								onProfilePage={false}
							/>
						) : !isStudentStillLoggedIn() ? (
							<div style={{padding: 40}}>
								<h3 style={{margin: 0}}>Du bist nicht angemeldet</h3>
								<p style={{marginTop: 10, marginBottom: 0}}>
									Melde dich{' '}
									<span
										onClick={clickLogin}
										style={{
											textDecoration: 'underline',
											color: 'blue',
											cursor: 'pointer',
										}}
									>
										hier
									</span>{' '}
									an und erstelle noch heute dein erstes Rating!
								</p>
							</div>
						) : null}
						{data ? (
							<>
								{data.ratings
									.filter((_id) => _id !== myRating?._id)
									.map((_id) => {
										return (
											<Review
												key={_id}
												_id={_id}
												course={props.module}
												refresh={refreshReviews}
											/>
										);
									})}
								{data.ratings.length < data.total ? (
									<LoadMoreButton
										onClick={() => {
											dispatch(
												getMoreRating({
													uni_identifier,
													institution: university,
													offset: data.ratings.length,
													sortOption,
													token: null,
													email,
												})
											);
										}}
									>
										{loadingMore ? 'Laden...' : 'Weitere laden'}
									</LoadMoreButton>
								) : null}
							</>
						) : null}
					</RatingRight>
				</RatingSummary>
			</Container>
		</>
	);
};

export default ModuleRatings;
