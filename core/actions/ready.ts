import AsyncStorage from '@react-native-community/async-storage';
import flatten from 'lodash/flatten';
import fromPairs from 'lodash/fromPairs';
import md5 from 'md5';
import DeviceInfo from 'react-native-device-info';
import {batchActions} from 'redux-batched-actions';
import {ThunkDispatch} from 'redux-thunk';
import {Config} from '../data/Config';
import {StorageKeys} from '../data/StorageKeys';
import {MensaId} from '../data/uzh-mensa';
import {migrateFields} from '../functions/asyncstorage-migration';
import {CountsTowardsAverage} from '../functions/CountsTowardsAverage';
import {CountsTowardsCredits} from '../functions/CountsTowardsCredits';
import {cacheKey as creditCacheKey, CreditCache} from '../functions/CreditCache';
import {getUserHash} from '../functions/get-user-hash';
import {getAsyncIsomorphic} from '../functions/isomorphic-async-storage';
import {makeProfile} from '../functions/make-profile';
import {getInitialDay} from '../functions/mensa-helpers';
import {getModuleCollection} from '../functions/ModuleCollectionPersister';
import {
	readCustomCredits,
	readLastReadTimestamps,
	readPreferredAppearance,
	readTypedAndUnsentKey,
} from '../functions/persistance';
import {SeriesConfig} from '../functions/SeriesConfig';
import {truthy} from '../functions/truthy';
import {
	getOptedInSetting,
	loadGradeStatisticLastUploadedHashState,
} from '../logic/grade-opt/persistance';
import {setLastUploadHashState, setOptedIn} from '../logic/grade-opt/reducer';
import {getClientNonce} from '../logic/sync-persistance';
import {Allergen} from '../models/allergens';
import {AppLanguage} from '../models/app-language';
import {CustomModule, Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';
import {setPreferredAppearance} from '../reducers/appearance';
import {setAllTypedAndUnsent, setReadTimestampState} from '../reducers/chat-server';
import {SET_OVERRRIDE_MAP} from '../reducers/creditOverrides';
import {CustomCredit, setCustomCredits} from '../reducers/customCredits';
import {
	allMensaForInstitution,
	changeMensa,
	changePricingAction,
	loadMensa,
	retiredCanteens,
	setAllergenFilter,
	setAllFilters,
	setNutrition,
	setShowCalories,
} from '../reducers/food';
import {setHiddenContent} from '../reducers/hiddenContent';
import {setSelectedLanguage} from '../reducers/language';
import {setModules} from '../reducers/moduleCollection';
import {userSignalsNotificationPreference} from '../reducers/notifications';
import {SET_READY} from '../reducers/ready';
import {setClientNonce} from '../reducers/sync';
import {setUniqueUserId} from '../reducers/users';
// import demo from '../../common/summary-of-credits/demo';
import {AppState} from '../types/app-state';
import {AppearanceSetting} from '../types/appearance-state';
import {CountsTowardsAverageMap} from '../types/counts-towards-average-state';
import {NutritionFilterValue, PricingSetting} from '../types/food';
import {setCountsTowardsAverageMap} from './countsTowardsAverage';
import {
	CountsTowardsCreditsMap,
	setCountsTowardsCreditsMap,
} from './countsTowardsCredits';
import {setInstitution} from './institution';
import {loginSuccessEvent, setUsername} from './login';
import {getPromotions} from './promotions';
import {fetchRatings} from './ratings';
import {setSeriesConfig} from './seriesConfig';

function setReady() {
	return {
		type: SET_READY,
	};
}

export function getReady() {
	return async (
		dispatch: ThunkDispatch<{}, {}, any>,
		getState: () => AppState
	) => {
		await migrateFields([
			StorageKeys.username(UZH),
			StorageKeys.username(ETH),
			'mensaPricing',
			'mensaArea',
			'preferredLanguage',
			'institution',
			'foodFilters',
			'hiddenContent',
			'allergenFilter',
			'nutrition',
			'counts-towards-average',
			'counts-towards-credits',
			creditCacheKey(UZH),
			creditCacheKey(ETH),
		]);
		const [
			usernameUzh,
			usernameEth,
			summaryUzh,
			summaryEth,
			seriesConfig,
			lastTimestamps,
			appearanceSetting,
			showCalories,
			gradeStatisticsLastUploadedHashState,
			clientNonce,
		] = await Promise.all([
			AsyncStorage.getItem(StorageKeys.username(UZH)),
			AsyncStorage.getItem(StorageKeys.username(ETH)),
			CreditCache.get(UZH),
			CreditCache.get(ETH),
			SeriesConfig.get(),
			readLastReadTimestamps(),
			readPreferredAppearance(),
			getAsyncIsomorphic('showCalories'),
			loadGradeStatisticLastUploadedHashState(),
			getClientNonce(),
		]);
		console.log(gradeStatisticsLastUploadedHashState);
		if (showCalories === 'false') {
			dispatch(setShowCalories(false));
		}

		dispatch(setPreferredAppearance(appearanceSetting as AppearanceSetting));

		const {
			mensaArea,
			preferredLanguage,
			institution,
			foodFilters,
			hiddenContent,
			allergenFilter,
			nutrition,
			creditOverrides,
			prefersNotifications,
			mensaPricing,
			uniqueId,
		} = fromPairs(
			await AsyncStorage.multiGet([
				'mensaArea',
				'preferredLanguage',
				'institution',
				'foodFilters',
				'hiddenContent',
				'allergenFilter',
				'nutrition',
				'creditOverrides',
				'prefersNotifications',
				'mensaPricing',
				'uniqueId',
			])
		);

		let actualLanguage = preferredLanguage;
		if (actualLanguage === 'it' && Config.DEPRECATE_ITALIAN) {
			actualLanguage = 'de';
		}

		let finalUniqueId = uniqueId;

		if (!finalUniqueId) {
			finalUniqueId = DeviceInfo.getUniqueId();
			await AsyncStorage.setItem('uniqueId', finalUniqueId);
		}

		dispatch(setUniqueUserId(finalUniqueId));

		const [
			moduleCollection,
			map,
			creditCountMap,
			typedAndUnsent,
			customCredits,
			optedIn,
		] = (await Promise.all([
			getModuleCollection(),
			CountsTowardsAverage.getMap(),
			CountsTowardsCredits.getMap(),
			readTypedAndUnsentKey(),
			readCustomCredits(),
			getOptedInSetting(),
		])) as [
			CustomModule[],
			CountsTowardsAverageMap | null,
			CountsTowardsCreditsMap | null,
			{
				[key: string]: string;
			},
			CustomCredit[],
			boolean
		];

		//	dispatch(loginSuccessEvent(demo, UZH));

		const batch = [
			setCountsTowardsAverageMap(map),
			setCountsTowardsCreditsMap(creditCountMap),
			setReadTimestampState(lastTimestamps),
			setUsername(usernameEth || '', ETH),
			changePricingAction((mensaPricing as PricingSetting) || 'student'),
			setOptedIn(optedIn),
			setSeriesConfig(seriesConfig),
			foodFilters ? setAllFilters(JSON.parse(foodFilters)) : null,
			actualLanguage
				? setSelectedLanguage(actualLanguage as AppLanguage)
				: null,
			allergenFilter
				? setAllergenFilter(allergenFilter.split(',') as Allergen[])
				: null,
			nutrition
				? setNutrition((nutrition as NutritionFilterValue) || 'all')
				: null,
			mensaArea && !retiredCanteens.includes(mensaArea)
				? changeMensa(mensaArea as MensaId)
				: null,
			setInstitution((institution || UZH) as Institution),
			setHiddenContent((hiddenContent || '').split(',').filter(truthy)),
			setModules(moduleCollection),
			setLastUploadHashState(gradeStatisticsLastUploadedHashState),
			setClientNonce(clientNonce),
			summaryUzh ? loginSuccessEvent(summaryUzh, UZH) : null,
			summaryEth ? loginSuccessEvent(summaryEth, ETH) : null,
			{
				type: SET_OVERRRIDE_MAP,
				overrides: creditOverrides ? JSON.parse(creditOverrides) : {},
			},
			userSignalsNotificationPreference(
				prefersNotifications === 'true'
					? 'explicitly-yes'
					: prefersNotifications === 'false'
					? 'explicitly-no'
					: 'yes'
			),
			setReady(),
			setAllTypedAndUnsent(typedAndUnsent),
			setCustomCredits(customCredits),
		].filter(truthy);

		dispatch(batchActions(batch));
		await AsyncStorage.setItem(
			'mensaPricing',
			(mensaPricing as PricingSetting) || 'student'
		);
		setImmediate(() => {
			const state = getState();
			dispatch(
				getPromotions({
					profile: makeProfile(state),
				})
			);

			const allMensa = flatten(
				allMensaForInstitution((institution || UZH) as Institution).map(
					(m) => m.mensa
				)
			);

			const selectedMensa =
				allMensa.find((m) => m.id === mensaArea) || allMensa[0];

			if (selectedMensa) {
				const selectedInstitution =
					selectedMensa.institution ||
					((institution || UZH) as Institution);

				dispatch(
					loadMensa(
						selectedMensa.id,
						getInitialDay(),
						selectedInstitution,
						preferredLanguage === 'de' || preferredLanguage === 'en'
							? preferredLanguage
							: 'de',
						getUserHash(state, selectedInstitution)
					)
				);
			}

			dispatch(
				fetchRatings(
					usernameEth ? md5(usernameEth) : md5(finalUniqueId as string),
					ETH
				)
			);
			dispatch(
				fetchRatings(
					usernameUzh ? md5(usernameUzh) : md5(finalUniqueId as string),
					UZH
				)
			);
		});
	};
}
