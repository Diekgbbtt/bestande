import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {desktop, mobile} from '../../../core/components/layout/responsive';
import {truthy} from '../../../core/functions/truthy';
import {BLUE} from '../../../core/models/colors';
import {moduleGetUrl} from '../../../core/models/module';
import {semesterRegex} from '../helpers/semester-regex';

const Tabs = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		display: block;
		white-space: nowrap;
		overflow: scroll;
		max-width: calc(100vw);
		margin-left: -20px;
		margin-right: -20px;
	`};
	&::-webkit-scrollbar {
		display: none;
	}
`;

const activeStyle = {
	color: BLUE,
	borderBottomColor: BLUE,
};

const Tab = styled(NavLink).attrs({
	activeStyle,
})`
	${desktop`	
		flex: 1;
	`} border-bottom-width: 3px;
	border-bottom-color: transparent;
	border-bottom-style: solid;
	text-align: center;
	text-transform: uppercase;
	padding: 13px 0px;
	${mobile`
		padding: 13px 15px;
	`} font-size: 13px;
	${mobile`
		font-size: 11px;
	`} font-weight: bold;
	color: inherit;
	display: inline-block;
`;

export const constructUrl = (
	base: string,
	semester: string | null,
	content?: string
) => {
	return [base, semester, content].filter(truthy).join('/');
};

const ModuleTabs = ({module, match}) => {
	return (
		<Tabs>
			<Tab
				to={constructUrl(moduleGetUrl(module), match.params.semester)}
				isActive={(_, location) => {
					return Boolean(
						new RegExp(
							`${moduleGetUrl(module)}/?${semesterRegex}$`
						).exec(location.pathname)
					);
				}}
			>
				Infos
			</Tab>
			{/*<Tab*/}
			{/*	to={constructUrl(moduleGetUrl(module), match.params.semester, 'stats')}*/}
			{/*	isActive={(_, location) => {*/}
			{/*		return Boolean(*/}
			{/*			new RegExp(`${moduleGetUrl(module)}/?${semesterRegex}/stats`).exec(*/}
			{/*				location.pathname*/}
			{/*			)*/}
			{/*		);*/}
			{/*	}}*/}
			{/*>*/}
			{/*	Statistiken*/}
			{/*</Tab>*/}
			<Tab
				to={constructUrl(
					moduleGetUrl(module),
					match.params.semester,
					'ratings'
				)}
				isActive={(_, location) => {
					return Boolean(
						new RegExp(
							`${moduleGetUrl(module)}/?${semesterRegex}/ratings`
						).exec(location.pathname)
					);
				}}
			>
				Bewertungen
			</Tab>
			{/*<Tab*/}
			{/*	to={constructUrl(*/}
			{/*		moduleGetUrl(module),*/}
			{/*		match.params.semester,*/}
			{/*		'related'*/}
			{/*	)}*/}
			{/*	isActive={(_, location) => {*/}
			{/*		return Boolean(*/}
			{/*			new RegExp(*/}
			{/*				`${moduleGetUrl(module)}/?${semesterRegex}/related`*/}
			{/*			).exec(location.pathname)*/}
			{/*		);*/}
			{/*	}}*/}
			{/*>*/}
			{/*	Ähnlich*/}
			{/*</Tab>*/}
			<Tab
				to={constructUrl(
					moduleGetUrl(module),
					match.params.semester,
					'documents'
				)}
				isActive={(_, location) => {
					return Boolean(
						new RegExp(
							`${moduleGetUrl(module)}/?${semesterRegex}/documents`
						).exec(location.pathname)
					);
				}}
			>
				Dateien
			</Tab>
		</Tabs>
	);
};

export default ModuleTabs;

