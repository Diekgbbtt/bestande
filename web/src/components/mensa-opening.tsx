import lightFormat from 'date-fns/lightFormat';
import setDay from 'date-fns/setDay';
import React from 'react';
import styled from 'styled-components';
import {formatString} from '../../../core/functions/format-string';
import OpeningHours from '../../../core/functions/opening-hours';
import {RED} from '../../../core/models/colors';
import rawStrings from '../../../core/raw-strings';

const Container = styled.div`
	flex-direction: row;
	line-height: 1.2;
	display: flex;
	color: gray;
	font-size: 14px;
`;

const Label = styled.span``;

const Time = styled.div`
	width: 110px;
`;

const MensaOpening = ({mensa, closed}) => {
	if (!mensa.openingHours) {
		return null;
	}

	if (closed) {
		return (
			<Container>
				<Label style={{color: RED}}>{rawStrings.CLOSED.de}</Label>
			</Container>
		);
	}

	const timetable = new OpeningHours(
		mensa.openingHours,
		'de',
		setDay(new Date(), 5)
	).timetable();
	return (
		<div>
			{timetable.map((t) => (
				<Container key={t[0]}>
					<Time>
						{lightFormat(t[0], 'HH:mm')} - {lightFormat(t[1], 'HH:mm')}
					</Time>
					<div>
						{t[3]
							? formatString(rawStrings.ONLY_X.de, t[3])
							: rawStrings.FOOD_DISTRIBUTION.de}
					</div>
				</Container>
			))}
		</div>
	);
};

export default MensaOpening;
