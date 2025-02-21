import React from 'react';
import {Linking, View} from 'react-native';
import styled from 'styled-components/native';
import {
	BaseTouchable,
	Content,
	HSpace,
	ImageIcon,
	Label,
} from '../../../core/components/Base';
import {globalStyles} from '../../../core/functions/styles';

const Container = styled(View)`
	flex-direction: row;
`;

const SocialMedia = () => {
	return (
		<Container>
			<BaseTouchable
				padded
				style={globalStyles.flex1}
				onPress={() => {
					Linking.canOpenURL('fb://profile/481883781990580')
						.then((canOpen) => {
							if (canOpen) {
								return Linking.openURL('fb://profile/481883781990580');
							}

								return Linking.openURL('https://facebook.com/Bestande');
						})
						.catch((err) => {
							console.log('Error', err);
						});
				}}
			>
				<Content>
					<ImageIcon source={require('../assets/facebook.png')} />
					<HSpace />

					<Label>/Bestande</Label>
				</Content>
			</BaseTouchable>
			<HSpace />
			<BaseTouchable
				padded
				style={globalStyles.flex1}
				onPress={() => Linking.openURL('https://instagram.com/bestande_app')}
			>
				<Content>
					<ImageIcon source={require('../assets/instagram.png')} />
					<HSpace />
					<Label>@bestande_app</Label>
				</Content>
			</BaseTouchable>
		</Container>
	);
};

export default SocialMedia;
