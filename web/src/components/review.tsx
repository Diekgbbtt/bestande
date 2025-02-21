import Tooltip from '@jonny/tooltip/dist';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {ApiResponse} from '../../../core/reducers/api';
import {WebState} from '../../../core/types/web-state';
import ReviewHeader from './review-header';
import {VotingEnum} from '../../../core/types/ratings';
import {PostVoteDto} from '../api/ratings/dtos';
import {apiRequest} from '../../../core/functions/api-request';
import {VOTE_ADDED, getRating} from '../../../core/actions/ratings';
import {Image} from 'react-native-normalized';
import {AppearanceMap, useAppearance} from '../../../core/functions/use-appearance';
import {Colors} from '../../../core/functions/Colors';

const OuterContainer = styled.div`
	background-color: white;
	padding-bottom: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const Container = styled.div`
	opacity: 1;
	flex: 1;
`;

const ReviewText = styled.div`
	background-color: #edf4ff;
	border-radius: 4px;
	padding: 12px;
	flex: 1;
`;

const Triangle = styled.div`
	background-color: #edf4ff;
	height: 12px;
	width: 12px;
	position: absolute;
	z-index: -1;
	margin-top: -16px;
	margin-left: -6px;
	transform: rotate(45deg);
`;

const getArrowColor = (
	active: boolean,
	activeColor: string,
	disabled: boolean,
	appearanceMap: AppearanceMap
) => {
	return active
		? activeColor
		: disabled
		? appearanceMap.BORDER_COLOR
		: appearanceMap.SUBTITLE;
};

const Thumb = styled(Image)`
	width: 24px;
	height: 24px;
	cursor: pointer;
	transition: opacity 0.3s ease;
`;

type OwnProps = {
	_id: string;
	course: ApiResponse;
	refresh: () => void;
};

export const Review = (props: OwnProps) => {
	const reviewFromState = useSelector(
		(state: WebState) => state.ratings[props._id]
	);

	const [review, setReview] = useState({
		...reviewFromState,
		ups: reviewFromState?.ups ?? 0,
		downs: reviewFromState?.downs ?? 0,
	});

	const ups = Number(review.ups);
	const downs = Number(review.downs);
	const difference = (Number(review.ups) || 0) - (Number(review.downs) || 0);

	const appearance = useAppearance();

	const clickUpvote = () => {
		voteReview(VotingEnum.UP);
	};

	const clickDownvote = () => {
		voteReview(VotingEnum.DOWN);
	};

	const voteReview = async (votingEnum: VotingEnum) => {
		const postVoteDto: PostVoteDto = {
			vote: votingEnum,
		};
		try {
			await apiRequest(`/ratings/${review._id}/vote`, {
				method: 'POST',
				body: JSON.stringify(postVoteDto),
			});
			const adaptedReview = {...review};
			if (adaptedReview.myVote === VotingEnum.UP) {
				adaptedReview.ups--;
			}
			if (adaptedReview.myVote === VotingEnum.DOWN) {
				adaptedReview.downs--;
			}
			if (review.myVote === votingEnum) {
				adaptedReview.myVote = VotingEnum.NEUTRAL;
			} else {
				adaptedReview.myVote = votingEnum;
				if (votingEnum === VotingEnum.UP) {
					adaptedReview.ups++;
				}
				if (votingEnum === VotingEnum.DOWN) {
					adaptedReview.downs++;
				}
			}
			setReview(adaptedReview);
		} catch (e) {
			const event = new CustomEvent('showBanner', {
				detail: {
					message: 'Du must angemeldet sein um abzustimmen',
					type: 'error',
				},
			});
			window.dispatchEvent(event);
		}
	};

	return (
		<OuterContainer>
			<Container>
				<ReviewHeader review={review} course={props.course} />
				{review.review ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								fontWeight: 'bold',
								width: 40,
								color: 'gray',
								fontSize: '0.8em',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								paddingRight: 15,
							}}
						>
							<button
								onClick={clickUpvote}
								style={{
									background: 'none',
									border: 'none',
									padding: 0,
									cursor: 'pointer',
								}}
							>
								<Thumb
									style={{
										opacity: 1,
										width: 24,
										height: 24,
										tintColor: getArrowColor(
											review.myVote === VotingEnum.UP,
											Colors.Red,
											true,
											appearance
										),
									}}
									source={require('../static/upvote.png')}
								/>
							</button>

							<Tooltip
								tip={`${ups} ${
									ups === 1 ? 'stimmt' : 'stimmen'
								} zu, ${downs} ${
									downs === 1 ? 'stimmt' : 'stimmen'
								} dagegen`}
								preferredPlacement="right"
							>
								<span>
									{difference > 0 ? '+' : ''}
									{difference.toString()}
								</span>
							</Tooltip>
							<button
								onClick={clickDownvote}
								style={{
									background: 'none',
									border: 'none',
									padding: 0,
									cursor: 'pointer',
								}}
							>
								<Thumb
									style={{
										opacity: 1,
										width: 24,
										height: 24,
										tintColor: getArrowColor(
											review.myVote === VotingEnum.DOWN,
											Colors.Red,
											true,
											appearance
										),
									}}
									source={require('../static/downvote.png')}
								/>
							</button>
						</div>
						<ReviewText>
							<Triangle />
							{/* TODO Support markdown once react-native-simple-markdown updates to v1.1 */}
							<span>{review.review}</span>
						</ReviewText>
					</div>
				) : null}
			</Container>
		</OuterContainer>
	);
};
