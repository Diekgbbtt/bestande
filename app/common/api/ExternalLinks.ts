import {Linking, Platform} from 'react-native';
import {openLink} from '../../../core/functions/open-link';
import {
	currentSemesterUzh,
	currentYearUzh,
} from '../../../core/models/current-period';
import {ExpandedPerson} from '../../../core/types/people-state';
import {RawPerson, RoomType} from '../../../core/types/schedule';

const GoogleMapsScheme = 'comgooglemaps://';
export class ExternalLinks {
	static isGoogleMapsInstalled(): Promise<boolean> {
		return Linking.canOpenURL(GoogleMapsScheme);
	}

	static openMaps(longitude: number, latitude: number) {
		if (Platform.OS === 'ios') {
			return Linking.canOpenURL(GoogleMapsScheme)
				.then((isInstalled) => {
					if (isInstalled) {
						return openLink(
							`${GoogleMapsScheme}?q=${longitude},${latitude}&zoom=14&views=satellite,transit`
						);
					}

						return openLink(
							`http://maps.apple.com/?ll=${longitude},${latitude}`
						);
				})
				.catch((err) => {
					console.log('Error opening URL', err);
				});
		}

			return openLink(
				`http://maps.google.com/maps?q=loc:${longitude},${latitude}`
			);
	}

	static openPlan(room: RoomType) {
		if (room.plan) {
			return openLink(room.plan);
		}
	}

	static openPerson(person: RawPerson | ExpandedPerson) {
		const link = `https://studentservices.uzh.ch/uzh/anonym/vvz/index.html#/details/${currentYearUzh}/${currentSemesterUzh}/P/${person.uni_identifier}`;
		openLink(link);
	}
}
