import React from 'react';
import styled from 'styled-components';
import {getImageUrl} from '../../../../core/functions/get-image-url';
import {truthy} from '../../../../core/functions/truthy';
import {PROMOTION} from '../../../../core/models/impression-type';
import {AnalyticsResponse} from '../../api/promotions/analytics';
import {DataTable} from './data-table';

const Container = styled.div`
	margin-bottom: 20px;
`;

const Campaign = (props: {response: AnalyticsResponse}) => {
	return (
		<Container>
			{props.response.promotion.image ? (
				<img
					src={getImageUrl({
						...props.response.promotion.image,
						height: 150,
						width: 450,
						crop: null,
					})}
					style={{
						width: '100%',
					}}
				/>
			) : null}
			<DataTable
				data={[
					{
						name: 'Titel',
						value: props.response.promotion.name,
					},
					{
						name: 'Typ',
						value:
							props.response.promotion.type === PROMOTION ? 'Banner' : 'Event',
					},
				].filter(truthy)}
			/>
		</Container>
	);
};

export default Campaign;
