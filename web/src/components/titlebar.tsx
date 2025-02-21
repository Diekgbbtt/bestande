import styled from 'styled-components';
import {GREEN} from '../../../core/models/colors';

const TitleBar = styled.div`
	background: ${GREEN};
	top: 0;
	height: 55px;
	width: 100%;
	display: flex;
	max-width: 1000px;
	margin: auto;
	padding-left: 20px;
	padding-right: 20px;
	align-items: center;
`;

export default TitleBar;
