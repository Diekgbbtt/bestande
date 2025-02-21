export const getPeriodForDate = (date: Date): number => {
	const rawYear = date.getUTCFullYear();
	const month = date.getMonth() + 1;
	const periodId =
		month === 8 ||
		month === 9 ||
		month === 10 ||
		month === 11 ||
		month === 12 ||
		month === 1
			? 2
			: 1;
	const periodYear = month === 1 ? rawYear - 1 : rawYear;
	return periodYear * 10 + periodId;
};
