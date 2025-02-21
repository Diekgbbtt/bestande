import formatDistance from 'date-fns/formatDistance';
import memoize from 'lodash/memoize';
import ms from 'ms';
import React from 'react';
import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import Stars from '../../../core/components/Stars';
import {Colors} from '../../../core/functions/Colors';
import {formatString} from '../../../core/functions/format-string';
import {getDateFnsLocale} from '../../../core/functions/get-date-fns-locale';
import {renderSemester} from '../../../core/functions/render-semester';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {RatingCore, RatingRequest, User} from '../../../core/types/ratings';
import {didCourseChangeInstructorsSinceReview} from '../../../web/src/components/did-course-change-instructors-since-review';
import {getPeriodForDate} from '../../../web/src/components/get-period-for-date';
import {formatGrade} from '../api/format-grade';
import {Avatar} from './Avatar';
import {ReviewMoreMenu} from './ReviewMoreMenu';

const AVATAR_SIZE = 24;

const Container = styled(View)`
	padding-left: 12px;
	padding-right: 12px;
	flex-direction: row;
	padding-top: 8px;
	padding-bottom: 8px;
	align-items: center;
`;

const Username = styled(Text)<{
	hasSubtitle?: boolean;
}>`
	font-size: ${(props) => (props.hasSubtitle ? 12 : 14)}px;
`;

const Subtitle = styled(Text)`
	font-size: 11px;
`;

const AvatarPlaceholder = styled(View)`
	height: ${AVATAR_SIZE}px;
	width: ${AVATAR_SIZE}px;
	border-radius: 16px;
`;

const VerifiedBadge = styled(Image)<{
	big?: boolean;
	team?: boolean;
}>`
	width: ${(props) => (props.big ? 12 : 10)}px;
	height: ${(props) => (props.big ? 12 : 10)}px;
	margin-left: ${(props) => (props.big ? 5 : 3)}px;
	margin-top: ${(props) => 2 + (props.team ? 1 : 0)}px;
`;

const Panel = styled(View)`
	justify-content: center;
`;

const getName = (props: {user?: User; name: string | null}) => {
	if (props.user) {
		return props.user.display_name;
	}

	if (props.name) {
		return props.name;
	}

	return 'Anonymous';
};

const RenderAvatar = (props: {user?: User}) => {
	const appearance = useAppearance();
	if (props.user?.avatar) {
		return <Avatar size={AVATAR_SIZE} source={{uri: props.user.avatar}} />;
	}

	return <AvatarPlaceholder style={{backgroundColor: appearance.BORDER_COLOR}} />;
};

const renderVerifiedBadge = (props: RatingCore | RatingRequest) => {
	// if (props?.username && props?.user.team_member) {
	// 	return <VerifiedBadge source={require('../assets/team.png')} team big />;
	// }

	if (props?.username) {
		return <VerifiedBadge source={require('../assets/verified.png')} />;
	}

	return null;
};

const memoizedFormatDistance = memoize(formatDistance);

const ReviewHeader = (props: {
	review: RatingCore | RatingRequest;
	course: ApiResponse | null;
	noTimestamp?: boolean;
}) => {
	const changes = props.course
		? didCourseChangeInstructorsSinceReview(props.course, props.review)
		: null;
	const hasNoSubtitle = props.noTimestamp;
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<Container>
			<Panel>{/* <RenderAvatar user={props.review?.user} /> */}</Panel>
			<Panel style={{flex: 1, marginLeft: 12}}>
				<View style={{flexDirection: 'row'}}>
					<Username
						style={[
							uiKit.footnoteEmphasizedObject,
							{color: appearance.TITLE},
						]}
						hasSubtitle={!hasNoSubtitle}
					>
						{props.review.username}
					</Username>
					{renderVerifiedBadge(props.review)}
				</View>
				{props.review.direction ? (
					<Subtitle style={{color: appearance.SUBTITLE}}>
						{props.review.direction}
					</Subtitle>
				) : null}
				{props.noTimestamp ? null : (
					<Subtitle style={{color: appearance.SUBTITLE}}>
						{memoizedFormatDistance(
							new Date(props.review.date as number),
							new Date(),
							{
								locale: getDateFnsLocale(language),
								includeSeconds: true,
								addSuffix: true,
							}
						)}{' '}
						(
						{renderSemester(
							getPeriodForDate(
								new Date(
									new Date(props.review.date as number).getTime() +
										ms('30d')
								)
							),
							language
						)}
						)
					</Subtitle>
				)}
				{changes?.instructors ? (
					<Subtitle style={{color: Colors.Yellow}}>
						{formatString(
							rawStrings.HAS_DIFFERENT_INSTRUCTORS_IN_PERIOD[language],
							renderSemester(
								changes.lastPeriod as number,
								language as AppLanguage
							) as string
						)}
					</Subtitle>
				) : null}
				{changes?.responsible ? (
					<Subtitle style={{color: Colors.Yellow}}>
						{formatString(
							rawStrings.HAS_DIFFERENT_RESPONSIBLE_PERSON_IN_PERIOD[
								language
							],
							renderSemester(
								changes.lastPeriod as number,
								language as AppLanguage
							) as string
						)}
					</Subtitle>
				) : null}
			</Panel>
			<Panel style={{alignItems: 'flex-end'}}>
				<Stars
					disabled
					rating={props.review.score}
					size={12}
					emptyStarColor="#fff"
				/>
				{props.review.grade ? (
					<View>
						<View style={{marginTop: 2}} />
						<Subtitle style={{color: appearance.SUBTITLE}}>
							{rawStrings.GRADE[language]}:{' '}
							{formatGrade(props.review.grade)}
						</Subtitle>
					</View>
				) : null}
			</Panel>
			<ReviewMoreMenu reviewId={props.review._id as string} />
		</Container>
	);
};

export default ReviewHeader;
