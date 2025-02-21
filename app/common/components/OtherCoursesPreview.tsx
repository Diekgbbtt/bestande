import React from 'react';
import {View} from 'react-native';
import {
	BaseTouchable,
	Chevron,
	Content,
	ImageIcon,
	Label,
	VSpace,
} from '../../../core/components/Base';
import {BlockText} from '../../../core/components/BlockText';
import {getReadableGroupName} from '../../../core/functions/course-code-map';
import {globalStyles} from '../../../core/functions/styles';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {CourseCode} from '../../../core/models/module';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';

export const OtherCoursesPreview = (props: {apiResponse: ApiResponse}) => {
	const navigation = useNavigationInNative<'CreditDetailView'>();
	const appearance = useAppearance();
	const language = useLanguage();
	const courseCode = props.apiResponse.courseCode as CourseCode;
	return (
		<>
			<BlockText
				text={`${rawStrings.IS_PART_OF_GROUP[language]} ${getReadableGroupName(
					courseCode.series,
					language
				)}`}
			/>
			<VSpace />
			<BaseTouchable
				padded
				style={{paddingLeft: 12}}
				onPress={() => {
					navigation.navigate('OtherCoursesInSeries', {
						institution: props.apiResponse.university,
						courseCode,
					});
				}}
			>
				<Content small style={globalStyles.flex1}>
					<ImageIcon
						style={{
							tintColor: appearance.ICON_TINT,
							marginRight: 12,
						}}
						source={require('../assets/twotone_search_black_48dp.png')}
					/>
					<View>
						<Label>
							{courseCode.series}
							{rawStrings.X_GROUP[language]}
						</Label>
						<Label style={{color: appearance.SUBTITLE, fontWeight: 'normal'}}>
							{rawStrings.SEARCH_IN_SERIE[language]}
						</Label>
					</View>
					<View style={globalStyles.flex1} />
					<Chevron source={require('../../../core/assets/collapsed.png')} />
				</Content>
			</BaseTouchable>
		</>
	);
};
