import React from 'react';
import {useWebState} from '../../../core/functions/use-app-state';
import {isUserAdmin} from '../helpers/is-user-admin';
import {ErrorCode} from './errorcode';

export const AdminNeeded = (props: {children: any}) => {
	const isAdmin = useWebState((s) => isUserAdmin(s.login));
	if (!isAdmin) {
		return (
			<ErrorCode
				error={{
					name: 'Error',
					statusCode: 403,
					message:
						'Du hast nicht die erforderliche Berechtigung für diese Seite.',
				}}
			/>
		);
	}

	return props.children;
};
