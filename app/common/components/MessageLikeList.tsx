import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {Dismisser} from '../../../core/components/Dismisser';
import {Spacer} from '../../../core/components/UI/Spacer';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {usePull} from '../../../core/functions/use-pull';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {usersWhoLikesMessage} from '../api/users-who-likes-message';
import ChatMessageAvatar from './ChatMessageAvatar';
import {VerifiedIcon} from './VerifiedIcon';

const Container = styled(AnimatedNativeScrollView).attrs({
	contentContainerStyle: {
		padding: 10,
	},
})`
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Row = styled(View)`
	flex-direction: row;
	align-items: center;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const Username = styled(Text)`
	font-weight: bold;
`;

export const MessageLikeList = () => {
	const {params} = useRoute<RouteProp<RN5Routes, 'MessageLikeList'>>();
	const {messageId} = params;
	const appearance = useAppearance();

	const navigation = useNavigationInNative();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	const usersWhoLiked = useAppState((state) =>
		usersWhoLikesMessage(state, messageId)
	);

	if (!messageId) {
		return null;
	}

	return (
		<Container style={globalStyles.flex1} {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />

			{usersWhoLiked.map((u) => {
				return (
					<Row key={u.id}>
						<ChatMessageAvatar
							show
							currentMessage={{
								_id: 0,
								text: 'hi',
								user: {
									_id: u.id,
									avatar: u.avatar
										? getImageUrl({
												cdn_identifier: u.avatar,
												width: 80,
												height: 80,
												crop: 'faces',
										  })
										: '',
									name: u.username,
									verified: Boolean(u.verified),
								},
								createdAt: 0,
							}}
						/>
						<Username style={{color: appearance.TITLE}}>{u.username}</Username>
						{u.verified ? (
							<>
								<Spacer />
								<VerifiedIcon />
							</>
						) : null}
					</Row>
				);
			})}
		</Container>
	);
};
