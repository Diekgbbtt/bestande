import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {globalStyles} from '../../../../core/functions/styles';
import {useLanguage} from '../../../../core/functions/use-language';
import {useNavigationInNative} from '../../../../core/functions/useNavigationInNative';
import rawStrings from '../../../../core/raw-strings';
import {FatModalTitle} from '../FatModalTitle';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

export const ReportGradeDone: React.FC = () => {
	const safe = useSafeAreaInsets();
	const language = useLanguage();
	const navigation = useNavigationInNative();

	const onDone = useCallback(() => {
		// @ts-expect-error
		navigation.popToTop();
		navigation.goBack();
	}, [navigation]);

	return (
		<ReportGradeContainer safeBottom={safe.bottom}>
			<Scroller>
				<VSpace />
				<FatModalTitle>
					{rawStrings.REPORT_GRADE_THANKS[language]}
				</FatModalTitle>
				<VSpace />
				<Explainer>{rawStrings.REPORT_GRADE_THANKS_DESC[language]}</Explainer>
			</Scroller>
			<View style={globalStyles.flex1} />
			<SideSpacing>
				<TouchableOpacity onPress={onDone}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>{rawStrings.DONE[language]}</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
			</SideSpacing>
			<VSpace />
			<VSpace />
		</ReportGradeContainer>
	);
};
