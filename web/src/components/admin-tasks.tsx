import {Heading, Message} from '@jonny/rebass';
import React from 'react';
import styled from 'styled-components';
import {apiRequest} from '../../../core/functions/api-request';
import Padded, {EscapePadded} from './layout/padded';

const TaskContainer = styled(EscapePadded)`
	padding: 10px;
	cursor: pointer;
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
`;

const executeTask = (identifier: string) => {
	apiRequest(`/tasks/${identifier}`, {
		method: 'POST',
	})
		.then(() => {
			return alert('Task wird ausgeführt.'); // eslint-disable-line no-alert
		})
		.catch((err) => {
			alert(`Could not execute task: ${err.message}`); // eslint-disable-line no-alert
		});
};

const Task = (props: {identifier: string; description: string}) => {
	return (
		<TaskContainer onClick={() => executeTask(props.identifier)}>
			<Heading level={3}>{props.identifier}</Heading>
			<div>{props.description}</div>
		</TaskContainer>
	);
};

const AdminTasks = (props) => {
	return (
		<Padded {...props}>
			<Heading level={1}>Tasks</Heading>
			<br />
			<Message>
				Hiermit kannst du einige Tasks ausführen, welche die Datenbank verändern
				werden. Viele dieser Tasks sind sehr ressourcen- und netzwerkintensiv
				und dauern mehrere Stunden. Sei deshalb vorsichtig und lass nicht
				zuviele Tasks gleichzeitig laufen.
			</Message>
			<br />
			<br />
			<Task
				identifier="CREATE_USER_COUNT_TASK"
				description="Zählt alle Nutzer neu."
			/>
			<Task
				identifier="CREATE_TIMETABLE_TASKS"
				description="Indiziert alle Veranstaltungen, Personen, Räume von UZH neu."
			/>
			<Task
				identifier="CREATE_UPDATE_ROOMS_TASK"
				description="Updated alle Räume und fügt Addresse hinzu."
			/>
			<Task
				identifier="CREATE_UPDATE_UZH_TASKS"
				description="Indiziert alle UZH-Module neu."
			/>
			<Task
				identifier="CREATE_UPDATE_ETH_TASKS"
				description="Indiziert alle ETH-Module neu."
			/>
			<Task
				identifier="CREATE_UPDATE_PROMOTION_IMPRESSIONS_TASKS"
				description="Zählt die Impressionen der Werbungen neu"
			/>
			<Task
				identifier="CREATE_RELATED_MODULES_TASK"
				description="Berechnet die ähnlichen Fächer neu"
			/>
			<Task
				identifier="CREATE_UPDATE_DEPARTMENTS_ETH_TASKS"
				description="Ordnet die ETH-Departmente Fächern hinzu"
			/>
		</Padded>
	);
};

export default AdminTasks;
