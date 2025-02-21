import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {apiRequest} from '../../../core/functions/api-request';
import {receiveCoronaInfo} from '../../../core/reducers/corona';
import {CoronaInfo} from '../../../core/types/types';

export const CoronaFetcher = () => {
	const dispatch = useDispatch();
	const fetchCorona = useCallback(async () => {
		const data = await apiRequest<CoronaInfo>('/status/app/corona');
		dispatch(receiveCoronaInfo(data));
	}, [dispatch]);

	useEffect(() => {
		fetchCorona();
	});

	return null;
};
