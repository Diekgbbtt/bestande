import {
	Arrow,
	ButtonOutline,
	Dropdown,
	DropdownMenu,
	NavItem,
} from '@jonny/rebass';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';
import {WebLoginState} from '../../../core/reducers/web-login';
import {WebState} from '../../../core/types/web-state';

const Wrapper = styled.div`
	align-self: flex-end;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	display: flex;
	margin-left: 20px;
	${mobile`
		.Arrow {
			margin-left: 0 !important;
		}
	`};
`;

const Name = styled.div`
	font-weight: bold;
	display: inline-block;
	height: 100%;
	${mobile`display: none`};
`;

const mapStateToProps = (state: WebState) => {
	return {
		login: state.login,
	};
};

const mapDispatchToProps = () => {
	return {};
};

class LoggedIn extends Component<{
	login: WebLoginState;
}> {
	state = {
		open: false,
	};

	renderAdmin() {
		return (
			<NavItem
				onClick={() => this.setState({open: false})}
				is={Link}
				to="/admin"
				href="/admin"
			>
				Administration
			</NavItem>
		);
	}

	render() {
		return (
			<Wrapper>
				<Dropdown>
					<ButtonOutline
						color="white"
						onClick={() => this.setState({open: true})}
					>
						<Name>{JSON.stringify(this.props.login?.emails[0].value)}</Name>
						<Arrow />
					</ButtonOutline>
					<DropdownMenu
						right
						open={this.state.open}
						onDismiss={() => this.setState({open: false})}
					>
						{this.renderAdmin()}
						<NavItem is="a" href="/auth/logout">
							Logout
						</NavItem>
					</DropdownMenu>
				</Dropdown>
			</Wrapper>
		);
	}
}

const LoginIndicatorView = (props) => {
	if (props.login) {
		return <LoggedIn {...props} />;
	}

	return null;
};

export const LoginIndicator = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginIndicatorView);
