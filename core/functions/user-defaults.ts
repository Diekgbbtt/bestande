'use strict';

const {NativeModules} = require('react-native');
const pify = require('pify');

let UserDefaults: any = {};
let _setObjectForKey = (a: any, b: any) => Promise.resolve(a + b);
let _setBoolForKey = (a: any, b: any) => Promise.resolve(a + b);
let _arrayForKey = (a: any) => Promise.resolve(a);
let _stringForKey = (a: any) => Promise.resolve(a);
let _objectForKey = (a: any) => Promise.resolve(a);
let _boolForKey = (a: any) => Promise.resolve(a);

if (NativeModules.RNUserDefaultsIOS) {
	UserDefaults = NativeModules.RNUserDefaultsIOS;
	_setObjectForKey = pify(UserDefaults.setObjectForKey);
	_setBoolForKey = pify(UserDefaults.setBoolForKey);

	_arrayForKey = pify(UserDefaults.arrayForKey);
	_stringForKey = pify(UserDefaults.stringForKey);
	_objectForKey = pify(UserDefaults.objectForKey);
	_boolForKey = pify(UserDefaults.boolForKey);
}

module.exports = {
	setArrayForKey(array, key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _setObjectForKey(array, key);
	},
	setStringForKey(string, key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _setObjectForKey(string, key);
	},
	setObjectForKey(object, key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _setObjectForKey(object, key);
	},
	setBoolForKey(bool, key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _setBoolForKey(bool, key);
	},
	arrayForKey(key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _arrayForKey(key);
	},
	stringForKey(key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _stringForKey(key);
	},
	objectForKey(key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _objectForKey(key);
	},
	boolForKey(key) {
		if (!NativeModules.RNUserDefaultsIOS) {
			return Promise.resolve();
		}

		return _boolForKey(key);
	},
};
