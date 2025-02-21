import {Platform} from 'react-native';
import {Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';

export class StorageKeys {
	static username(institution: Institution): string {
		if (institution === ETH) {
			return 'eth_username';
		}

		if (Platform.OS === 'ios') {
			return 'username';
		}

		if (Platform.OS === 'android') {
			return 'uzh_username';
		}

		return 'uzh_username';
	}

	static password(institution: Institution): string {
		if (institution === ETH) {
			return 'eth_password';
		}

		if (Platform.OS === 'ios') {
			return 'password';
		}

		if (Platform.OS === 'android') {
			return 'uzh_password';
		}

		return 'uzh_password';
	}

	static ownServer(): string {
		if (Platform.OS === 'ios') {
			return 'ownServer';
		}

		if (Platform.OS === 'android') {
			return 'ownServer';
		}

		return 'ownServer';
	}

	static lastUpdate(institution: Institution): string {
		if (institution === UZH) {
			return 'lastUpdate';
		}

		return `${institution.toLowerCase()}_lastUpdate`;
	}
}
