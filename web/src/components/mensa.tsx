import groupBy from 'lodash/groupBy';
import {darken} from 'polished';
import React, {useCallback, useState} from 'react';
import Helmet from 'react-helmet';
import {useDispatch} from 'react-redux';
import {
	match as Match,
	NavLink,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import Sticky from 'react-sticky-el';
import styled from 'styled-components';
import {
	mobile,
	onlyDesktop,
	onlyMobile,
} from '../../../core/components/layout/responsive';
import {ContainerWithFullWidthStyle} from '../../../core/components/width-container';
import {getInitialDay} from '../../../core/functions/mensa-helpers';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {BLUE, GREEN} from '../../../core/models/colors';
import {UZH} from '../../../core/models/university';
import {
	allMensa as allMensaObj,
	allMensaForInstitution,
	changePricing,
	retiredCanteens,
} from '../../../core/reducers/food';
import {DownloadBanner} from './download-banner';
import {OptionHeader, Radio} from './forms/radio';
import {DesktopContainer} from './layout/desktop-container';
import {MensaDayPicker} from './mensa-day-picker';
import {MensaMenu} from './mensa-menu';
import {leftTouchable, RadioButtonProps, RadioLabel} from './radio-buttons';

const allMensa = allMensaForInstitution(UZH);

const universities = groupBy(allMensa, (m) => m.institution);

const MensaContainer = styled(DesktopContainer)`
	${mobile`
		padding-left: 0;
		padding-right: 0;
	`};
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	${mobile`
		display: block;
	`};
`;

const Left = styled.div<{
	show?: boolean;
}>`
	flex: 1;
	${(props) =>
		props.show
			? ''
			: mobile`			
				display: none;
			`};
`;

const Right = styled.div<{
	show?: boolean;
}>`
	flex: 2;
	${(props) =>
		props.show
			? ''
			: mobile`			
			display: none;
		`};
`;

export const Title = styled.h3`
	font-weight: bold;
	font-family: Montserrat;
	margin-bottom: 4px;
	font-size: 16px;
	${mobile`
		margin-left: 14px;
	`};
`;

const MensaHeader = styled.div`
	background: ${GREEN};
	&:hover {
		background: ${darken(0.05, GREEN)};
	}
	cursor: pointer;
	justify-content: center;
	display: none;
	color: white;
	font-weight: bold;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
	padding-top: 8px;
	padding-bottom: 8px;
	vertical-align: middle;
	i {
		margin-top: 2px;
		vertical-align: middle;
	}
	${mobile`
		display: flex;
	`};
`;

const Entry = styled(
	(
		props: {children: any; to: string; onClick: () => void} & RadioButtonProps
	) => <NavLink {...props} activeStyle={{background: BLUE, color: 'white'}} />
)<RadioButtonProps>`
	${leftTouchable};
`;

const getMensaName = (id: string) => {
	const mensa = allMensaObj.find((m) => m.id === id);
	if (allMensaObj) {
		return mensa?.name || '';
	}

	return '';
};

const OnlyDesktop = onlyDesktop('div');
const OnlyMobile = onlyMobile('div');

export const Mensa: React.FC<{
	match: Match;
}> = ({match}) => {
	const {pricing} = useIsomorphicState((s) => s.food);
	const [menuOpen, setMenuOpen] = useState(false);
	const dispatch = useDispatch();
	const renderHeader = useCallback(() => {
		return (
			<div style={{paddingTop: 30}}>
				{Object.keys(universities).map((u) => {
					return (
						<div key={u} style={{marginBottom: 20}}>
							{u !== 'null' ? <Title>{u}</Title> : null}
							{universities[u][0].mensa.map((mensa) => {
								if (retiredCanteens.find((r) => r === mensa.id)) {
									return null;
								}

								return (
									<Entry
										key={mensa.id}
										to={'/mensa/' + mensa.id}
										onClick={() => {
											setMenuOpen(false);
										}}
									>
										{mensa.name}
									</Entry>
								);
							})}
						</div>
					);
				})}
				<OptionHeader>Preise anzeigen für:</OptionHeader>
				<div>
					<RadioLabel
						onClick={() => {
							dispatch(changePricing('student'));
							setMenuOpen(false);
						}}
						checked={pricing === 'student'}
					>
						<Radio invert name="radio" checked={pricing === 'student'} />
						Studenten
					</RadioLabel>
					<RadioLabel
						onClick={() => {
							dispatch(changePricing('worker'));
							setMenuOpen(false);
						}}
						checked={pricing === 'worker'}
					>
						<Radio invert name="radio" checked={pricing === 'worker'} />
						Mitarbeiter
					</RadioLabel>
					<RadioLabel
						onClick={() => {
							dispatch(changePricing('external'));
							setMenuOpen(false);
						}}
						checked={pricing === 'external'}
					>
						<Radio invert name="radio" checked={pricing === 'external'} />
						Externe
					</RadioLabel>
				</div>
				<DownloadBanner style={{marginTop: 10}}>
					Das Menu in deiner Hosentasche
				</DownloadBanner>
			</div>
		);
	}, [dispatch, pricing]);
	return (
		<div style={{flex: 1}}>
			<Helmet title="Mensa" />
			<Switch>
				<Route
					path={`${match.path}/:id`}
					render={(newMatch) => (
						<React.Fragment>
							<MensaHeader
								onClick={() => {
									setMenuOpen((mo) => !mo);
								}}
							>
								{' '}
								{getMensaName(newMatch.match.params.id)}
								<i className="material-icons">
									{menuOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
								</i>{' '}
								{menuOpen}
							</MensaHeader>
							<Sticky
								stickyStyle={{
									zIndex: 2,
								}}
							>
								<ContainerWithFullWidthStyle
									wrapperStyle={{
										background: GREEN,
										borderTop: '1px solid rgba(0, 0, 0, 0.2)',
									}}
									style={{
										paddingLeft: 0,
										paddingRight: 0,
									}}
								>
									<MensaDayPicker mensa={newMatch.match.params.id} />
								</ContainerWithFullWidthStyle>
							</Sticky>
						</React.Fragment>
					)}
				/>
			</Switch>
			<MensaContainer>
				<Wrapper>
					<Left show={menuOpen}>
						<OnlyDesktop>
							<Sticky topOffset={-50} stickyStyle={{marginTop: 50}}>
								{renderHeader()}
							</Sticky>
						</OnlyDesktop>
						<OnlyMobile>{renderHeader()}</OnlyMobile>
					</Left>
					<Right show={!menuOpen}>
						<Switch>
							<Route
								path={`${match.path}/:id`}
								render={(props) => (
									<Switch>
										<Route
											path={`${props.match.path}/:day`}
											render={(newProps) => (
												<MensaMenu
													{...props.match.params}
													{...newProps.match.params}
													pricing={pricing}
												/>
											)}
										/>
										<Route
											render={(idProps) => {
												return (
													<Redirect
														to={`${match.path}/${
															idProps.match.params.id
														}/${getInitialDay()}`}
													/>
												);
											}}
										/>
									</Switch>
								)}
							/>
							<Route
								render={() => {
									return (
										<Redirect
											to={`${match.path}/${
												universities[Object.keys(universities)[0]][0].mensa[0]
													.id
											}`}
										/>
									);
								}}
							/>
						</Switch>
					</Right>
				</Wrapper>
			</MensaContainer>
		</div>
	);
};
