import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Link} from 'react-router-dom';
import {Config} from '../data/Config';

export const UniversalLink = ({
	webLink,
	children,
	nativeOnPress,
}: {
	webLink: string | null;
	nativeOnPress: (() => void) | null;
	children: JSX.Element;
}) => {
	if (Config.IS_WEBSITE) {
		if (webLink === null) {
			return children;
		}

		return <Link to={webLink}>{children}</Link>;
	}

	if (!nativeOnPress) {
		return children;
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={nativeOnPress}>
			{children}
		</TouchableOpacity>
	);
};
