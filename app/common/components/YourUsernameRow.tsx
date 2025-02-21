import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-gifted-chat';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	flex-direction: row;
	align-items: center;
`;

const Label = styled(Text)``;

const styles = StyleSheet.create({
	slackAvatar: {
		// The bottom should roughly line up with the first line of message text.
		height: 40,
		width: 40,
		borderRadius: 20,
	},
});

export const YourUsernameRow = () => {
	const profile = useAppState((state) => state.users.userProfile);
	const language = useLanguage();
	const appearance = useAppearance();

	return (
		<Container>
			{profile ? (
				<Avatar
					imageStyle={{
						left: [styles.slackAvatar],
						right: [],
					}}
					currentMessage={{
						_id: 0,
						text: 'hi',
						user: {
							_id: profile.id,
							avatar: profile.avatar
								? getImageUrl({
										cdn_identifier: profile.avatar,
										width: 80,
										height: 80,
										crop: 'faces',
								  })
								: '',
							name: profile.username,
						},
						createdAt: 0,
					}}
				/>
			) : (
				<View
					style={{
						height: 40,
						width: 40,
						backgroundColor: 'rgba(0, 0, 0, 0.05)',
						borderRadius: 20,
						marginRight: 10,
					}}
				/>
			)}
			<Label style={{color: appearance.SUBTITLE, marginBottom: 5}}>
				{profile
					? `${rawStrings.YOUR_USERNAME_IS[language]} ${profile.username}.`
					: rawStrings.HAVE_NO_USERNAME[language]}
			</Label>
		</Container>
	);
};
