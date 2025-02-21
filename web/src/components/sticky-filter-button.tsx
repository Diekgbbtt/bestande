import {darken} from 'polished';
import React from 'react';
import {onlyMobile} from '../../../core/components/layout/responsive';
import {ContainerWithFullWidthStyle} from '../../../core/components/width-container';

const OnlyMobile = onlyMobile('div');

export const StickyFilterButton = (props: {
	onClick: () => void;
	name: string;
}) => {
	return (
		<OnlyMobile>
			<ContainerWithFullWidthStyle
				wrapperStyle={{
					background: darken(0.02, '#ffffff'),
					borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
					fontSize: 13,
					textAlign: 'center',
					padding: 10,
					cursor: 'pointer',
				}}
			>
				<div
					style={{
						flexDirection: 'row',
						display: 'flex',
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						fontWeight: 'bold',
						padding: 4,
						color: 'rgba(0, 0, 0, 0.7)',
					}}
					onClick={() => {
						props.onClick();
					}}
				>
					<i className="material-icons" style={{marginRight: 4}}>
						filter_list
					</i>
					<div>{props.name}</div>
				</div>
			</ContainerWithFullWidthStyle>
		</OnlyMobile>
	);
};
