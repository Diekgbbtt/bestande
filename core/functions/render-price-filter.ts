const fixWithPrecision = (number: number, precision: number): string => {
	if (!precision && precision !== 0) {
		return String(number);
	}

	return number.toFixed(precision);
};

export const renderPriceFilter = ({
	priceRange,
	min,
	max,
	precision = 2,
}: {
	priceRange: [number, number];
	min: number;
	max: number;
	precision?: number;
}) => {
	if (priceRange[0] === priceRange[1]) {
		return fixWithPrecision(priceRange[0], precision);
	}

	if (priceRange[0] === min) {
		return `<${fixWithPrecision(priceRange[1], precision)}`;
	}

	if (priceRange[1] === max) {
		return `>${fixWithPrecision(priceRange[0], precision)}`;
	}

	return `${fixWithPrecision(priceRange[0], precision)}-${fixWithPrecision(
		priceRange[1],
		precision
	)}`;
};
