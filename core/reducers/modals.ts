import {ModalsState} from '../types/modals';

const initialState: ModalsState = {
	mensaCategoriesModal: false,
	mensaPriceModal: false,
	mensaDietModal: false,
	mensaAllergensModal: false,
};

enum ModalsActions {
	OPEN_MENSA_CATEGORIES = 'OPEN_MENSA_CATEGORIES',
	CLOSE_MENSA_CATEGORIES = 'CLOSE_MENSA_CATEGORIES',
	OPEN_MENSA_PRICE = 'OPEN_MENSA_PRICE',
	CLOSE_MENSA_PRICE = 'CLOSE_MENSA_PRICE',
	OPEN_MENSA_DIET = 'OPEN_MENSA_DIET',
	CLOSE_MENSA_DIET = 'CLOSE_MENSA_DIET',
	OPEN_MENSA_ALLERGENS = 'OPEN_MENSA_ALLERGENS',
	CLOSE_MENSA_ALLERGENS = 'CLOSE_MENSA_ALLERGENS',
}

type OpenMensaCategoriesModal = {
	type: ModalsActions.OPEN_MENSA_CATEGORIES;
};

export const openMensaCategories = (): OpenMensaCategoriesModal => {
	return {
		type: ModalsActions.OPEN_MENSA_CATEGORIES,
	};
};

type CloseMensaCategoriesModal = {
	type: ModalsActions.CLOSE_MENSA_CATEGORIES;
};

export const closeMensaCategories = (): CloseMensaCategoriesModal => {
	return {
		type: ModalsActions.CLOSE_MENSA_CATEGORIES,
	};
};

type OpenMensaPrice = {
	type: ModalsActions.OPEN_MENSA_PRICE;
};

export const openMensaPriceModal = (): OpenMensaPrice => {
	return {
		type: ModalsActions.OPEN_MENSA_PRICE,
	};
};

type CloseMensaPrice = {
	type: ModalsActions.CLOSE_MENSA_PRICE;
};

export const closeMensaPriceModal = (): CloseMensaPrice => {
	return {
		type: ModalsActions.CLOSE_MENSA_PRICE,
	};
};

type OpenMensaDiet = {
	type: ModalsActions.OPEN_MENSA_DIET;
};

export const openMensaDiet = (): OpenMensaDiet => {
	return {
		type: ModalsActions.OPEN_MENSA_DIET,
	};
};

type CloseMensaDiet = {
	type: ModalsActions.CLOSE_MENSA_DIET;
};

export const closeMensaDiet = (): CloseMensaDiet => {
	return {
		type: ModalsActions.CLOSE_MENSA_DIET,
	};
};

type OpenMensaAllergens = {
	type: ModalsActions.OPEN_MENSA_ALLERGENS;
};

export const openMensaAllergens = (): OpenMensaAllergens => {
	return {
		type: ModalsActions.OPEN_MENSA_ALLERGENS,
	};
};

type CloseMensaAllergens = {
	type: ModalsActions.CLOSE_MENSA_ALLERGENS;
};

export const closeMensaAllergens = (): CloseMensaAllergens => {
	return {
		type: ModalsActions.CLOSE_MENSA_ALLERGENS,
	};
};

export const modals = (
	state = initialState,
	action:
		| OpenMensaPrice
		| CloseMensaPrice
		| OpenMensaCategoriesModal
		| CloseMensaCategoriesModal
		| OpenMensaDiet
		| CloseMensaDiet
		| OpenMensaAllergens
		| CloseMensaAllergens
): ModalsState => {
	if (action.type === ModalsActions.OPEN_MENSA_CATEGORIES) {
		return {
			...state,
			mensaCategoriesModal: true,
		};
	}

	if (action.type === ModalsActions.CLOSE_MENSA_CATEGORIES) {
		return {
			...state,
			mensaCategoriesModal: false,
		};
	}

	if (action.type === ModalsActions.OPEN_MENSA_PRICE) {
		return {
			...state,
			mensaPriceModal: true,
		};
	}

	if (action.type === ModalsActions.CLOSE_MENSA_PRICE) {
		return {
			...state,
			mensaPriceModal: false,
		};
	}

	if (action.type === ModalsActions.OPEN_MENSA_DIET) {
		return {
			...state,
			mensaDietModal: true,
		};
	}

	if (action.type === ModalsActions.CLOSE_MENSA_DIET) {
		return {
			...state,
			mensaDietModal: false,
		};
	}

	if (action.type === ModalsActions.OPEN_MENSA_ALLERGENS) {
		return {
			...state,
			mensaAllergensModal: true,
		};
	}

	if (action.type === ModalsActions.CLOSE_MENSA_ALLERGENS) {
		return {
			...state,
			mensaAllergensModal: false,
		};
	}

	return state;
};
