import React from 'react';
import {View} from 'react-native';
import {
	BaseTouchable,
	Chevron,
	Content,
	ImageIcon,
	Label,
} from '../../../core/components/Base';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppearance} from '../../../core/functions/use-appearance';
import {getNameWithoutTitle} from '../../../core/models/person';
import {RawPerson} from '../../../core/types/schedule';
import {globalNavigate} from '../api/set-master-navigator';

export const PersonPreview = (props: {
	person: RawPerson;
	subtitle?: string;
}) => {
	const appearance = useAppearance();
	return (
		<BaseTouchable
			padded
			style={{paddingLeft: 12}}
			onPress={() => {
				globalNavigate('PersonView', {
					uni_identifier: props.person.uni_identifier,
					unislug: mapToUniSlug(props.person.university),
				});
			}}
		>
			<Content small style={globalStyles.flex1}>
				<ImageIcon
					style={{
						tintColor: appearance.ICON_TINT,
						marginRight: 12,
					}}
					source={require('../assets/twotone_person_black_48dp.png')}
				/>
				<View>
					<Label>{getNameWithoutTitle(props.person)}</Label>
					{props.subtitle ? (
						<Label style={{color: appearance.SUBTITLE, fontWeight: 'normal'}}>
							{props.subtitle}
						</Label>
					) : null}
				</View>
				<View style={globalStyles.flex1} />
				<Chevron source={require('../../../core/assets/collapsed.png')} />
			</Content>
		</BaseTouchable>
	);
};
