import addDays from 'date-fns/addDays';
import sortBy from 'lodash/sortBy';
import {MensaDay, MensaId} from '../data/uzh-mensa';
import {AppLanguage} from '../models/app-language';
import {AppFoodState, FoodStateType, MensaApiResponse} from '../types/food';
import OpeningHours from './opening-hours';

export const getTwoLetterLabel = (day: MensaDay, lang: AppLanguage) => {
	if (day === 'montag') {
		return 'MO';
	}

	if (day === 'dienstag' && lang === 'en') {
		return 'TU';
	}

	if (day === 'mittwoch' && lang === 'en') {
		return 'WE';
	}

	if (day === 'donnerstag' && lang === 'en') {
		return 'TH';
	}

	if (day === 'freitag') {
		return 'FR';
	}

	if (day === 'dienstag') {
		return 'DI';
	}

	if (day === 'mittwoch') {
		return 'MI';
	}

	if (day === 'donnerstag') {
		return 'DO';
	}
};

export const days: MensaDay[] = [
	'montag',
	'dienstag',
	'mittwoch',
	'donnerstag',
	'freitag',
];

export const getInitialDay = (): MensaDay => {
	return days[new Date().getDay() - 1] || 'montag';
};

export const getMensaKey = (mensa: MensaId, day: MensaDay) => {
	return `${mensa}-${day}`;
};

export const initialMensaPlan: FoodStateType = {
	loading: false,
	data: null,
	error: null,
};

export const getMensaPlan = (
	food: AppFoodState,
	mensa: MensaId,
	day: MensaDay
) => {
	return food.plans[getMensaKey(mensa, day)] || initialMensaPlan;
};

export const resolvedDay = (
	state: {food: AppFoodState},
	mensa: MensaId,
	day: MensaDay
): number | null => {
	const plan = state.food.plans[getMensaKey(mensa, day)];
	if (plan?.resolvedDate) {
		return plan.resolvedDate;
	}

	for (const d of days) {
		const p = state.food.plans[getMensaKey(mensa, d)];
		if (p?.resolvedDate) {
			return addDays(
				new Date(p.resolvedDate),
				days.indexOf(day) - days.indexOf(d)
			).getTime();
		}
	}

	return null;
};

export const openFirst = (plan: MensaApiResponse[]) => {
	return sortBy(plan, (p) =>
		p.openingHours
			? Number(Boolean(new OpeningHours(p.openingHours).open)) +
			  Number(p.plan.length === 0) * 1000
			: Infinity
	);
};
