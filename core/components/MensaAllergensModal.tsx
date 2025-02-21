import React from 'react';
import {useDispatch} from 'react-redux';
import {ModalCancelButton} from '../components/ModalCancelButton';
import {WebModal} from '../components/webmodal/WebModal';
import {WebModalTitle} from '../components/WebModalTitle';
import {useAppState} from '../functions/use-app-state';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {closeMensaAllergens} from '../reducers/modals';
import {MensaAllergensFilter} from './MensaAllergensFilter';

export const MensaAllergensModal = () => {
	const dispatch = useDispatch();
	const visible = useAppState((state) => state.modals.mensaAllergensModal);
	const language = useLanguage();

	if (!visible) {
		return null;
	}

	return (
		<WebModal
			onClosed={() => {
				dispatch(closeMensaAllergens());
			}}
			webTitle={<WebModalTitle>{rawStrings.ALLERGENS[language]}</WebModalTitle>}
		>
			<MensaAllergensFilter />
			<ModalCancelButton
				label={rawStrings.DONE[language]}
				onPress={() => {
					dispatch(closeMensaAllergens());
				}}
			/>
		</WebModal>
	);
};
