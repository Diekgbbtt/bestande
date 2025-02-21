import {
	Arrow,
	ButtonOutline,
	Dropdown,
	DropdownMenu,
	NavItem,
} from '@jonny/rebass';
import isEqual from 'lodash/isEqual';
import React, {Component} from 'react';
import {Link, match} from 'react-router-dom';
import {periodToString} from '../../../core/functions/uzh-period';
import {moduleGetUrl} from '../../../core/models/module';
import {semesterFormatPeriod} from '../../../core/models/semester';
import {ApiResponse, SemesterResponse} from '../../../core/reducers/api';
import {constructUrl} from './module-tabs';

type Props = {
	white?: boolean;
	semesterResponse: SemesterResponse;
	module: ApiResponse;
	match: match<{
		content: string;
		semester: string;
	}>;
};

class SemesterDropdown extends Component<
	Props,
	{
		open: boolean;
	}
> {
	state = {
		open: false,
	};

	componentDidUpdate(prevProps: Props) {
		if (!isEqual(prevProps, this.props)) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({open: false});
		}
	}

	render() {
		const whiteStyle = {
			background: 'white',
			overflow: 'hidden',
			boxShadow: '0',
		};
		return (
			<div
				style={{
					whiteSpace: 'nowrap',
					alignContent: 'flex-end',
					flex: 1,
					display: 'flex',
				}}
			>
				<Dropdown style={{width: '100%'}}>
					<ButtonOutline
						onClick={() => this.setState({open: true})}
						style={{
							width: '100%',
							...(this.props.white ? whiteStyle : {}),
						}}
					>
						{semesterFormatPeriod(this.props.semesterResponse)}
						<Arrow />
					</ButtonOutline>
					<DropdownMenu
						open={this.state.open}
						onDismiss={() => this.setState({open: false})}
						style={{width: '100%'}}
					>
						{this.props.module.semesters.map((mod, i) => {
							return (
								<NavItem
									key={mod.period}
									is={Link}
									to={constructUrl(
										moduleGetUrl(this.props.module),
										i === 0 ? null : periodToString(mod.period),
										this.props.match.params.content
									)}
								>
									{periodToString(mod.period)}
								</NavItem>
							);
						})}
					</DropdownMenu>
				</Dropdown>
			</div>
		);
	}
}

export default SemesterDropdown;
