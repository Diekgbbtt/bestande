import React from 'react';
import {useDispatch} from 'react-redux';
import {useAppState, useIsomorphicState} from '../functions/use-app-state';
import rawStrings from '../raw-strings';
import {closeMensaPriceModal} from '../reducers/modals';
import {MensaPricesFilter} from './MensaPricesFilter';
import {ModalCancelButton} from './ModalCancelButton';
import {WebModal} from './webmodal/WebModal';
import {WebModalTitle} from './WebModalTitle';

export const MensaPriceModal = () => {
	const visible = useAppState((state) => state.modals.mensaPriceModal);
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
				dispatch(closeMensaPriceModal());
			}}
			webTitle={
				<WebModalTitle>{rawStrings.PRICE_FILTER[language]}</WebModalTitle>
			}
		>
			<MensaPricesFilter
				onDismiss={() => {
					dispatch(closeMensaPriceModal());
				}}
			/>
			<ModalCancelButton
				label={rawStrings.DONE[language]}
				onPress={() => {
					dispatch(closeMensaPriceModal());
				}}
			/>
		</WebModal>
	);
};
