import React, {useEffect, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {getMoreRating, getRating} from '../../../core/actions/ratings';
import {Flexer, Row} from '../../../core/components/Primitives';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {Spacer} from '../../../core/components/UI/Spacer';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getRatingsStateForModule} from '../../../core/functions/get-ratings-state-for-module';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {Credit, Institution} from '../../../core/models/credit';
import {ApiResponse} from '../../../core/reducers/api';
import {RatingSortOption} from '../../../core/types/ratings';
import {Last9MonthsChange} from '../../../web/src/components/last-9-months-change';
import RatingOverview from './RatingOverview';
import {RatingSortPicker} from './RatingSortPicker';
import {Review} from './Review';

type Props = {
	institution: Institution;
	uni_identifier: string;
	credit: Credit;
	course: ApiResponse;
};

const HeaderRow = styled(Row)`
	padding-right: 12px;
`;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
	const paddingToBottom = 20;
	return (
		layoutMeasurement.height + contentOffset.y >=
		contentSize.height - paddingToBottom
	);
};

export const CreditRatings = (props: Props) => {
	const [sortOption, setSortOption] = React.useState<RatingSortOption>('best');
	const justLoadedMore = useRef(false);
	const token = useAppState((state) => getUserHash(state, null));

	const ratings = useAppState((state) =>
		getRatingsStateForModule(
			state,
			props.institution,
			props.uni_identifier,
			sortOption
		)
	);

	const ratingsForSummary = useAppState((state) =>
		getRatingsStateForModule(
			state,
			props.institution,
			props.uni_identifier,
			'best'
		)
	);

	const dispatch = useDispatch();

	const appearance = useAppearance();

	const {uni_identifier, institution} = props;

	useEffect(() => {
		justLoadedMore.current = false;
	}, [ratings.data]);

	useEffect(() => {
		if (!ratings.data && !ratings.loading) {
			dispatch(
				getRating({
					uni_identifier,
					institution,
					sortOption,
					token,
				})
			);
		}

		if (
			!ratingsForSummary.data &&
			!ratingsForSummary.loading &&
			sortOption !== 'best'
		) {
			dispatch(
				getRating({
					uni_identifier,
					institution,
					sortOption,
					token,
				})
			);
		}
	}, [
		uni_identifier,
		institution,
		ratings,
		dispatch,
		sortOption,
		ratingsForSummary.data,
		ratingsForSummary.loading,
		token,
	]);
	const {data} = ratingsForSummary;

	if (ratingsForSummary.loading || !data) {
		return (
			<View
				style={{
					padding: 20,
					backgroundColor: appearance.BACKGROUND,
					flex: 1,
				}}
			>
				<UnifiedProgress />
			</View>
		);
	}

	const listItems = [
		'header',
		...(ratings.data ? ratings.data.ratings : ['loader']),
		'footer',
	];

	return (
		<FlatList
			onScroll={({nativeEvent}) => {
				if (isCloseToBottom(nativeEvent)) {
					const {total} = data;
					const {ratings: ratingsArray} = data;
					if (
						!justLoadedMore.current &&
						total > ratingsArray.length &&
						!ratings.loadingMore
					) {
						justLoadedMore.current = true;
						dispatch(
							getMoreRating({
								uni_identifier: props.credit
									.uni_identifier as string,
								institution: CreditHelpers.getInstitution(
									props.credit
								),
								offset: ratingsArray.length,
								sortOption,
								token,
								email: undefined,
							})
						);
					}
				}
			}}
			scrollEventThrottle={400}
			style={{backgroundColor: appearance.BACKGROUND}}
			keyExtractor={(i) => i}
			data={listItems}
			initialNumToRender={5}
			renderItem={({item}) => {
				if (item === 'header') {
					return (
						<SafeSideSpace key="header">
							<RatingOverview
								overview={data.overview}
								average={data.average as number}
								total={data.totalInTimespan}
							/>
							<Last9MonthsChange
								average={data.average}
								previousAverage={data.previousAverage}
							/>
							<Spacer />
							<Spacer />
							<HeaderRow>
								<Flexer />
								<RatingSortPicker
									setSortOption={setSortOption}
									sortOption={sortOption}
								/>
							</HeaderRow>
						</SafeSideSpace>
					);
				}

				if (item === 'loader') {
					return (
						<View
							style={{
								padding: 20,
								backgroundColor: appearance.BACKGROUND,
							}}
						>
							<UnifiedProgress />
						</View>
					);
				}

				if (item === 'footer') {
					if (ratings.loadingMore) {
						return (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									flex: 1,
									justifyContent: 'center',
									height: 45,
								}}
							>
								<UnifiedProgress />
							</View>
						);
					}

					return <View style={{height: 25}} />;
				}

				return (
					<Review
						key={item}
						_id={item}
						credit={props.credit}
						course={props.course}
					/>
				);
			}}
		/>
	);
};
