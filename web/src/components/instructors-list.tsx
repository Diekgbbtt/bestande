import sortBy from 'lodash/sortBy';
import React, {Component} from 'react';
import styled from 'styled-components';
import renderModuleType from '../../../core/functions/render-module-type';
import {InstructorsResponse} from '../../../core/reducers/api';
import {Wrapper} from './layout/entity-preview';
import PersonPreview from './person-preview';

const Toggler = styled(Wrapper)`
	text-align: center;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	font-size: 14px;
	padding-top: 3px;
	padding-bottom: 3px;
	color: gray;
`;

type State = {
	open?: boolean;
};

export class InstructorsList extends Component<{
	instructors: InstructorsResponse;
}> {
	state: State = {
		open: false,
	};

	render() {
		return (
			<div>
				{sortBy(this.props.instructors, (s) => !s.important)
					.filter((s) => s.instructor && (s.important || this.state.open))
					.map((p) => {
						return (
							<div key={p.instructor.uni_identifier}>
								<PersonPreview
									person={p.instructor}
									subtitle={p.type
										.map((t) => renderModuleType(t, 'de'))
										.join(', ')}
								/>
							</div>
						);
					})}
				{this.props.instructors.every((s) => s.important) ? null : (
					<Toggler
						onClick={() => {
							this.setState((prevState: State) => ({
								open: !prevState.open,
							}));
						}}
					>
						{this.state.open ? 'Weniger' : 'Weitere'}
						<i className="material-icons">
							{this.state.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
						</i>
					</Toggler>
				)}
			</div>
		);
	}
}
