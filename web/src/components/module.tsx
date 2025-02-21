import React, {Component} from 'react';
import {match as Match} from 'react-router';
import {Institution} from '../../../core/models/credit';
import {SemesterResponse} from '../../../core/reducers/api';
import {ModuleContent} from './module-content';
import {ModuleRequired} from './modulerequired';

export class Module extends Component<{
	match: Match;
	institution: Institution;
	semester: SemesterResponse;
	id: string;
	className: string;
}> {
	render() {
		return (
			// @ts-expect-error
			<ModuleRequired {...this.props.match.params} {...this.props}>
				{/**
				// @ts-expect-error */}
				<ModuleContent />
			</ModuleRequired>
		);
	}
}
