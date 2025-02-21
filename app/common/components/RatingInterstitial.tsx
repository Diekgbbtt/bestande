import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {MyRating} from '../../../core/types/ratings';
import {getUnratedCredits} from '../api/get-unrated-credits';
import {Rater} from './Rater';

function baseRandom(lower: number, upper: number, seed: number) {
	return lower + Math.floor(seed * (upper - lower + 1));
}

function deterministicSample(
	array: Credit[],
	seed: number
): Credit | undefined {
	const {length} = array;
	return length ? array[baseRandom(0, length - 1, seed)] : undefined;
}

const getRandomCredit = (
	visibleCredits: Credit[],
	myRatings: MyRating[],
	random: number
): Credit | null => {
	const unratedCredits = getUnratedCredits(visibleCredits, myRatings);
	if (unratedCredits.length === 0) {
		return null;
	}

	return deterministicSample(unratedCredits, random) || null;
};

export const RatingInterstitial = () => {
	const [random, setRandom] = useState<number>(Math.random());
	const appearance = useAppearance();
	const visibleCredits = useAppState((state) => getVisibleCredits(state));
	const myRatings = useAppState(
		(state) => state.multiMyRatings[state.institution.institution].ratings
	);
	const [credit, setCredit] = useState<Credit | null>(
		getRandomCredit(visibleCredits, myRatings, random)
	);
	const language = useLanguage();

	useEffect(() => {
		setCredit(getRandomCredit(visibleCredits, myRatings, random));
	}, [random]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				backgroundColor: appearance.BACKGROUND,
			}}
		>
			{credit === null ? (
				<Text style={{color: appearance.SUBTITLE, textAlign: 'center'}}>
					{rawStrings.YOU_HAVE_RATED_ALL_MODULES[language]}
				</Text>
			) : (
				<Rater
					credit={credit}
					showThankYou
					onRefresh={() => {
						setRandom(Math.random());
					}}
				/>
			)}
		</View>
	);
};
