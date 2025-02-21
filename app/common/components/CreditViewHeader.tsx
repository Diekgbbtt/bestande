import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CountsTowardsCreditsMap} from '../../../core/actions/countsTowardsCredits';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {CountsTowardsAverage} from '../../../core/functions/CountsTowardsAverage';
import {doesCountTowardsAverage} from '../../../core/functions/does-count-towards-average';
import {doesCountTowardsCredit} from '../../../core/functions/does-count-towards-credit';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {CountsTowardsAverageMap} from '../../../core/types/counts-towards-average-state';
import {FontWithTransition} from './FontWithTransition';

const styles = StyleSheet.create({
	top: {
		flexDirection: 'row',
		height: 75,
	},
	panel: {
		flex: 2,
		paddingLeft: 12,
		paddingTop: 10,
		paddingBottom: 10,
	},
	shutdown: {
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.03)',
	},
	title: {
		color: 'gray',
		fontWeight: 'bold',
	},
	value: {
		fontSize: 30,
	},
});

const calcECTS = (
	credits: Credit[],
	doesCount: (credit: Credit) => boolean
) => {
	const whoCount = credits.filter(doesCount);
	return whoCount.reduce((a, b) => a + Number(b.credits_received), 0);
};

const calcAverage = (
	props: Props,
	countsTowardsAverage: CountsTowardsAverageMap,
	countsTowardsCredits: CountsTowardsCreditsMap
) => {
	let ects = 0;
	let grades = 0;
	const modules = props.credits;
	for (const mod of modules) {
		const counts = doesCountTowardsAverage(
			countsTowardsCredits,
			countsTowardsAverage,
			mod
		);
		if (counts) {
			const amount = Number(mod.credits_received || mod.credits_worth);
			if (amount) {
				ects += Number(amount);
			}

			if (mod.grade !== null) {
				grades +=
					(CountsTowardsAverage.parseGrade(mod.grade) as number) * amount;
			}
		}
	}

	return grades === 0 ? '-' : Math.round((grades / ects) * 100) / 100;
};

export const CreditViewHeader = (props: Props) => {
	const doesCount = useAppState((state) => (credit: Credit) =>
		doesCountTowardsCredit(state.countsTowardsCredits, credit)
	);
	const safeArea = useSafeAreaInsets();
	const language = useLanguage();
	const appearance = useAppearance();
	const ready = useAppState((state) => state.ready.header);
	const countsTowardsAverage = useAppState(
		(state) => state.countsTowardsAverage
	);
	const countsTowardsCredits = useAppState(
		(state) => state.countsTowardsCredits
	);
	return (
		<View
			style={{
				backgroundColor: appearance.BACKGROUND,
				paddingLeft: safeArea.left,
				paddingRight: safeArea.right,
			}}
		>
			<View
				style={[
					styles.shutdown,
					{
						borderBottomColor: appearance.BORDER_COLOR,
						borderBottomWidth: 1,
					},
				]}
			>
				<Text
					style={{
						color: appearance.SUBTITLE,
					}}
				>
					{rawStrings.ARCHIVE_MODE[language]}
				</Text>
			</View>
			<View style={styles.top}>
				<View style={styles.panel}>
					{ready ? (
						<FontWithTransition
							style={[styles.value, {color: appearance.TITLE}]}
							text={String(calcECTS(props.credits, doesCount))}
						/>
					) : (
						<UnifiedProgress left />
					)}
					<View style={{flexDirection: 'row'}}>
						<Text style={[styles.title, {color: appearance.SUBTITLE}]}>
							ECTS
						</Text>
						<Text
							style={{
								color: appearance.COUNTS_INDICATOR_LEGEND,
								marginLeft: 10,
							}}
						>
							c
						</Text>
					</View>
				</View>
				<View style={styles.panel}>
					{ready ? (
						<FontWithTransition
							style={[styles.value, {color: appearance.TITLE}]}
							text={String(
								calcAverage(props, countsTowardsAverage, countsTowardsCredits)
							)}
						/>
					) : (
						<UnifiedProgress left />
					)}
					<View style={{flexDirection: 'row'}}>
						<Text style={[styles.title, {color: appearance.SUBTITLE}]}>
							{rawStrings.AVERAGE[language]}
						</Text>
						<Text
							style={{
								color: appearance.COUNTS_INDICATOR_LEGEND,
								marginLeft: 10,
								marginTop: Platform.OS === 'android' ? 0 : -2,
							}}
						>
							⌀
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

type Props = {
	credits: Credit[];
};
