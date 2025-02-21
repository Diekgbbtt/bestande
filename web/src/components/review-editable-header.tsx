import Tooltip from '@jonny/tooltip/dist';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import deLocale from 'date-fns/locale/de';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import Stars from '../../../core/components/stars-web';

import {periodToString} from '../../../core/functions/uzh-period';

import {RatingCore} from '../../../core/types/ratings';
import {getPeriodForDate} from './get-period-for-date';
import {getModule} from '../reducers/modules';
import {useWebState} from '../../../core/functions/use-app-state';
import {useDispatch} from 'react-redux';
import {Institution} from '../../../core/models/credit';
import {fetchModule} from '../actions/modules';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import Module from '../../../core/models/module';
import {getGermanName} from './search-result';

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

const getName = (username: string | null | undefined) => {
	if (username) {
		return username;
	}
	return 'Anonymous';
};

const Subtitle = styled.span`
	color: gray;
	font-size: 11px;
	margin-top: -4px;
	display: inline-block;
`;

const ReviewHeader = (props: {review: RatingCore; onProfilePage: boolean}) => {
	const {review, onProfilePage} = props;
	const dispatch = useDispatch();

	const credit = useWebState((state) =>
		getModule(
			state,
			mapToUniSlug(review.university) + '/' + review.uni_identifier
		)
	);
	const doFetchModule = useCallback(
		(inst: Institution, uni_identifier: string) => {
			dispatch(fetchModule(inst, uni_identifier));
		},
		[dispatch]
	);

	useEffect(() => {
		if (!credit.data && onProfilePage) {
			doFetchModule(review.university, review.uni_identifier);
		}
	}, [doFetchModule, review.uni_identifier, credit.data, review.university]);

	return (
		<Container>
			{!onProfilePage ? (
				<Panel>
					<AvatarPlaceholder />
				</Panel>
			) : null}
			<Panel style={{flex: 1, marginLeft: 16}}>
				{onProfilePage ? (
					<Username hasSubtitle={false}>
						{credit.data?.translatedNames
							? getGermanName(credit.data as Module)
							: credit.data?.name}
					</Username>
				) : (
					<Username hasSubtitle={false}>
						{getName(review.username)}
					</Username>
				)}
				{review.direction ? <Subtitle>{review.direction}</Subtitle> : null}
				<Subtitle>
					<Tooltip
						preferredPlacement="right"
						tip={
							'am ' +
							format(review.date, " EE dd.MM.yyyy 'um' HH:mm", {
								locale: deLocale,
							})
						}
					>
						<span style={{paddingRight: 5}}>
							{formatDistance(new Date(review.date), new Date(), {
								locale: deLocale,
								includeSeconds: true,
								addSuffix: true,
							})}{' '}
							(
							{periodToString(getPeriodForDate(new Date(review.date)))}
							)
						</span>
					</Tooltip>
				</Subtitle>
			</Panel>
			<Panel style={{alignItems: 'flex-end'}}>
				<Stars stars={review.score} size={12} half />
				{review.grade ? (
					<div>
						<div style={{marginTop: 4}} />
						<Subtitle>Note: {review.grade}</Subtitle>
					</div>
				) : null}
			</Panel>
		</Container>
	);
};

export default ReviewHeader;
