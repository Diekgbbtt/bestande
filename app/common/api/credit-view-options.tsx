import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import {Config} from '../../../core/data/Config';
import {AddModuleButton} from '../components/AddModuleButton';
import {BookRecommendationButton} from '../components/BookRecommendationButton';
import {HeaderIconRow} from '../components/HeaderIconRow';
import LogoHeader from '../components/LogoHeader';
import {RecommendationButton} from '../components/RecommendationButton';
import {SettingsButton} from '../components/SettingsButton';

export const creditViewOptions = (tablet: boolean): StackNavigationOptions => ({
	headerLeft: () => (tablet ? <LogoHeader isLeft /> : null),
	headerTitle: () => (tablet ? null : <LogoHeader />),
	title: 'Bestande',
	headerRight: () => (
		<HeaderIconRow>
			<SettingsButton />
			<BookRecommendationButton visible={Config.RECOMMENDED_BOOKS} />
			<RecommendationButton />
			<AddModuleButton />
		</HeaderIconRow>
	),
});
