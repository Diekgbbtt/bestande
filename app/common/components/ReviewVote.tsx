import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {setVote} from '../../../core/actions/ratings';
import {Colors} from '../../../core/functions/Colors';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {useAppState} from '../../../core/functions/use-app-state';
import {
	AppearanceMap,
	useAppearance,
} from '../../../core/functions/use-appearance';
import Rating from '../../../web/src/models/rating';
import {FontWithTransition} from './FontWithTransition';

const Container = styled(View)`
	flex-direction: column;
	width: 45px;
	align-items: center;
	padding-left: 4px;
`;

const Highlight = styled(TouchableOpacity)`
	padding: 4px;
	border-radius: 15px;
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
`;

export const ReviewVote = (props: {review: Rating; isMine: boolean}) => {
	const token = useAppState((state) => getUserHash(state, null));
	const institution = useAppState((state) => state.institution.institution);
	const currentVote = useAppState(
		(state) =>
			state.multiMyRatings[state.institution.institution].votes[
				props.review._id as string
			] || 'neutral'
	);
	const dispatch = useDispatch();
	const appearance = useAppearance();
	return (
		<Container>
			<Highlight
				disabled
				onPress={() => {
					hapticFeedback();
					dispatch(
						setVote({
							_id: props.review._id as string,
							vote: currentVote === 'up' ? 'neutral' : 'up',
							previousVote: currentVote,
							token: token as string,
							institution,
						})
					);
				}}
			>
				<Thumb
					style={{
						tintColor: getArrowColor(
							currentVote === 'up',
							Colors.Green,
							props.isMine,
							appearance
						),
						opacity: 0.3,
					}}
					source={require('../assets/upvote.png')}
				/>
			</Highlight>
			<View style={{height: 2}} />
			<FontWithTransition
				style={{
					color: appearance.SUBTITLE,
					fontSize: 12,
					textAlign: 'center',
					fontWeight: 'bold',
				}}
				text={(
					(Number(props.review.ups) || 0) - (Number(props.review.downs) || 0)
				).toString()}
			/>
			<View style={{height: 2}} />
			<Highlight
				disabled
				onPress={() => {
					hapticFeedback();
					dispatch(
						setVote({
							_id: props.review._id as string,
							vote: currentVote === 'down' ? 'neutral' : 'down',
							previousVote: currentVote,
							token: token as string,
							institution,
						})
					);
				}}
			>
				<Thumb
					style={{
						tintColor: getArrowColor(
							currentVote === 'down',
							Colors.Red,
							props.isMine,
							appearance
						),
						opacity: 0.3,
					}}
					source={require('../assets/downvote.png')}
				/>
			</Highlight>
		</Container>
	);
};
