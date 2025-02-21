import React, {useState, useEffect} from 'react';
import {NavLink, NavLinkProps} from 'react-router-dom';
import styled, {css} from 'styled-components';
import {desktop, mobile} from '../../../../core/components/layout/responsive';
import {GREEN} from '../../../../core/models/colors';
import {auth} from '../../firebase-frontend';
import {DesktopContainer} from '../layout/desktop-container';
import {isStudentStillLoggedIn} from '../../our-auth-flow';

const Wrapper = styled.div`
	background: ${GREEN};
	padding-top: 10px;
	padding-bottom: 10px;
	flex-direction: row;
`;

const HeaderContainer = styled(DesktopContainer)`
	display: flex;
`;

const MenuItemStyle = css<
	{
		right?: boolean;
	} & any
>`
	font-weight: bold;
	font-family: Montserrat;
	color: green;
	${(props) =>
		props.right
			? `
	margin-left: 15px;
	`
			: `
	margin-right: 15px;
	`};
	${mobile`
		margin-right: 15px;
		margin-left: 0;
		flex: 1;
		text-align: center;
	`};
`;

const MenuItemInner = ({right, ...otherProps}: NavLinkProps & {right?: any}) => (
	<NavLink
		{...otherProps}
		activeStyle={{
			color: 'white',
		}}
	/>
);

const MenuItem = styled(MenuItemInner)`
	${MenuItemStyle};
`;

const MoreIcon = styled.div`
	${MenuItemStyle};
	cursor: pointer;
	margin-top: 3px;
	${desktop`
		display: none;
	`};
`;

const Row = styled.div`
	display: flex;

	@media only screen and (max-width: 600px) {
		font-size: 12px;
	}
`;

const MobileHidden = styled(Row)<{
	visible?: boolean;
}>`
	${mobile`
		display: none;
		${(props) =>
			props.visible
				? `
			display: flex;
		`
				: null}
	`};
`;

const SocialMediaIcon = styled.img`
	height: 20px;
	width: 20px;
	margin-top: 3px;
	margin-left: 10px;
	&:hover {
		opacity: 1;
	}
`;

const MobileNone = styled.div`
	${mobile`
		display: none;
	`};
`;

const Menu = ({path}) => {
	const [visible, setVisible] = useState(false);

	const close = () => {
		setVisible(false);
	};

	return (
		<div>
			<MenuItem
				onClick={() => close()}
				exact
				to="/"
				// @ts-expect-error
				theme={null}
			>
				Bestande 2.0
			</MenuItem>
			<MenuItem
				// @ts-expect-error
				theme={null}
				onClick={() => close()}
				to="/uzh/search"
				style={/\/search/.exec(path) ? {color: 'white'} : {}}
			>
				Fächer
			</MenuItem>
			<MenuItem
				onClick={() => {
					close();
					window.location.href = '/voting';
				}}
				exact
				to="/voting"
				// @ts-expect-error
				theme={null}
			>
				Voting
			</MenuItem>
			{isStudentStillLoggedIn() ? (
				<MenuItem
					// @ts-expect-error
					theme={null}
					onClick={() => close()}
					to="/profile"
				>
					Dein Profil
				</MenuItem>
			) : (
				<MenuItem
					// @ts-expect-error
					theme={null}
					onClick={() => close()}
					to="/login"
				>
					Login
				</MenuItem>
			)}
		</div>
	);
};

export default Menu;

