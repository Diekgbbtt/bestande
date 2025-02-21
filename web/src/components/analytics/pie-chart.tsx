import sortBy from 'lodash/sortBy';
import React from 'react';
import {Cell, Pie, PieChart as PieChartNative, Tooltip} from 'recharts';
import styled from 'styled-components';
import {mobile} from '../../../../core/components/layout/responsive';
import {GREEN} from '../../../../core/models/colors';
import {colorPalette} from '../../helpers/color-palette';
import {DataTable} from './data-table';

const Row = styled.div`
	display: flex;
	flex-direction: row;
	padding-top: 20px;
	padding-bottom: 20px;
	justify-content: center;
	align-items: center;
	${mobile`
		display: block;
	`};
`;

const RowPanel = styled.div<{
	center?: boolean;
}>`
	flex: 1;
	${mobile`	
		display: flex;
		justify-content: center;
		width: 100%;
		`};
	${(props) =>
		props.center
			? `
		
		display: flex;
		justify-content: center;
		width: 100%;
	`
			: null};
`;

const Spacer = styled.div`
	width: 20px;
	height: 20px;
`;

export const PieChart = ({
	data,
	noDataTable,
	noSort,
	center,
	colors = colorPalette(GREEN, data.length),
}: {
	data: {value: number; name: string}[];
	noDataTable?: boolean;
	noSort?: boolean;
	center?: boolean;
	colors?: string[];
}) => {
	const sorted = noSort ? data : sortBy(data, (f) => 0 - f.value);
	return (
		<Row>
			<RowPanel center={center}>
				<PieChartNative width={260} height={130}>
					<Pie
						dataKey="value"
						data={sorted}
						cx={120}
						cy={120}
						innerRadius={0}
						outerRadius={120}
						startAngle={180}
						endAngle={0}
						labelLine={false}
					>
						{sorted.map((entry, index) => (
							<Cell key={entry.name} fill={colors[index]} />
						))}
					</Pie>
					<Tooltip />
				</PieChartNative>
			</RowPanel>
			<Spacer />
			{noDataTable ? null : (
				<RowPanel>
					<DataTable data={sorted} colors={colors} percentage />
				</RowPanel>
			)}
		</Row>
	);
};
