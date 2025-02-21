import Tooltip from '@jonny/tooltip/dist';
import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {ApiResponse} from '../../../core/reducers/api';
import {WebState} from '../../../core/types/web-state';
import ReviewEditableHeader from './review-editable-header';
import Button from './button';
import EditRatingButtonWithModal from './edit-rating-button';
import Rating from '../models/rating';
import {RatingCore} from '../../../core/types/ratings';

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

const CancelButton = styled(Button)`
	&& {
		background-color: white;
		color: red;
		border-color: red;
		cursor: pointer;
	}
`;

type OwnProps = {
	myReview: RatingCore;
	updateMyRating: (score: number, review: string, id: string) => void;
	deleteMyRating: (id: string) => void;
	onProfilePage: boolean
};

export const ReviewEditable = (props: OwnProps) => {
	const review = {
		...props.myReview,
		ups: props.myReview?.ups ?? 0,
		downs: props.myReview?.downs ?? 0,
	};
	const {onProfilePage} = props;
	const up = Number(review.ups);
	const downs = Number(review.downs);
	const difference = (Number(review.ups) || 0) - (Number(review.downs) || 0);
	const [reviewText, setReviewText] = React.useState(review.review as string);
	const [reviewScore, setReviewScore] = React.useState(review.score as number);
	const [isEditing, setIsEditing] = React.useState(false);

	React.useEffect(() => {
		setReviewText(review.review as string);
		setReviewScore(review.score as number);
	}, [props.myReview.review, props.myReview.score]);

	const submitEdit = async (score: number, reviewText: string) => {
		await props.updateMyRating(score, reviewText, review._id);
		setIsEditing(false);
	};

	const cancelEdit = () => {
		setIsEditing(false);
	};

	return (
		<OuterContainer>
			<Container>
				<ReviewEditableHeader review={review} onProfilePage={onProfilePage} />

				<ReviewText>
					<Triangle />
					{isEditing ? (
						<EditRatingButtonWithModal
							previousScore={reviewScore}
							previousReview={reviewText}
							cancelEdit={cancelEdit}
							submitEdit={submitEdit}
						/>
					) : (
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<ReviewText>
								<span>{reviewText}</span>
							</ReviewText>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Button onClick={() => setIsEditing(true)}>
									Review ändern
								</Button>
								<CancelButton
									onClick={() => props.deleteMyRating(review._id)}
								>
									Review löschen
								</CancelButton>
							</div>
						</div>
					)}
				</ReviewText>
			</Container>
		</OuterContainer>
	);
};
