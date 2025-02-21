import React, {useCallback, useEffect} from 'react';
import Helmet from 'react-helmet';
import {useDispatch} from 'react-redux';
import {match as Match, Route, Switch} from 'react-router-dom';
import styled from 'styled-components';
import {makeRequest} from '../../../core/actions/grade-statistics';
import {getRating} from '../../../core/actions/ratings';
import {Container} from '../../../core/components/layout/container';
import Stars from '../../../core/components/stars-web';
import {ContainerWithFullWidthStyle} from '../../../core/components/width-container';
import {getPassedHue} from '../../../core/functions/get-passed-hue';
import {truthy} from '../../../core/functions/truthy';
import {useWebState} from '../../../core/functions/use-app-state';
import {GREEN} from '../../../core/models/colors';
import {Institution} from '../../../core/models/credit';
import {moduleGetUrl} from '../../../core/models/module';
import {getNameWithoutTitle} from '../../../core/models/person';
import {semesterFormatPeriod} from '../../../core/models/semester';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse, SemesterResponse} from '../../../core/reducers/api';
import {semesterRegex} from '../helpers/semester-regex';
import {makeKey} from '../reducers/grade-statistics';
import {HeaderImage} from './header-image';
import {ModuleDescription} from './module-description';
import {ModuleHeader, ModuleHeaderOwnProps} from './module-header';
import ModuleRatings from './module-ratings';
import ModuleTabs from './module-tabs';
import {Footer} from './footer';
import {ModuleDocuments} from './module-documents';

const HeaderShader = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
	display: flex;
	align-items: flex-end;
	padding-bottom: 10px;
	z-index: 1;
`;
const HeaderNoShader = styled.div`
	position: relative;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: flex-end;
	padding-bottom: 10px;
	z-index: 1;
`;

const ModuleQuickStats = styled.div`
	display: flex;
	flex-direction: row;
	padding-top: 9px;
	padding-bottom: 9px;
`;

const renderHeaderImage = (props: ModuleHeaderOwnProps) => {
	if (!props.module.header_image) {
		return (
			<div
				style={{
					paddingTop: 20,
					paddingBottom: 20,
					position: 'relative',
					background: GREEN,
				}}
			>
				<HeaderNoShader>
					<Container>
						<ModuleHeader {...props} isWhite />
					</Container>
				</HeaderNoShader>
			</div>
		);
	}

	return (
		<div style={{position: 'relative'}}>
			<HeaderImage image={props.module.header_image} />
			<HeaderShader>
				<Container>
					<ModuleHeader {...props} match={props.match} isWhite />
				</Container>
			</HeaderShader>
		</div>
	);
};

const renderUsers = (module) => {
	if (!module || !module.userCount) {
		return null;
	}

	return (
		<div>
			{/* <span style={{fontSize: 14, marginRight: 10}}>
				{thousands(module.userCount.all || 0, "'")} App-User
			</span> */}
		</div>
	);
};

export const renderRating = (gradeStatistics) => {
	if (!gradeStatistics || !gradeStatistics.count) {
		return null;
	}

	const {passed, count} = gradeStatistics;
	const renderPercentage = () => {
		return Math.round((passed / count) * 100);
	};

	const shade = passed / count;
	return (
		<div>
			<span style={{fontSize: 14, color: getPassedHue(shade)}}>
				{renderPercentage() + '% bestehen'}
			</span>
		</div>
	);
};

const StarsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const StarsCount = styled.div`
	font-size: 14px;
	color: gray;
	margin-left: 5px;
	margin-top: 2px;
	display: inline-block;
`;

const renderStars = (props) => {
	if (!props) {
		return null;
	}

	const {average, total} = props;
	return (
		<StarsContainer>
			<Stars stars={average} half size={20} />
			<StarsCount>({String(Number(total))})</StarsCount>
		</StarsContainer>
	);
};

export const ModuleContent: React.FC<{
	module: ApiResponse;
	className: string;
	semesterResponse: SemesterResponse;
	match: Match<{
		semester: string;
		content: string;
	}>;
}> = (props) => {
	const {module: credit} = props;
	const dispatch = useDispatch();
	const stats = useWebState((state) => state.gradeStatistics[makeKey(credit)]);

	const fetchStats = useCallback(
		(university: Institution, uni_identifier: string) => {
			return dispatch(makeRequest(university, uni_identifier));
		},
		[dispatch]
	);

	const doFetchRating = useCallback(
		({uni_identifier, university}) => {
			dispatch(
				getRating({
					institution: university,
					uni_identifier,
					sortOption: 'top',
					token: null,
				})
			);
		},
		[dispatch]
	);

	useEffect(() => {
		if (!stats || (!stats.stats && !stats.error)) {
			fetchStats(credit.university, credit.uni_identifier);
		}
	}, [credit, doFetchRating, fetchStats, stats]);
	if (!credit) {
		return null;
	}

	const {className, ...otherProps} = props;
	return (
		<div className={className}>
			{renderHeaderImage(otherProps)}
			<Container>
				<Helmet
					title={otherProps.module.short_name}
					link={[
						{
							rel: 'canonical',
							href: `https://bestande.ch${moduleGetUrl(
								otherProps.module
							)}`,
						},
					].filter(truthy)}
					meta={[
						{
							name: 'description',
							content:
								otherProps.module.semesters[0].description +
								`. Finde Stundenplan, Bewertungen, Infos, Statistiken zu Fächern an der ${
									rawStrings[otherProps.module.university].de
								} (${
									otherProps.module.university
								}) auf bestande.ch.`,
						},
						{
							name: 'keywords',
							content: [
								otherProps.module.university,
								otherProps.module.short_name,
								otherProps.module.name,
								...otherProps.module.semesters.map((s) =>
									semesterFormatPeriod(s)
								),
								...otherProps.module.semesters[0].responsible.map(
									(r) => getNameWithoutTitle(r)
								),
							].join(', '),
						},
					]}
				/>
			</Container>
			<ContainerWithFullWidthStyle
				wrapperStyle={{
					background: 'rgba(0, 0, 0, 0.05)',
					paddingTop: 5,
					paddingBottom: 5,
				}}
			>
				<ModuleQuickStats>
					{renderStars(
						props.module.ratingSummary
							? props.module.ratingSummary
							: null
					)}
					<div style={{flex: 1}} />
					{renderUsers(credit)}
					{renderRating(
						stats?.stats
							? stats.stats.total
							: props.module.gradeStatistics
					)}
				</ModuleQuickStats>
			</ContainerWithFullWidthStyle>
			<ContainerWithFullWidthStyle
				wrapperStyle={{background: 'rgba(0, 0, 0, 0.05)'}}
			>
				<ModuleTabs module={props.module} match={props.match} />
			</ContainerWithFullWidthStyle>
			<Switch>
				{/*<Route*/}
				{/*	exact*/}
				{/*	path={`${props.match.path}/${semesterRegex}/stats`}*/}
				{/*	render={() => (*/}
				{/*		<Container style={{paddingTop: 20}}>*/}
				{/*			<ModuleStatistics {...otherProps} />*/}
				{/*		</Container>*/}
				{/*	)}*/}
				{/*/>*/}
				<Route
					exact
					path={`${props.match.path}/${semesterRegex}/documents`}
					render={() => (
						<Container>
							<ModuleDocuments {...otherProps} />
						</Container>
					)}
				/>
				<Route
					exact
					path={`${props.match.path}/${semesterRegex}/ratings`}
					render={() => <ModuleRatings {...otherProps} />}
				/>
				{/*<Route*/}
				{/*	exact*/}
				{/*	path={`${props.match.path}/${semesterRegex}/related`}*/}
				{/*	render={() => <ModuleRelated module={otherProps.module} />}*/}
				{/*/>*/}
				<Route
					exact
					path={`${props.match.path}/${semesterRegex}`}
					render={() => (
						<Container>
							<ModuleDescription {...otherProps} />
						</Container>
					)}
				/>
			</Switch>
			<div style={{height: 30}} />
			<Footer />
		</div>
	);
};

