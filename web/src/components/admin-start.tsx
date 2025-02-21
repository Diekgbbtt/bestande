import {Heading, Message} from '@jonny/rebass';
import React from 'react';
import Padded from './layout/padded';

const AdminStart = (props) => {
	return (
		<Padded {...props}>
			<Heading level={1}>Administration</Heading>
			<br />
			<Message theme="warning">
				Nur du kannst diesen Administrationsbereich sehen. Einige Knöpfe sind
				eventuell gefährlich, es ist Vorsicht geboten.
			</Message>
		</Padded>
	);
};

export default AdminStart;
