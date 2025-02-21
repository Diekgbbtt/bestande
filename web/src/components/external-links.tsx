import React from 'react';
import {Icon, InnerWrapper, Wrapper} from './layout/entity-preview';

const ExternalLink = ({href, label}: {href: string; label: string}) => {
	return (
		<a href={href} target="_blank">
			<Wrapper>
				<InnerWrapper>
					<div>{label}</div>
					<div style={{flex: 1}} />
					<Icon className="material-icons">open_in_new</Icon>
				</InnerWrapper>
			</Wrapper>
		</a>
	);
};

export default ExternalLink;
