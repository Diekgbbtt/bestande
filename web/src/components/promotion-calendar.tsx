import Tooltip from '@jonny/tooltip';
import addMonths from 'date-fns/addMonths';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import getISODay from 'date-fns/getISODay';
import getWeek from 'date-fns/getWeek';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import deLocale from 'date-fns/locale/de';
import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	padding-top: 10px;
	${mobile`
	display: block;
	`}
`;

const MonthContainer = styled.div`
	flex: 1;
	padding-top: 10px;
	padding-bottom: 8px;
`;

const MonthTitle = styled.div`
	font-weight: bold;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.7);
	padding-left: 8px;
	text-align: center;
	margin-top: 8px;
	padding-bottom: 4px;
`;

const WeekDay = styled.div`
	font-size: 15px;
	cursor: default;
`;

const Week = styled.div`
	&:hover {
		background-color: rgba(0, 0, 0, 0.02);
	}
`;

const WeekDayHeader = styled.div<{last?: boolean}>`
	flex: 1;
	border-bottom: 1px solid rgba(0, 0, 0, 0);
	text-align: center;
	font-size: 13px;
	color: rgba(0, 0, 0, 0.6);
	cursor: default;
`;

const Month = (props: {month: Date; schedules: number[][]}) => {
	const now = new Date();
	const weeks = getWeeksInMonth(props.month, {
		weekStartsOn: 1,
		locale: deLocale,
	});
	const isDateFilled = (d: Date) =>
		props.schedules.find(
			([scheduleStart, end]) => d.getTime() > scheduleStart && d.getTime() < end
		);
	const start = startOfMonth(props.month);
	const daysInMonth = getDaysInMonth(props.month);
	const startDay = getISODay(start);
	const calendar = new Array(weeks)
		.fill(true)
		.map((_, i) => {
			return new Array(7).fill(true).map((__, j) => j + 7 * i - startDay + 2);
		})
		.filter((w) => w.some((d) => d > 0));
	return (
		<MonthContainer>
			<MonthTitle>{format(props.month, 'LLLL', {locale: deLocale})}</MonthTitle>
			<div style={{}}>
				<div style={{flexDirection: 'row', display: 'flex'}}>
					<WeekDayHeader>Mo</WeekDayHeader>
					<WeekDayHeader>Di</WeekDayHeader>
					<WeekDayHeader>Mi</WeekDayHeader>
					<WeekDayHeader>Do</WeekDayHeader>
					<WeekDayHeader>Fr</WeekDayHeader>
					<WeekDayHeader>Sa</WeekDayHeader>
					<WeekDayHeader last>So</WeekDayHeader>
				</div>
				{calendar.map((week, index) => {
					const currentWeek = getWeek(now, {weekStartsOn: 1});
					const aDateInThisWeek = setDate(props.month, index * 7 + 1);
					const calendarWeek = getWeek(aDateInThisWeek, {
						weekStartsOn: 1,
					});
					const filled = week.filter((e) =>
						isDateFilled(setDate(props.month, e))
					);
					const isCurrentWeek = currentWeek === calendarWeek;
					const hasPassed =
						currentWeek > calendarWeek &&
						endOfWeek(aDateInThisWeek, {weekStartsOn: 1}).getFullYear() ===
							props.month.getFullYear() &&
						props.month.getFullYear() <= new Date().getFullYear();
					const isFullyFilled = filled.length === week.length;
					const isFullyAvailable = filled.length === 0;
					const weekStart = startOfWeek(aDateInThisWeek, {weekStartsOn: 1});
					const weekEnd = endOfWeek(aDateInThisWeek, {weekStartsOn: 1});
					return (
						<Tooltip
							key={week.join(',')}
							tip={
								<div>
									<div>
										{hasPassed
											? 'Bereits vorbei'
											: isCurrentWeek
											? 'Bereits angefangen'
											: isFullyAvailable
											? 'Verfügbar'
											: isFullyFilled
											? 'Besetzt'
											: 'Teilweise verfügbar'}
									</div>
									<div
										style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.7)'}}
									>
										{`Kalenderwoche ${calendarWeek} von ${format(
											weekStart,
											'dd.MM'
										)}. bis ${format(weekEnd, 'dd.MM')}.`}
									</div>
								</div>
							}
							preferredPlacement="top"
						>
							<Week
								style={{
									display: 'flex',
									flexDirection: 'row',
									borderBottom: `${Number(
										index !== calendar.length - 1
									)}px solid rgba(0, 0, 0, 0.00)`,
								}}
							>
								{week.map((w, idx) => {
									const date = setDate(props.month, w);
									const today = isToday(date);
									const isFilled = Boolean(isDateFilled(date));
									return (
										<WeekDay
											key={w}
											style={{
												flex: 1,
												textAlign: 'center',
												paddingTop: 6,
												paddingBottom: 6,
												borderRight: `${Number(
													idx !== week.length - 1
												)}px solid rgba(0, 0, 0, 0.00)`,
												boxShadow: today
													? '0 0 3px rgba(0, 0, 0, 0.16)'
													: undefined,
												fontWeight: today ? 'bold' : 'normal',
												color: today
													? 'black'
													: isAfter(date, now)
													? isFilled
														? w > 0 && w <= daysInMonth
															? 'rgba(40, 0, 0, 0.85)'
															: 'rgba(40, 0, 0, 0.1)'
														: w > 0 && w <= daysInMonth
														? 'rgba(0, 40, 0, 0.85)'
														: 'rgba(0, 40, 0, 0.1)'
													: 'rgba(0, 0, 0, 0.3)',
												background: today
													? 'white'
													: isBefore(date, Date.now())
													? 'rgba(0, 0, 0, 0.03)'
													: isFilled
													? 'rgba(200, 0, 0, 0.1)'
													: 'rgba(0, 200, 0, 0.1)',
											}}
										>
											{date.getDate()}
										</WeekDay>
									);
								})}
							</Week>
						</Tooltip>
					);
				})}
			</div>
			<div style={{height: 10}} />
		</MonthContainer>
	);
};

export const PromotionCalendar = () => {
	const currentDate = new Date();
	const months = [0, 1, 2, 3];
	const [schedules, setSchedules] = React.useState<number[][]>([]);
	React.useEffect(() => {
		fetch('/api/promotions/availabilities')
			.then((response) => response.json())
			.then((response) => {
				setSchedules(response.data.schedules);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<Container>
			{months.map((m) => {
				return (
					<React.Fragment key={m}>
						<Month month={addMonths(currentDate, m)} schedules={schedules} />
						{m === months.length - 1 ? null : (
							<div style={{width: 20, height: 20}} />
						)}
					</React.Fragment>
				);
			})}
		</Container>
	);
};
