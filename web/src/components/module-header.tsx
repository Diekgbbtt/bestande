import {Heading, Space} from '@jonny/rebass';
import React from 'react';
import {match as Match} from 'react-router';
import {
	ButtonContainer,
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import Module, {CourseCode} from '../../../core/models/module';
import {ApiResponse, SemesterResponse} from '../../../core/reducers/api';
import SemesterDropdown from './semester-dropdown';
import { getGermanName } from './search-result';
import styled from 'styled-components';
import { mobile } from '../../../core/components/layout/responsive';

export type ModuleHeaderOwnProps = {
	isWhite?: boolean;
	module: ApiResponse;
	semesterResponse: SemesterResponse;
	match: Match<{
		semester: string;
		content: string;
	}>;
};

export const ModuleHeaderDiv = styled.div`
	display: flex;
	${mobile`flex-direction: column`};
`;

const renderCode = (courseCode: CourseCode | null) => {
	if (!courseCode || !courseCode.display) {
		return null;
	}

	return <span>{courseCode.series}-Serie</span>;
};

export const ModuleHeader = (props: ModuleHeaderOwnProps) => {
	const whiteStyle = {
		color: 'white',
		textShadow: '1px 1px rgba(0, 0, 0, 0.4)',
	};
	const course = renderCode(props.module.courseCode);
	return (
		<ModuleHeaderDiv>
			
				{/* <div
					style={{
						...(props.isWhite ? whiteStyle : {}),
						fontSize: 14,
						fontWeight: 'bold',
					}}
				>
					{rawStrings[props.module.university].de}
					{props.module.departments
						? ' - ' + props.module.departments.join(', ')
						: null}
					{course ? ' - ' : null}
					{course ?? null}
				</div> */}
				<Heading style={props.isWhite ? whiteStyle : null}>
					{getGermanName(props.module as Module)}
				</Heading>
			
			
		</ModuleHeaderDiv>
	);
};
