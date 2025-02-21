import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {desktop, mobile} from '../../../core/components/layout/responsive';
import {humanWeekday} from '../../../core/functions/human-weekday';
import {getTwoLetterLabel} from '../../../core/functions/mensa-helpers';

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		padding-bottom: 0;
		margin-bottom: 0;
	`};
`;

const WeekdayWrapper = styled(NavLink)`
	flex: 1;
	text-align: center;
	font-weight: bold;
	padding-top: 10px;
	padding-bottom: 10px;
	font-family: Montserrat;
	color: rgba(0, 0, 0, 0.4);
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	${mobile`
		border-radius: 0;
	`};
`;

const MobileLabel = styled.div`
	${desktop`
		display: none;
	`};
`;

const DesktopLabel = styled.div`
	${mobile`
		display: none;
	`};
`;

const Weekday = ({day, dayNumber, mensa}) => {
	return (
		<WeekdayWrapper
			to={`/mensa/${mensa}/${day}`}
			activeStyle={{
				color: 'white',
			}}
		>
			<DesktopLabel>{humanWeekday(dayNumber, 'de')}</DesktopLabel>
			<MobileLabel>{getTwoLetterLabel(day, 'de')}</MobileLabel>
		</WeekdayWrapper>
	);
};

export const MensaDayPicker = (props) => {
	return (
		<Wrapper>
			<Weekday dayNumber={0} day="montag" {...props} />
			<Weekday dayNumber={1} day="dienstag" {...props} />
			<Weekday dayNumber={2} day="mittwoch" {...props} />
			<Weekday dayNumber={3} day="donnerstag" {...props} />
			<Weekday dayNumber={4} day="freitag" {...props} />
		</Wrapper>
	);
};
