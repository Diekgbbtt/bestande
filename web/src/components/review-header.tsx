import Tooltip from '@jonny/tooltip/dist';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import deLocale from 'date-fns/locale/de';
import React from 'react';
import styled from 'styled-components';
import Stars from '../../../core/components/stars-web';
import {Colors} from '../../../core/functions/Colors';
import {formatString} from '../../../core/functions/format-string';
import {periodToString} from '../../../core/functions/uzh-period';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {RatingCore} from '../../../core/types/ratings';
import {didCourseChangeInstructorsSinceReview} from './did-course-change-instructors-since-review';
import {getPeriodForDate} from './get-period-for-date';

const AVATAR_SIZE = 24;

const Container = styled.div`
	flex-direction: row;
	padding-top: 8px;
	padding-bottom: 8px;
	min-height: 48px;
	display: flex;
`;

const AvatarPlaceholder = styled.div`
	height: ${AVATAR_SIZE}px;
	width: ${AVATAR_SIZE}px;
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 16px;
`;

const Panel = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const Username = styled.div<{
	hasSubtitle: boolean;
}>`
	font-size: ${(props) => (props.hasSubtitle ? 12 : 14)}px;
`;

const getName = (props: {review: RatingCore}) => {
	if (props.review.username) {
		return props.review.username;
	}

	return 'Anonymous';
};

const Subtitle = styled.span`
	color: gray;
	font-size: 11px;
	margin-top: -4px;
	display: inline-block;
`;

const ReviewHeader = (props: {review: RatingCore; course: ApiResponse}) => {
	const changes = didCourseChangeInstructorsSinceReview(
		props.course,
		props.review
	);
	const hasSubtitle =
		props.review.direction || changes.instructors || changes.responsible;
	return (
		<Container>
			<Panel>
				<AvatarPlaceholder />
			</Panel>
			<Panel style={{flex: 1, marginLeft: 16}}>
				<Username hasSubtitle={Boolean(hasSubtitle)}>
					{getName(props)}
				</Username>
				{props.review.direction ? (
					<Subtitle>{props.review.direction}</Subtitle>
				) : null}
				<Subtitle>
					<Tooltip
						preferredPlacement="right"
						tip={
							'am ' +
							format(props.review.date, " EE dd.MM.yyyy 'um' HH:mm", {
								locale: deLocale,
							})
						}
					>
						<span style={{paddingRight: 5}}>
							{formatDistance(
								new Date(props.review.date),
								new Date(),
								{
									locale: deLocale,
									includeSeconds: true,
									addSuffix: true,
								}
							)}{' '}
							(
							{periodToString(
								getPeriodForDate(new Date(props.review.date))
							)}
							)
						</span>
					</Tooltip>
				</Subtitle>
				{changes.instructors ? (
					<Subtitle style={{color: Colors.Yellow}}>
						{formatString(
							rawStrings.HAS_DIFFERENT_INSTRUCTORS_IN_PERIOD.de,
							periodToString(changes.lastPeriod)
						)}
					</Subtitle>
				) : null}
				{changes.responsible ? (
					<Subtitle style={{color: Colors.Yellow}}>
						{formatString(
							rawStrings.HAS_DIFFERENT_RESPONSIBLE_PERSON_IN_PERIOD.de,
							periodToString(changes.lastPeriod)
						)}
					</Subtitle>
				) : null}
			</Panel>
			<Panel style={{alignItems: 'flex-end'}}>
				<Stars stars={props.review.score} size={12} half />
				{props.review.grade ? (
					<div>
						<div style={{marginTop: 4}} />
						<Subtitle>Note: {props.review.grade}</Subtitle>
					</div>
				) : null}
			</Panel>
		</Container>
	);
};

export default ReviewHeader;
