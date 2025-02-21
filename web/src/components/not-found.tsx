import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Redirect} from 'react-router-dom';
import styled from 'styled-components';
import {Container} from '../../../core/components/layout/container';
import {apiRequest} from '../../../core/functions/api-request';
import {linkStyle} from './link';
import {Spinner} from './spinner';

const FourOFour = styled.div`
	font-family: Montserrat;
	font-size: 24px;
	font-weight: bold;
	text-align: center;
`;

const A = styled.a`
	${linkStyle};
`;

export class NotFound extends Component {
	state: {
		url: string | null | false;
	} = {
		url: null,
	};

	componentDidMount() {
		if (!this.isNotFound()) {
			apiRequest(`/redirect?query=${this.path()}`)
				.then(({url}) => {
					return this.setState({url});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	path() {
		return window.location.pathname.substr(1);
	}

	isNotFound() {
		return (
			typeof window !== 'undefined' ||
			this.state.url === false ||
			typeof window === 'undefined'
		);
	}

	render() {
		if (this.isNotFound()) {
			return (
				<Container style={{paddingTop: 30}}>
					<Helmet title="404" />
					<div style={{textAlign: 'center'}}>
						<FourOFour>Nid verstande 😢</FourOFour>
						<p>
							Diese Seite wurde nicht gefunden. Glaubst du, das ist ein Fehler?
							Schreibe uns:{' '}
							<A href="mailto:info@bestande.ch">info@bestande.ch</A>
						</p>
					</div>
				</Container>
			);
		}

		if (this.state.url === null) {
			return <Spinner />;
		}

		return <Redirect to={this.state.url as string} />;
	}
}
