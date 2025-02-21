import {useActionSheet} from '@expo/react-native-action-sheet';
import linkifyIt from 'linkify-it';
import React, {ReactNode} from 'react';
import Hyperlink from 'react-native-hyperlink';
import {Text} from 'react-native-normalized';
import {openLink} from '../functions/open-link';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';

// Book ISBNs start with 978 or 979
const scheme = linkifyIt();

scheme.add('97', {
	validate: (text, pos) => {
		const tail = text.slice(pos - 2);

		const rgx_10_13 = /^(?:(?:-13)?:? *(97(?:8|9)([ -]?)(?=\d{1,5}\2?\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}\d))/i;

		if (rgx_10_13.test(tail)) {
			return (rgx_10_13.exec(tail)?.[0].length as number) - 2;
		}

		return 0;
	},
	normalize(match) {
		match.url = 'ISBN ' + match.raw;
	},
});

export const BlockText = (props: {
	text: ReactNode;
	comment?: boolean;
	italic?: boolean;
	style?: any;
}) => {
	const appearance = useAppearance();
	const actionSheet = useActionSheet();
	return (
		<Hyperlink
			// removing linkify scheme will cause breakage in 0.0.17
			// https://github.com/obipawan/react-native-hyperlink/pull/29#discussion_r355952369
			linkify={scheme}
			onPress={(url) => {
				if (url.startsWith('ISBN')) {
					const google = 'Google';
					const orellFuessli = 'Orell Füssli';
					const cede = 'CeDe.ch';
					const buchhaus = 'Buchhaus';
					const cancel = 'Cancel';
					const options = [google, orellFuessli, cede, buchhaus, cancel];
					actionSheet.showActionSheetWithOptions(
						{
							options,
							cancelButtonIndex: options.indexOf(cancel),
						},
						(buttonIndex) => {
							if (buttonIndex === options.indexOf(google)) {
								openLink(
									'https://google.ch/search?cr=countryCH&q=' +
										encodeURIComponent(url)
								);
							}

							if (buttonIndex === options.indexOf(orellFuessli)) {
								openLink(
									'https://www.orellfuessli.ch/suche?filterPATHROOT=&sq=' +
										url.substr(5)
								);
							}

							if (buttonIndex === options.indexOf(cede)) {
								openLink(
									'https://www.cede.ch/en/books/?search=' + url.substr(5)
								);
							}

							if (buttonIndex === options.indexOf(buchhaus)) {
								openLink(
									'https://google.ch/search?cr=countryCH&q=' +
										encodeURIComponent(url.substr(5) + ' site:buchhaus.ch')
								);
							}
						}
					);
				} else {
					openLink(url);
				}
			}}
			linkStyle={{
				color: appearance.BLUE_TINT,
			}}
			// @ts-expect-error
			style={props.style}
		>
			<Text
				selectable
				style={{
					...uiKit.footnoteObject,
					fontSize: 14,
					color: props.comment ? appearance.COMMENT : appearance.TITLE,
					fontStyle: props.italic ? 'italic' : 'normal',
				}}
			>
				{props.text}
			</Text>
		</Hyperlink>
	);
};
