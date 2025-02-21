import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {LeftPane} from './leftpane';

const activeStyle = {
	background: 'rgba(0, 0, 0, 0.05)',
	display: 'block',
};

const MenuItem = styled.div`
	padding: 6px 10px;
	color: black;
	font-size: 14px;
`;

const AdminMenu = (props) => {
	return (
		<LeftPane {...props}>
			<NavLink to="/admin/stats" activeStyle={activeStyle} exact>
				<MenuItem>Statistiken</MenuItem>
			</NavLink>
			<NavLink to="/admin/tasks" activeStyle={activeStyle} exact>
				<MenuItem>Tasks</MenuItem>
			</NavLink>
			<NavLink to="/admin/promotions" activeStyle={activeStyle}>
				<MenuItem>Werbung</MenuItem>
			</NavLink>
			<NavLink to="/admin/ratings" activeStyle={activeStyle}>
				<MenuItem>Bewertungen</MenuItem>
			</NavLink>
		</LeftPane>
	);
};

export default AdminMenu;
