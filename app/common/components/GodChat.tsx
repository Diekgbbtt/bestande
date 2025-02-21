import React from 'react';
import {Chat} from './Chat';

export const GodChat = () => {
	const goToTab = React.useCallback(() => {
		const newLocal = 'not implemented in god chat';
		// eslint-disable-next-line no-alert
		alert(newLocal);
	}, []);
	return (
		<Chat
			goToTab={goToTab}
			uni_identifier="all"
			university="UZH"
			credit={null}
		/>
	);
};
