import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
	padding: 8px;
	border: 1px solid rgba(0, 0, 200, 0.1);
	background: #e1ffc7;
	flex-direction: row;
	align-items: center;
	border-radius: 2px;
	display: flex;
	font-size: 13px;
	font-family: Montserrat;
	line-height: 1.5;
	a {
		color: green;
	}
	i {
		vertical-align: middle;
		font-size: 14px;
		margin-top: -3px;
		margin-left: -2px;
	}
`;

const Logo = styled.div`
	background: white;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	padding: 4px;
	width: 40px;
	height: 40px;
	margin-right: 10px;
	img {
		width: 30px;
	}
`;

export const DownloadBanner = (props) => {
	const {children, ...otherProps} = props;
	return (
		<Container {...otherProps}>
			<Logo>
				<img src="/static/logo.png" />
			</Logo>
			<div>
				{children}
				<br />
				<Link to="/">
					<i className="material-icons">smartphone</i> Lade die App herunter
				</Link>
			</div>
		</Container>
	);
};
