import React from 'react';
import {ViewProperties} from 'react-native';

export const WebModal = (
	props: ViewProperties & {
		webTitle: React.ReactNode;
		children: React.ReactNode;
		onClosed: () => void;
	}
) => {
	throw new Error('not meant ot be called in native' + props.webTitle);
};
