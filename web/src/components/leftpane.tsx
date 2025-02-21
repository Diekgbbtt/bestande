import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {WebLoginState} from '../../../core/reducers/web-login';
import {WebState} from '../../../core/types/web-state';

const mapStateToProps = (state: WebState) => {
	return {
		login: state.login,
	};
};

const mapDispatchToProps = () => {
	return {};
};

const StyledWrapper = styled.div`
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	flex: 1;
`;

const LeftPaneView: React.FC<{login: WebLoginState}> = (props) => {
	const {children, ...otherProps} = props;
	return <StyledWrapper {...otherProps}>{children}</StyledWrapper>;
};

export const LeftPane = connect(
	mapStateToProps,
	mapDispatchToProps
)(LeftPaneView);
