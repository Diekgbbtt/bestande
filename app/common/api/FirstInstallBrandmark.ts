import AsyncStorage from '@react-native-community/async-storage';

const STORAGE_KEY = 'firstInstall';

export class FirstInstallBrandmark {
	static setIfNot() {
		AsyncStorage.getItem(STORAGE_KEY)
			.then((firstInstall) => {
				if (firstInstall) {
					console.log(
						'App was first installed on ' +
							new Date(parseInt(firstInstall, 10)).toString()
					);
				} else {
					return AsyncStorage.setItem(STORAGE_KEY, `${Date.now()}`);
				}
			})
			.catch((err) => console.error(err));
	}
}
