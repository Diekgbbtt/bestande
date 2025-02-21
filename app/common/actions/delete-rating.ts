import {Alert} from 'react-native-normalized';
import {
	deletingRating,
	DeletingRatingAction,
	ErrorDeletingRating,
	errorDeletingRating,
	RatingDeleted,
	ratingDeleted,
} from '../../../core/actions/delete-rating';
import {HudManager} from '../../../core/components/HudManager';
import {sendDeleteRating} from '../../../core/functions/api';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {RatingCore} from '../../../core/types/ratings';

export const deleteRating = (
	rating: RatingCore,
	token: string,
	institution: Institution,
	language: AppLanguage
) => {
	return async (dispatch: {
		(arg0: DeletingRatingAction): void;
		(arg0: RatingDeleted): void;
		(arg0: ErrorDeletingRating): void;
	}) => {
		try {
			dispatch(deletingRating(rating._id));
			await sendDeleteRating(rating._id, token);
			dispatch(ratingDeleted(rating._id, rating, institution));
			HudManager.setHudContent({
				icon: require('../assets/trash-square.png'),
				label: rawStrings.DELETED[language] + '!',
			});
		} catch (err) {
			dispatch(errorDeletingRating(rating._id, err.message));
			Alert.alert(rawStrings.ERROR.de, err.message, [
				{text: rawStrings.OK[language]},
			]);
		}
	};
};
