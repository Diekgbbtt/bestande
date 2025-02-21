import React from 'react';
import {useTablet} from '../api/use-tablet';
import {CreditViewContent} from './CreditViewContent';
import {NoCreditSelectedView} from './NoCreditSelectedView';

export const RightPaneCreditView = () => {
	const tablet = useTablet();
	if (tablet) {
		return <NoCreditSelectedView />;
	}

	return <CreditViewContent />;
};
