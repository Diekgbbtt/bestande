import React from 'react';
import {Clipboard, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {VSpace} from '../../../core/components/Base';
import {Block} from '../../../core/components/Block';
import {HudManager} from '../../../core/components/HudManager';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';

type Props = {
	apiResponse: ApiResponse;
};

const Row = styled(View)`
	flex-direction: row;
	align-items: center;
`;

const Icon = styled(Image)`
	width: 20px;
	height: 20px;
	opacity: 0.4;
`;

export const BestandeLink = (props: Props) => {
	const language = useLanguage();
	const id = props.apiResponse.slug?.length
		? props.apiResponse.slug[0]
		: props.apiResponse.uni_identifier;
	const url = `https://bestande.ch/${mapToUniSlug(
		props.apiResponse.university
	)}/${id}`;
	const appearance = useAppearance();
	return (
		<View>
			<VSpace />
			<Row>
				<Block title={rawStrings.BESTANDE_LINK[language]} text={url} />
				<View style={globalStyles.flex1} />
				<TouchableOpacity
					onPress={() => {
						Clipboard.setString(url);
						HudManager.setHudContent({
							label: rawStrings.COPIED[language],
						});
					}}
				>
					<Icon
						style={{
							tintColor: appearance.ICON_TINT,
						}}
						source={require('../assets/copy.png')}
					/>
				</TouchableOpacity>
			</Row>
		</View>
	);
};
