import React from 'react';
import {RelatedModules} from '../../../core/components/RelatedModules';
import {ApiResponse} from '../../../core/reducers/api';

export const ModuleRelated = (props: {module: ApiResponse}) => {
	return (
		<RelatedModules
			university={props.module.university}
			moduleId={props.module.uni_identifier}
			name={props.module.name}
			totalCount={props.module.userCount?.all as number}
		/>
	);
};
