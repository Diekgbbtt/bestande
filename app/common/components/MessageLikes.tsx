import memoize from 'lodash/memoize';
import {transparentize} from 'polished';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {Row} from '../../../core/components/Primitives';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import rawStrings from '../../../core/raw-strings';
import {usersWhoLikesMessage} from '../api/users-who-likes-message';

const Container = styled(Row)`
	flex-direction: row;
	align-items: center;
	padding-right: 20px;
`;

const Label = styled(Text)`
	color: ${(props) => transparentize(0.25, props.theme.SUBTITLE)};
	font-size: 13px;
`;

const Spacer = styled(View)`
	width: 8px;
`;

const memoTransparentize = memoize(transparentize);

const Icon = styled(Image)`
	height: 10px;
	width: 11px;
	tint-color: ${(props) => memoTransparentize(0.35, props.theme.SUBTITLE)};
`;

export const MessageLikes = (props: {messageId: string}) => {
	const usersWhoLiked = useAppState((state) =>
		usersWhoLikesMessage(state, props.messageId)
	);
	const language = useLanguage();
	const navigation = useNavigationInNative();

	const onPress = React.useCallback(() => {
		navigation.navigate('MessageLikeList', {
			messageId: props.messageId,
		});
	}, [navigation, props.messageId]);

	if (usersWhoLiked.length === 0) {
		return null;
	}

	const usernameArray = usersWhoLiked.map((l) => l.username);
	return (
		<TouchableOpacity onPress={onPress}>
			<Container>
				<Icon source={require('../assets/heart.png')} />
				<Spacer />
				<Label numberOfLines={1} ellipsizeMode="tail">
					{usernameArray.length > 2
						? usernameArray[0] +
						  ' + ' +
						  String(usernameArray.length - 1) +
						  ' ' +
						  rawStrings.OTHERS[language].toLowerCase()
						: usernameArray.join(', ')}
				</Label>
			</Container>
		</TouchableOpacity>
	);
};
