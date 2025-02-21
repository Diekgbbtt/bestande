import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {
	addPromotion,
	fetchPromotion,
	getPromotions,
	promotionRemoved,
	promotionUpdated,
	removePromotion,
	savePromotion,
} from '../../../core/actions/promotions';
import {PromotionResponse} from '../../../core/models/promotion';
import {App} from '../../../core/reducers';
import {defaultPromotionState} from '../../../core/reducers/promotions';
import {invalidEvent, validEvent} from '../../../core/test/demos/_promotion';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach(afterEach);

test.beforeEach(async (t) => {
	const store = createStore(App, applyMiddleware(thunk));
	t.context.store = store;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await t.context.store.dispatch(addPromotion(validEvent));
});

test('Should be able to add an event', (t) => {
	const {store} = t.context;
	const state = store.getState();
	const keys = Object.keys(state.promotions.promotions);
	t.deepEqual(
		{...state.promotions.promotions[keys[0]], data: validEvent},
		{...defaultPromotionState, data: validEvent, loading: false}
	);
});

test('Should be able to add two events', async (t) => {
	const {store} = t.context;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(addPromotion(validEvent));
	const state = store.getState();
	const keys = Object.keys(state.promotions.promotions);
	t.is(keys.length, 2);
});

test('Should be able to save an event', async (t) => {
	const {store} = t.context;
	const state = store.getState();
	const keys = Object.keys(state.promotions.promotions);
	const promotion = state.promotions.promotions[keys[0]].data;
	if (promotion) {
		promotion.name = 'Another name';
	}

	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(savePromotion(promotion));
	const {promotions} = store.getState();
	const newKeys = Object.keys(promotions.promotions);
	t.is(newKeys.length, 1);
	t.is(promotions.promotions[newKeys[0]].data?.name, 'Another name');
	t.false(promotions.promotions[newKeys[0]].saving);
});

test('Should not be able to update a promotion if it becomes invalid', async (t) => {
	const {store} = t.context;
	const state = store.getState();
	const keys = Object.keys(state.promotions.promotions);
	const promotion = state.promotions.promotions[keys[0]].data;
	if (promotion) {
		promotion.name = 'New name applied';
	}

	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(savePromotion(promotion));
	t.is(
		store.getState().promotions.promotions[keys[0]].data?.name,
		'New name applied'
	);

	if (promotion) {
		promotion.name = 'New name not applied';
		promotion.start_date = Date.now();
		promotion.end_date = Date.now() - 10000;
	}

	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(savePromotion(promotion));
	const {promotions} = store.getState();
	t.is(promotions.promotions[keys[0]].data?.name, 'New name applied');
});

test('Should be able to get events', async (t) => {
	const {store} = t.context;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await t.context.store.dispatch(addPromotion(validEvent));
	const {promotions} = store.getState();
	t.is(Object.keys(promotions.promotions).length, 2);

	// Remove an event but don't commit on server
	store.dispatch(promotionRemoved(Object.keys(promotions.promotions)[0]));

	// State should now have less promotions
	t.is(Object.keys(store.getState().promotions.promotions).length, 1);

	// Now fetch events, then should have two promotions again
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(getPromotions({}));
	t.is(Object.keys(store.getState().promotions.promotions).length, 2);
	t.is(store.getState().promotions.loading, false);
});

test('Should be able to get single event', async (t) => {
	const {store} = t.context;

	const {promotions} = store.getState();
	const keys = Object.keys(promotions.promotions);
	store.dispatch(
		promotionUpdated({
			...(promotions.promotions[keys[0]].data as PromotionResponse),
			name: 'another name',
		})
	);
	t.is(
		store.getState().promotions.promotions[keys[0]].data?.name,
		'another name'
	);
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(fetchPromotion(keys[0]));
	t.is(
		store.getState().promotions.promotions[keys[0]].data?.name,
		validEvent.name
	);
});

test('Should be able to delete an event', async (t) => {
	const {store} = t.context;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(addPromotion(validEvent));
	const {promotions} = store.getState();
	const keys = Object.keys(promotions.promotions);

	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(removePromotion(promotions.promotions[keys[0]].data));
	t.is(Object.keys(store.getState().promotions.promotions).length, 1);
});

test('Should not be able to add an invalid event', async (t) => {
	const {store} = t.context;
	const {promotions} = store.getState();
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(addPromotion(invalidEvent));
	t.is(Object.keys(promotions.promotions).length, 1);
});

test('Should show an 300 for a invalid ID', async (t) => {
	const {store} = t.context;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(fetchPromotion('abc'));
	t.is(store.getState().promotions.promotions.abc.error?.statusCode, 400);
});

test('Should show an 404 for a random ObjectID', async (t) => {
	const {store} = t.context;
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(fetchPromotion('54495ad94c934721ede76d90'));
	t.is(
		store.getState().promotions.promotions['54495ad94c934721ede76d90'].error
			?.statusCode,
		404
	);
});

test('Should not be able to overwrite creator', async (t) => {
	const {store} = t.context;
	const state = store.getState();
	const keys = Object.keys(state.promotions.promotions);
	const promotion = state.promotions.promotions[keys[0]].data;
	const oldCreator = promotion?.creator;
	if (promotion) {
		promotion.creator = 'New name applied';
	}

	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/await-thenable
	await store.dispatch(savePromotion(promotion));
	t.is(
		store.getState().promotions.promotions[keys[0]].data?.creator,
		oldCreator
	);
});
