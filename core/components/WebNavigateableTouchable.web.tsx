import React, {FunctionComponent} from 'react';
import {Platform, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Link} from 'react-router-dom';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {Navigation} from '../types/Navigation';

type Props = Omit<TouchableOpacityProps, 'onPress'> & {
	navigate: {
		href: string;
		onPress: (navigation: Navigation) => void;
	};
};

const WebNavigateableTouchable: FunctionComponent<Props> = (props: Props) => {
	const {navigate} = props;
	const navigation = useNavigationInNative();
	if (Platform.OS === 'web') {
		return (
			<Link to={navigate.href}>
				<TouchableOpacity {...props} />
			</Link>
		);
	}

	return (
		<TouchableOpacity onPress={() => navigate.onPress(navigation)} {...props} />
	);
};

export default WebNavigateableTouchable;
