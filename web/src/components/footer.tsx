import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';
import {DesktopContainer} from './layout/desktop-container';

export const FOOTER_HEIGHT = 130 // 190;

const Wrapper = styled.div`
	background: #f8f8f8;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding-top: 20px;
	min-height: ${FOOTER_HEIGHT}px;
	font-size: 0.85em;
`;

const MobileCompatibleContainer = styled(DesktopContainer)`
	flex-direction: row;
	display: flex;
	${mobile`
		flex-direction: column;
	`}
`;

const FlexContainer = styled.div`
	display: flex;
	max-width: 500px;
	margin: auto;
	margin-top: 7px;
	margin-bottom: 30px;
	${mobile`
		flex-direction: column-reverse;
	`}
`;

const FirstColumnContent = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	${mobile`
		border-top: 1px solid black;
		padding-top: 20px;
		flex-direction: column;
		padding-bottom: 30px;
	`}
`;

const Link = styled(NavLink)`
	color: #555;
`;

const ExternalLink = styled.a.attrs({
	target: '_blank',
})`
	color: #555;
`;

const Title = styled.div`
	color: #444;
	font-weight: bold;
`;

export const Footer = () => {
	return (
		<Wrapper>
			<MobileCompatibleContainer>
				<FlexContainer>
					<FirstColumnContent style={{flex: '0 1 auto', minWidth: 200}}>
						<img
							src="/static/blacklogo.png"
							style={{
								width: 25,
								height: 35,
								opacity: 0.3,
								marginRight: 15,
								marginTop: 5,
								marginBottom: 15,
							}}
						/>
						<div>
							<Title>© {new Date().getFullYear()} Bestande</Title>
							<Link to="/about">
								Bestande Team <br />
							</Link>
							<Link to="/privacy">
								Datenschutz <br />
							</Link>
							{/* <Link to="/contact">Kontakt</Link> */}
						</div>
					</FirstColumnContent>
					<div style={{flex: 'flex: 1 1 auto'}}>
						<p>
							<b>Disclaimer:</b> Bestande is a student-led service offered by the VSUZH. This service has no official affiliation with the University of Zurich.
						</p>
					</div>
				</FlexContainer>
				{/* <Column>
					<Title>Apps</Title>
					<ExternalLink href="https://itunes.apple.com/ch/app/bestande/id1058948091?mt=8">
						iOS <br />
					</ExternalLink>
					<ExternalLink href="https://play.google.com/store/apps/details?id=bestande.bestande&hl=en">
						Android <br />
					</ExternalLink>
				</Column>
				<Column>
					<Title>Ressourcen</Title>
					<Link to="/rules">
						Community-Regeln <br />
					</Link>
					<Link to="/changelog">Changelog</Link>
				</Column>
				<Column>
					<Title>Links</Title>
					<ExternalLink href="https://facebook.com/Bestande">
						Facebook <br />
					</ExternalLink>
					<ExternalLink href="https://instgram.com/bestande_app">
						Instagram <br />
					</ExternalLink>
					<ExternalLink href="https://github.com/bestande">
						Github <br />
					</ExternalLink>
					<ExternalLink href="https://anysticker.app/bestande">
						Stickers <br />
					</ExternalLink>
				</Column> */}
			</MobileCompatibleContainer>
		</Wrapper>
	);
};
