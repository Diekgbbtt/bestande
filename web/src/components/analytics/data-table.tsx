import React from 'react';
import styled from 'styled-components';

const Row = styled.div<{
	last?: boolean;
}>`
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	${(props) =>
		props.last
			? `
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	`
			: ''} flex-direction: row;
	display: flex;
	font-size: 13px;
	padding-top: 2px;
	padding-bottom: 2px;
	justify-content: center;
	align-items: center;
`;

const ColorLabel = styled.div`
	height: 14px;
	width: 14px;
	display: inline-block;
	margin-right: 6px;
	border-radius: 50%;
`;

const Metric = styled.div`
	color: #333;
`;

const Value = styled.div`
	color: black;
`;

export const DataTable = (props: {
	limit?: number;
	data: {
		name: string;
		value: number | string;
	}[];
	colors?: string[];
	percentage?: boolean;
}) => {
	const data = props.limit ? props.data.slice(0, props.limit) : props.data;
	return (
		<div style={{width: '100%'}}>
			{data.map((d, i) => {
				return (
					<Row key={d.name} last={i === props.data.length - 1}>
						{props.colors ? (
							<ColorLabel style={{background: props.colors[i]}} />
						) : null}
						<Metric>{d.name}</Metric>
						<div style={{flex: 1}} />
						<Value>
							{props.percentage
								? (
									((d.value as number) /
											data.reduce((a, b) => a + (b.value as number), 0)) *
										100
								  ).toFixed(1) + '%'
								: d.value}
						</Value>
					</Row>
				);
			})}
		</div>
	);
};
