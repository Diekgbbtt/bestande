import React from 'react';
import {View} from 'react-native';
import {MarkdownView} from 'react-native-markdown-view';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {deleteRating} from '../actions/delete-rating';
import {confirmDialog} from '../api/ConfirmDialog';
import {isRatingMine} from '../api/is-rating-mine';
import {markdownStyles} from '../styles/markdown';
import ReviewCensored from './ReviewCensored';
import ReviewDelete from './ReviewDelete';
import {ReviewEdit} from './ReviewEdit';
import ReviewHeader from './ReviewHeader';
import {ReviewVote} from './ReviewVote';

const OuterContainer = styled(SafeSideSpace)`
	padding-bottom: 10px;
`;

const Container = styled(View)<{
	deleting?: boolean;
}>`
	opacity: ${(props) => (props.deleting ? 0.5 : 1)};
`;

const ReviewText = styled(View)`
	margin-right: 12px;
	border-radius: 4px;
	padding: 12px;
	padding-top: 6px;
	padding-bottom: 6px;
`;

const Triangle = styled(View)`
	height: 12px;
	width: 12px;
	position: absolute;
	margin-top: -3px;
	margin-left: 6px;
	transform: rotateZ(45deg);
`;

const ButtonContainer = styled(View)`
	flex-direction: row;
`;

type Props = {
	_id: string;
	credit: Credit;
	course: ApiResponse;
};

export const Review = (props: Props) => {
	const language = useLanguage();
	const review = useAppState((state) => state.ratings[props._id]);
	const isMine = useAppState((state) => isRatingMine(state, props._id));
	const dispatch = useDispatch();
	const token = useAppState((state) => getUserHash(state, null));
	const institution = useAppState((state) => state.institution.institution);
	const appearance = useAppearance();
	if (!review) {
		return null;
	}

	return (
		<OuterContainer>
			<Container deleting={review.deleting}>
				<ReviewHeader review={review} course={props.course} />
				{review.censored ? <ReviewCensored /> : null}
				{review.review ? (
					<View style={{flexDirection: 'row'}}>
						{review.review ? (
							<ReviewVote review={review} isMine={isMine} />
						) : null}
						<ReviewText
							style={[
								globalStyles.flex1,
								{
									backgroundColor: appearance.REVIEW_BACKGROUND,
								},
							]}
						>
							<Triangle
								style={{backgroundColor: appearance.REVIEW_BACKGROUND}}
							/>
							<MarkdownView styles={markdownStyles(appearance)}>
								{review.review}
							</MarkdownView>
						</ReviewText>
					</View>
				) : null}
				<ButtonContainer>
					{isMine ? (
						<View style={{marginLeft: 16, marginTop: 8}}>
							<ReviewDelete
								disabled={review.deleting}
								onPress={async () => {
									try {
										await confirmDialog(
											rawStrings.DELETE_REVIEW[language],
											rawStrings.DELETE_CONFIRM[language],
											{
												noLabel: rawStrings.CANCEL[language],
												yesLabel: rawStrings.DELETE[language],
												style: 'destructive',
											},
											language
										);
										dispatch(
											deleteRating(review, token, institution, language)
										);
									} catch (err) {
										console.log(err);
									}
								}}
							/>
						</View>
					) : null}
					{isMine ? (
						<View style={{marginTop: 9, marginLeft: 40}}>
							<ReviewEdit _id={review._id} credit={props.credit} />
						</View>
					) : null}
				</ButtonContainer>
			</Container>
		</OuterContainer>
	);
};
