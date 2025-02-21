import AsyncStorage from '@react-native-community/async-storage';
import {put, select, takeEvery} from 'redux-saga/effects';
import {SET_COUNTS_MAP, SET_MODULE_AVG} from '../actions/countsTowardsAverage';
import {
	SET_COUNTS_CREDITS_MAP,
	SET_MODULE_COUNTS_TOWARDS_CREDIT,
} from '../actions/countsTowardsCredits';
import {SET_INSTITUTION} from '../actions/institution';
import {REMOVE_LOGIN_CREDIT, SET_USERNAME} from '../actions/login';
import {voteAdded, VoteAdded, VOTE_ADDED} from '../actions/ratings';
import {HudManager} from '../components/HudManager';
import {StorageKeys} from '../data/StorageKeys';
import {removeCourse, voteRating} from '../functions/api';
import {CountsTowardsAverage} from '../functions/CountsTowardsAverage';
import {CountsTowardsCredits} from '../functions/CountsTowardsCredits';
import {CreditCache} from '../functions/CreditCache';
import {getUserHash} from '../functions/get-user-hash';
import {isomorphicSaga} from '../functions/isomorphic-saga';
import {setModuleCollection} from '../functions/ModuleCollectionPersister';
import {
	persistCustomCredits,
	persistLastReadTimestamps,
	persistPreferredAppearance,
	persistTypedAndUnsentKey,
} from '../functions/persistance';
import {truthy} from '../functions/truthy';
import {UZH} from '../models/university';
import rawStrings from '../raw-strings';
import {AppState} from '../types/app-state';
import {AppearanceSetting} from '../types/appearance-state';
import {LastReadTimestampReducerType} from '../types/chat';
import {PricingSetting} from '../types/food';
import {AppearanceActions} from './appearance';
import {ChatServerActions} from './chat-server';
import {SET_OVERRIDE} from './creditOverrides';
import {CustomCredit, CustomCreditsTypes} from './customCredits';
import {
	CHANGE_MENSA,
	CHANGE_PRICING,
	SET_ALLERGEN_FILTER,
	SET_NUTRITION,
	TURN_OFF_FILTER,
	TURN_ON_FILTER,
} from './food';
import {HIDE_CONTENT, RESET_HIDDEN, SET_HIDDEN_CONTENT} from './hiddenContent';
import {
	ADD_MODULES,
	RemoveModule,
	REMOVE_MODULE,
	SET_MODULES,
} from './moduleCollection';

function* saveModule() {
	const modulesAfter = yield select((s: AppState) => s.moduleCollection);
	yield setModuleCollection(modulesAfter);
}

function* saveCountsMap() {
	const mapAfter = yield select((s: AppState) => s.countsTowardsAverage);
	yield CountsTowardsAverage.setMap(mapAfter);
}

function* saveCountsCreditsMap() {
	const mapAfter = yield select((s: AppState) => s.countsTowardsCredits);
	yield CountsTowardsCredits.setMap(mapAfter);
}

function* setUsername() {
	const {username, institution} = yield select((s: AppState) => ({
		username: s.multiLogin[s.institution.institution].username,
		institution: s.institution.institution,
	}));
	yield AsyncStorage.setItem(StorageKeys.username(institution), username);
}

function* setInstitution() {
	const institutionAfter = yield select(
		(s: AppState) => s.institution.institution
	);
	yield AsyncStorage.setItem('institution', institutionAfter);
}

function* setFoodFilters() {
	const filter = yield select((s: AppState) => s.food.filters);
	yield AsyncStorage.setItem('foodFilters', JSON.stringify(filter));
}

function* setAllergenFilter() {
	const filter = yield select((s: AppState) => s.food.allergenFilter);
	yield AsyncStorage.setItem('allergenFilter', filter.join(','));
}

function* setNutrition() {
	const filter = yield select((s: AppState) => s.food.nutrition);
	yield AsyncStorage.setItem('nutrition', filter);
}

function* addVote({
	_id,
	vote,
	token,
	previousVote,
	skipRequest,
	institution,
}: VoteAdded) {
	if (skipRequest) {
		return;
	}

	try {
		yield voteRating({_id, vote, token});
	} catch (err) {
		const lang = yield select((s: AppState) => s.language.selectedLanguage);
		HudManager.setHudContent({
			icon: require('../assets/clear.png'),
			label: rawStrings.COULD_NOT_VOTE[lang],
		});
		// Intentional that prevVote and vote are swapped
		yield put(voteAdded(_id, previousVote, token, vote, institution, true));
	}
}

function* saveHiddenContent() {
	const content = yield select((s: AppState) => s.hiddenContent);
	yield AsyncStorage.setItem('hiddenContent', content.filter(truthy).join(','));
}

function* setOverrides() {
	const overrides = yield select((s: AppState) => s.creditOverrides);
	yield AsyncStorage.setItem('creditOverrides', JSON.stringify(overrides));
}

function* setMensa() {
	const mensa = yield select((s: AppState) => s.food.mensa);
	yield AsyncStorage.setItem('mensaArea', mensa);
}

function* removeLoginCredit() {
	const newUzhLoginState = yield select((s: AppState) => s.multiSummary.UZH);
	yield CreditCache.store(UZH, newUzhLoginState);
}

function* didReadChat() {
	const newChatState = (yield select(
		(s: AppState) => s.chatServer.lastReadTimestamps
	)) as LastReadTimestampReducerType;
	yield persistLastReadTimestamps(newChatState);
}

function* preferredAppearanceSet() {
	const appearancePreference = (yield select(
		(s: AppState) => s.appearance.preference
	)) as AppearanceSetting;
	yield persistPreferredAppearance(appearancePreference);
}

function* setTypedAndUnsent() {
	const typedAndUnsent = (yield select(
		(s: AppState) => s.chatServer.chatTypedAndUnsent
	)) as {
		[key: string]: string;
	};
	yield persistTypedAndUnsentKey(typedAndUnsent);
}

function* changePricing() {
	const pricing = (yield select(
		(s: AppState) => s.food.pricing
	)) as PricingSetting;
	yield AsyncStorage.setItem('mensaPricing', pricing);
}

function* saveCustomCredits() {
	const customCredits = (yield select(
		(s: AppState) => s.customCredits.credits
	)) as CustomCredit[];
	yield persistCustomCredits(customCredits);
}

function* removeCourseFromServer(action: RemoveModule) {
	const hash = yield select((s: AppState) => getUserHash(s, null));
	const nonce = yield select((s: AppState) => s.sync.clientNonce);
	removeCourse(action.credit, hash, nonce);
}

export function* mySaga() {
	yield takeEvery(ADD_MODULES, saveModule);
	yield takeEvery(SET_MODULES, saveModule);
	yield takeEvery(REMOVE_MODULE, saveModule);
	yield takeEvery(REMOVE_MODULE, removeCourseFromServer);
	yield takeEvery(SET_COUNTS_MAP, saveCountsMap);
	yield takeEvery(SET_MODULE_AVG, saveCountsMap);
	yield takeEvery(SET_MODULE_COUNTS_TOWARDS_CREDIT, saveCountsCreditsMap);
	yield takeEvery(SET_COUNTS_CREDITS_MAP, saveCountsCreditsMap);
	yield takeEvery(SET_USERNAME, setUsername);
	yield takeEvery(SET_INSTITUTION, setInstitution);
	yield takeEvery(TURN_ON_FILTER, setFoodFilters);
	yield takeEvery(TURN_OFF_FILTER, setFoodFilters);
	yield takeEvery(VOTE_ADDED, addVote);
	yield takeEvery(HIDE_CONTENT, saveHiddenContent);
	yield takeEvery(RESET_HIDDEN, saveHiddenContent);
	yield takeEvery(SET_HIDDEN_CONTENT, saveHiddenContent);
	yield takeEvery(SET_ALLERGEN_FILTER, setAllergenFilter);
	yield takeEvery(SET_NUTRITION, setNutrition);
	yield takeEvery(SET_OVERRIDE, setOverrides);
	yield takeEvery(REMOVE_MODULE, setOverrides);
	yield takeEvery(CHANGE_MENSA, setMensa);
	yield takeEvery(SET_INSTITUTION, setMensa);
	yield takeEvery(CHANGE_PRICING, changePricing);
	yield takeEvery(REMOVE_LOGIN_CREDIT, removeLoginCredit);
	yield takeEvery(CustomCreditsTypes.ADD_CUSTOM_CREDITS, saveCustomCredits);
	yield takeEvery(CustomCreditsTypes.REMOVE_CUSTOM_CREDIT, saveCustomCredits);
	yield takeEvery(ChatServerActions.SET_TYPED_AND_UNSENT, setTypedAndUnsent);
	yield takeEvery(ChatServerActions.USER_READ_CHAT, didReadChat);
	yield takeEvery(
		AppearanceActions.SET_PREFERRED_APPEARANCE,
		preferredAppearanceSet
	);
	yield isomorphicSaga();
}
