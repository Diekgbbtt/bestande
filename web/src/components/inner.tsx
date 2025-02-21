import {History, Location} from 'history';
import omit from 'lodash/omit';
// eslint-disable-next-line no-restricted-imports
import qs from 'querystring';
import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {match as Match, useHistory, withRouter} from 'react-router';
import {Redirect, Route, Switch} from 'react-router-dom';
import {AppearanceMap} from '../../../core/functions/use-appearance';
import {GREEN} from '../../../core/models/colors';
import {instituteRegex} from '../helpers/institute-regex';
import Admin from './admin';
import CallbackPage from './callback';
import {FOOTER_HEIGHT} from './footer';
import {Institution} from './institution';
import Login from './login';
import {LoginIndicator} from './loginindicator';
import Logo from './logo';
import {NotFound} from './not-found';
import Profile from './profile';
import SplashPage from './splash-page';
import Menu from './splash-page/menu';
import TitleBar from './titlebar';
import ResetPassword from './reset-password';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, SearchBox, SearchBoxProps} from 'react-instantsearch';
import {history} from 'instantsearch.js/es/lib/routers';
import {createInMemoryCache} from '@algolia/cache-in-memory';
import {createFallbackableCache} from '@algolia/cache-common';
import {createBrowserLocalStorageCache} from '@algolia/cache-browser-local-storage';
import {Privacy} from './privacy';
import {About} from './about';

declare module 'styled-components' {
	interface DefaultTheme extends AppearanceMap {
		promotedEventHeight: number;
	}
}

class ScrollToTopWithoutRouter extends Component<{
	location: Location;
	history: History;
	match: Match;
}> {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return this.props.children;
	}
}

const ScrollToTop = withRouter(ScrollToTopWithoutRouter);

const styles = {
	titlebar: {
		height: 55,
		display: 'block',
		background: GREEN,
		alignItems: 'center',
		centerPart: {
			margin: 'auto',
			display: 'flex',
		},
	},
};

const StyledSearchBox = styled(SearchBox)`
	.ais-SearchBox {
		flex-grow: 1;
	}

	.ais-SearchBox-input {
		padding: 10px;
		border-radius: 4px;
		padding-left: 40px;
		padding-right: 40px;
		background: rgb(8, 166, 75);
		border: none;
		color: white;
		flex-grow: 1;

		&::placeholder {
			color: black;
			opacity: 0.7;
		}
	}

	.ais-SearchBox-submit,
	.ais-SearchBox-reset {
	}
`;

const ALGOLIA_APP_ID = '299XCMNA4R';
const ALGOLIA_SEARCH_KEY = '21e9fdae59075788687f4a96f8835360';
const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;
const ALGOLIA_INDEX_NAME = 'modules-including-FS25';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY, {
	responsesCache: createFallbackableCache({
		caches: [
			createBrowserLocalStorageCache({
				key: `algolia-responses-bestande-${1}`,
				timeToLive: ONE_WEEK_SECONDS,
			}),
			createInMemoryCache(),
		],
	}),

	requestsCache: createInMemoryCache({serializable: true}),
});

const DEBOUNCE_DELAY_MS = 150;
const debouncedSearch = debounce((query, search) => {
	search(query);
}, DEBOUNCE_DELAY_MS);

const createURL = (state) => `?${qs.stringify(omit(state, 'configure'))}`;
const searchStateToUrl = (props, searchState) =>
	searchState ? `${props.location.pathname}${createURL(searchState)}` : '';
const urlToSearchState = (location: Location) => qs.parse(location.search.slice(1));
const updateAfter = 300;

const routing = {
	router: history(),
};

const queryHook: SearchBoxProps['queryHook'] = (query, search) => {
	debouncedSearch(query, search);
};

class Inner extends Component<{
	location: Location;
	history: History;
	searchState: any;
	resultsState: any;
	match: Match;
}> {
	debouncedSetState: number | NodeJS.Timeout;
	state: {
		searchState: any;
	};

	constructor(props) {
		super(props);
	}

	handleSearchBoxClick = () => {
		this.props.history.push('/uzh/search');
	};

	render() {
		return (
			<ScrollToTop>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					<InstantSearch
						indexName={ALGOLIA_INDEX_NAME}
						searchClient={searchClient}
						insights={true}
						routing={routing}
					>
						<div
							style={{
								minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)`,
							}}
						>
							<Helmet
								title="Bestande – Dein Helfer fürs Studium"
								titleTemplate="%s • Bestande"
								meta={[
									{
										name: 'description',
										content:
											'Dein Helfer fürs Studium. Finde Stundenplan, Bewertungen, Infos, Statistiken für Fächer an der UZH und ETH auf bestande.ch.',
									},
									{
										name: 'apple-itunes-app',

										content:
											'app-id=1058948091, affiliate-data=myAffiliateData, app-argument=myURL',
									},
									{
										name: 'viewport',

										content:
											'width=device-width, initial-scale=1',
									},
									{
										name: 'charset',
										content: 'UTF-8',
									},
									{
										name: 'og:image',
										content:
											'https://bestande.ch/static/logo.png',
									},
									{
										name: 'twitter:image',

										content:
											'https://bestande.ch/static/logo.png',
									},
								]}
							/>
							<div
								style={{
									backgroundColor: GREEN,
									display: 'grid',
									alignItems: 'center',
									justifyContent: 'center',
									paddingTop: 20,
									paddingBottom: 15,
									paddingLeft: 10,
									paddingRight: 10,
									gap: 15,
								}}
							>
								<div
									style={{
										display: 'flex',
									}}
								>
									<Logo />
									<StyledSearchBox
										placeholder="Suche Fächer..."
										onClick={this.handleSearchBoxClick}
										queryHook={queryHook}
									/>
								</div>

								<Menu path={this.props.location.pathname} />
							</div>

							<div>
								<Switch>
									<Route exact path="/" />
								</Switch>
								<Switch>
									<Route exact path="/" component={SplashPage} />
									<Route path="/admin" component={Admin} />
									<Route path="/login" component={Login} />
									<Route path="/profile" component={Profile} />
									<Route
										path="/callback"
										component={CallbackPage}
									/>
									{/* <Route path="/rules" component={CodeOfConduct} /> */}
									{/* <Route path="/werbung" component={Promotion} /> */}
									<Route
										path="/search"
										render={() => <Redirect to="/uzh/search" />}
									/>
									{/* <Route path="/contact" component={Contact} /> */}
									<Route path="/privacy" component={Privacy} />
									<Route path="/about" component={About} />
									{/* <Route path="/mensa" component={Mensa} /> */}
									{/* <Route path="/changelog" component={ChangelogView} /> */}
									{/* <Route path="/sent" component={Sent} /> */}
									<Route
										path={`/:institution${instituteRegex()}`}
										component={Institution}
									/>
									{/* <Route path={'/files/:fileId'} component={FileDetail} /> */}
									<Route
										path="/reset-password"
										component={ResetPassword}
									/>
									<Route
										render={({staticContext}) => {
											if (staticContext) {
												// @ts-expect-error
												staticContext.status = 404;
											}

											return <NotFound />;
										}}
									/>
								</Switch>
							</div>
						</div>
					</InstantSearch>
				</div>
			</ScrollToTop>
		);
	}
}

export default Inner;

