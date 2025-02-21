import React, {useEffect, useState} from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {Container} from '../../../core/components/layout/container';
import {apiRequest} from '../../../core/functions/api-request';
import {newestVersion} from './faq';
import {Input, Textarea} from './forms/input';
import {SubmitButton} from './forms/submit';
import Title from './splash-page/title';

const Wrapper = styled.div`
	flex: 1;
	margin-bottom: 40px;
`;

const Contact = () => {
	const [version, setVersion] = useState<any>(null);

	useEffect(() => {
		apiRequest('/status/app/versions')
			.then((data) => {
				return setVersion(data as any);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Wrapper>
			<Helmet title="Kontakt" />
			<Container>
				<Title>Kontakt</Title>
				<p>
					Schreibe hier eine Nachricht an das Bestande-Team! Wir helfen dir
					schnell und unkompliziert.
				</p>
				<p>
					Wenn du uns schreibst wegen einem Problem in der App, kannst du es
					vielleicht lösen, indem du die App updatest. {newestVersion(version)}{' '}
					Schreibe ausserdem, ob du an der UZH oder ETH studierst.
				</p>
				<p />
				<form action="//formspree.io/info@bestande.ch" method="POST">
					<Textarea name="message" placeholder="Deine Nachricht" />
					<Input
						type="email"
						required
						name="_replyto"
						placeholder="Deine E-Mail"
					/>
					<input type="hidden" name="_next" value="//bestande.ch/sent" />
					<SubmitButton type="submit" value="Senden" />
				</form>
			</Container>
		</Wrapper>
	);
};

export default Contact;
