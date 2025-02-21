import sortBy from 'lodash/sortBy';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {getSearchResultLink} from '../functions/get-search-result-link';
import {truthy} from '../functions/truthy';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {ClientAsessment} from '../types/assessments';
import {Block} from './Block';
import {BlockTextTitle} from './BlockTextTitle';
import {ModulePreview} from './ModulePreview';
import WebNavigateableTouchable from './WebNavigateableTouchable';

const Container = styled(View)``;

export const AssessmentVariant = ({variant}: {variant: ClientAsessment}) => {
	const language = useLanguage();
	const {exam_form} = variant;
	return (
		<Container>
			{variant.credits ? (
				<Block title={rawStrings.CREDITS[language]} text={variant.credits} />
			) : null}
			{variant.combination && variant.combination.filter(truthy).length > 0 ? (
				<React.Fragment>
					<BlockTextTitle>
						{rawStrings.ASSESSED_TOGETHER_WITH[language]}
					</BlockTextTitle>
					<View style={{height: 2}} />
					{variant.combination.filter(truthy).map((c) => {
						return (
							<View key={String(c.uni_identifier)}>
								<WebNavigateableTouchable
									navigate={{
										onPress: (navigation) => {
											navigation.navigate('CreditDetailView', {
												moduleId: c.uni_identifier,
												semester: sortBy(c.semesters, (s) => 0 - s.period)[0]
													.period_human,
												institution: c.university,
												credit: null,
												chatFirst: false,
											});
										},
										href: getSearchResultLink(c),
									}}
								>
									<ModulePreview credit={c} />
								</WebNavigateableTouchable>
								<View style={{height: 5}} />
							</View>
						);
					})}
				</React.Fragment>
			) : null}
			{exam_form ? (
				rawStrings[exam_form] ? (
					<Block
						title={rawStrings.EXAM_TYPE[language]}
						text={rawStrings[exam_form][language]}
					/>
				) : null
			) : null}
			<Block
				title={rawStrings.LANGUAGE[language]}
				text={variant.exam_language}
			/>
			<Block title={rawStrings.REMARK[language]} text={variant.remark} />
			<Block
				title={rawStrings.ATTENDANCE_CONFIRMATION_REQUIRED[language]}
				text={variant.attendance_confirmation_required}
			/>

			<Block title={rawStrings.MODE[language]} text={variant.exam_mode_eth} />

			<Block
				title={rawStrings.EXTRA_INFO[language]}
				text={variant.additional_exam_mode_info_eth}
			/>
			<Block
				title={rawStrings.REPEATABILITY[language]}
				text={variant.repeatability_eth}
			/>
			<Block
				title={rawStrings.WRITTEN_AIDS[language]}
				text={variant.exam_allowed_helpers_written_eth}
			/>
			<Block
				title={rawStrings.SUPPLEMENTARY_HELPERS[language]}
				text={variant.supplementary_helpers}
			/>
			{variant.studies ? (
				<Block
					title={rawStrings.OFFERED_IN[language]}
					text={variant.studies.join('\n')}
				/>
			) : null}
		</Container>
	);
};
