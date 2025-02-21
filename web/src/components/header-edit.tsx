import {Arrow, Input, Label, Space} from '@jonny/rebass';
import React, {Component} from 'react';
import styled from 'styled-components';
import {ImageType} from '../../../core/types/image';
import Uploader from './aws-uploader';
import Button from './button';
import Explainer from './explainer';
import {ShadedEscapePadded} from './layout/padded';

const Toggler = styled.a`
	color: blue;
	cursor: pointer;
`;

type State = {
	expanded: boolean;
};

class HeaderEdit extends Component<{
	image: ImageType | null;
	onChange: (img: ImageType | null) => void;
}> {
	state: State = {
		expanded: false,
	};

	onChange(key: keyof ImageType, value: string) {
		this.props.onChange({
			...(this.props.image as ImageType),
			[key]: value,
		});
	}

	render() {
		if (!this.props.image) {
			return (
				<div>
					<Label>Titelbild</Label>
					<br />
					<Button
						onClick={() => {
							this.props.onChange({
								cdn_identifier: '',
							});
						}}
					>
						Bild hinzufügen
					</Button>
				</div>
			);
		}

		return (
			<div>
				<Label>Titelbild</Label>
				<Uploader
					image={this.props.image}
					onUploaded={({filename}) => {
						this.onChange('cdn_identifier', filename);
					}}
				/>
				<div style={{marginTop: 8}} />
				<Toggler
					onClick={() =>
						this.setState((prevState: State) => ({
							expanded: !prevState.expanded,
						}))
					}
				>
					<Button>
						Optionen {this.state.expanded ? 'verbergen' : 'anzeigen'}{' '}
						<Arrow direction={this.state.expanded ? 'up' : 'down'} />
					</Button>
				</Toggler>
				<Space x={1} />
				<Button destructive onClick={() => this.props.onChange(null)}>
					Kein Bild anzeigen
				</Button>
				{this.state.expanded ? (
					<ShadedEscapePadded horizontal style={{marginTop: 8}}>
						<Input
							value={this.props.image.cdn_identifier}
							label="S3-Bildname"
							name="cdn_identifier"
							placeholder="karrieretag.jpg"
							onChange={({target}) =>
								this.onChange('cdn_identifier', target.value)
							}
						/>
						<Explainer>
							Anstatt ein Bild hochzuladen, kannst du auch den Bildnamen eines
							bereits hochgeladenes Bild eingeben.
						</Explainer>
						<Input
							value={this.props.image.alt_text}
							label="Alternativer Text"
							name="alt_text"
							onChange={({target}) => this.onChange('alt_text', target.value)}
						/>
						<Explainer>
							Optional: Text, der das Bild beschreibt. Wird angezeigt, wenn das
							Bild nicht angezeigt werden kann oder wenn man mit der Maus drüber
							fahrt.
						</Explainer>
						<Input
							value={this.props.image.source}
							label="Quelle"
							name="source"
							onChange={({target}) => this.onChange('source', target.value)}
						/>
						<Explainer>
							Optional: Eine Quellenangabe, die zusätzlich zum Bild angezeigt
							wird.
						</Explainer>
						<Input
							value={this.props.image.source_url}
							label="Quellen-URL"
							name="source_url"
							onChange={({target}) => this.onChange('source_url', target.value)}
						/>
						<Explainer>
							Optional: Eine URL, die aufgerufen wird, wenn man auf die Quelle
							klickt.
						</Explainer>
					</ShadedEscapePadded>
				) : null}
			</div>
		);
	}
}

export default HeaderEdit;
