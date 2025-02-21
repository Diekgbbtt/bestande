import React from 'react';
import {View} from 'react-native';
import {
	BaseTouchable,
	Chevron,
	Content,
	ImageIcon,
	Label,
} from '../../../core/components/Base';
import {openLink} from '../../../core/functions/open-link';
import {globalStyles} from '../../../core/functions/styles';
import {useAppearance} from '../../../core/functions/use-appearance';

export const LinkContainer = ({link, label}: {link: string; label: string}) => {
	const appearance = useAppearance();
	return (
		<BaseTouchable style={{paddingLeft: 12}} onPress={() => openLink(link)}>
			<Content style={{flex: 1, paddingRight: 8}}>
				<ImageIcon
					source={require('../assets/external.png')}
					style={{
						tintColor: appearance.ICON_TINT,
						marginRight: 12,
					}}
				/>
				<View>
					<Label>{label}</Label>
				</View>
				<View style={globalStyles.flex1} />
				<Chevron source={require('../../../core/assets/collapsed.png')} />
			</Content>
		</BaseTouchable>
	);
};
