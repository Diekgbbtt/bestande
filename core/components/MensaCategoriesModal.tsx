import React from 'react';
import {useDispatch} from 'react-redux';
import {ModalCancelButton} from '../components/ModalCancelButton';
import {WebModal} from '../components/webmodal/WebModal';
import {WebModalTitle} from '../components/WebModalTitle';
import {useAppState, useIsomorphicState} from '../functions/use-app-state';
import rawStrings from '../raw-strings';
import {closeMensaCategories} from '../reducers/modals';
import {CategoriesFilter} from './MensaCategoriesFilter';

export const MensaCategoriesModal = () => {
	const visible = useAppState((state) => state.modals.mensaCategoriesModal);
	const dispatch = useDispatch();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);

	if (!visible) {
		return null;
	}

	return (
		<WebModal
			onClosed={() => {
				dispatch(closeMensaCategories());
			}}
			webTitle={
				<WebModalTitle>{rawStrings.CATEGORY_FILTER[language]}</WebModalTitle>
			}
		>
			<CategoriesFilter />
			<ModalCancelButton
				label={rawStrings.DONE[language]}
				onPress={() => {
					dispatch(closeMensaCategories());
				}}
			/>
		</WebModal>
	);
};
