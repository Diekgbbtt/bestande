import React from 'react';
import {useDispatch} from 'react-redux';
import {MensaDietFilter} from '../components/MensaDietFilter';
import {ModalCancelButton} from '../components/ModalCancelButton';
import {WebModal} from '../components/webmodal/WebModal';
import {WebModalTitle} from '../components/WebModalTitle';
import {useIsomorphicState} from '../functions/use-app-state';
import rawStrings from '../raw-strings';
import {closeMensaDiet} from '../reducers/modals';

export const MensaDietModal = () => {
	const dispatch = useDispatch();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);

	const visible = useIsomorphicState((state) => state.modals.mensaDietModal);

	if (!visible) {
		return null;
	}

	return (
		<WebModal
			onClosed={() => {
				dispatch(closeMensaDiet());
			}}
			webTitle={<WebModalTitle>{rawStrings.DIET[language]}</WebModalTitle>}
		>
			<MensaDietFilter />
			<ModalCancelButton
				label={rawStrings.DONE[language]}
				onPress={() => {
					dispatch(closeMensaDiet());
				}}
			/>
		</WebModal>
	);
};
