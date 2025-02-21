import React, {useCallback, useMemo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {BLUE, GREEN, ORANGE} from '../../../core/models/colors';
import {UserWithExtraFields} from '../../../core/types/types';
import {getAvatarInitials} from '../api/get-avatar-initials';

const Colors = {
	backgroundTransparent: 'transparent',
	carrot: ORANGE,
	emerald: GREEN,
	peterRiver: BLUE,
	wisteria: '#8e44ad',
	alizarin: '#e74c3c',
	turquoise: '#1abc9c',
	midnightBlue: '#2c3e50',
};

const {
	carrot,
	emerald,
	peterRiver,
	wisteria,
	alizarin,
	turquoise,
	midnightBlue,
} = Colors;

const styles = StyleSheet.create({
	avatarStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: 40,
		borderRadius: 20,
	},
	noAvatar: {
		height: 0,
		width: 40,
	},
	avatarTransparent: {
		backgroundColor: Colors.backgroundTransparent,
	},
	textStyle: {
		color: 'white',
		fontSize: 16,
		backgroundColor: Colors.backgroundTransparent,
		fontWeight: '500',
	},
});

interface GiftedAvatarProps {
	user: UserWithExtraFields | null;
	textStyle?: StyleProp<TextStyle>;
	onPress?(props: any): void;
}

export const GiftedAvatar: React.FC<GiftedAvatarProps> = (props) => {
	const userName = props.user?.name || '';

	const avatarName = useMemo(() => {
		return getAvatarInitials(userName);
	}, [userName]);

	const avatarColor = useMemo(() => {
		let sumChars = 0;
		for (let i = 0; i < userName.length; i += 1) {
			sumChars += userName.charCodeAt(i);
		}

		const colors = [
			carrot,
			emerald,
			peterRiver,
			wisteria,
			alizarin,
			turquoise,
			midnightBlue,
		];

		return colors[sumChars % colors.length];
	}, [userName]);

	const renderAvatar = useCallback((user: UserWithExtraFields) => {
		if (typeof user.avatar === 'string') {
			return <Image source={{uri: user.avatar}} style={styles.avatarStyle} />;
		} // From a node require

		if (typeof user.avatar === 'number') {
			return <Image source={user.avatar} style={styles.avatarStyle} />;
		}

		return null;
	}, []);

	if (!props.user || props.user._id === 'system') {
		return <View style={styles.noAvatar} />;
	}

	if (props.user.avatar) {
		return renderAvatar(props.user);
	}

	return (
		<View style={[styles.avatarStyle, {backgroundColor: avatarColor}]}>
			<Text style={[styles.textStyle, props.textStyle]}>{avatarName}</Text>
		</View>
	);
};
