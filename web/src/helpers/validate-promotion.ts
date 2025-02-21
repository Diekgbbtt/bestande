import isAfter from 'date-fns/isAfter';
import moment from 'moment';
import isURL from 'validator/lib/isURL';
import {PromotionResponse} from '../../../core/models/promotion';

const validatePromotion = (event: PromotionResponse) => {
	const errors: string[] = [];
	if (!event.promoter || event.promoter.length < 3) {
		errors.push('Promoter sollte mindestens 3 Zeichen lang sein');
	}

	if (!event.name || event.name.length < 3) {
		errors.push('Name sollte mindestens 3 Zeichen lang sein');
	}

	if (!event.promoter_link || !isURL(event.promoter_link)) {
		errors.push('Website-URL ist nicht gültig');
	}

	if (!moment(event.start_date).isValid()) {
		errors.push('Datum / Startzeit ist ungültig');
	}

	if (!moment(event.end_date).isValid()) {
		errors.push('Endzeit ist ungültig');
	}

	if (moment(event.start_date).isAfter(event.end_date)) {
		errors.push('Endzeit ist vor der Startzeit');
	}

	if (moment(event.start_date).isAfter(event.end_date)) {
		errors.push('Endzeit ist vor der Startzeit');
	}

	if (
		event.scheduled &&
		event.scheduled_start &&
		event.scheduled_end &&
		(isAfter(event.scheduled_start, event.scheduled_end) ||
			event.scheduled_start === event.scheduled_end)
	) {
		errors.push('Zeitfenster-Ende ist vor dem Zeitfenster-Start');
	}

	return errors;
};

export default validatePromotion;
