import React, {useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {hapticFeedback} from '../functions/HapticFeedback';
import {useIsomorphicState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {SemesterResponse} from '../reducers/api';
import {ClientAsessment} from '../types/assessments';
import {AssessmentVariant} from './AssessmentVariant';
import {BlockTextTitle} from './BlockTextTitle';
import {Label, Option, OptionContainer} from './Options';

const Wrapper = styled(View)`
	border-width: 1px;
	border-color: ${(props) => props.theme.BORDER_COLOR};
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 8px;
`;

const Spacer = styled(View)`
	height: 10px;
`;

const SmallSpacer = styled(View)`
	height: 2px;
`;

const SubLabel = styled(Text)`
	font-size: 10px;
`;

export const AssessmentInfo = (props: {
	institution: Institution;
	semester: SemesterResponse;
}) => {
	const [index, setIndex] = useState(0);
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const appearance = useAppearance();
	const renderLabel = (
		university: Institution,
		idx: number,
		variant: ClientAsessment
	) => {
		if (!variant.combination) {
			return '';
		}

		if (variant.combination.length === 0) {
			return rawStrings.AS_SEMESTER_COURSE[language];
		}

		if (variant.combination.length === 1) {
			return rawStrings.AS_TWO_SEMESTER_COURSE[language];
		}
	};

	const renderSubLabel = (variant: ClientAsessment) => {
		if (!variant.combination) {
			return '';
		}

		if (variant.combination.length === 1) {
			if (!variant.combination[0]) {
				return '';
			}

			return `${rawStrings.WITH[language]} ${variant.combination[0].short_name}`;
		}
	};

	if (!props.semester.assessment) {
		return null;
	}

	return (
		<View>
			<BlockTextTitle>{rawStrings.ASSESSMENT[language]}</BlockTextTitle>
			<SmallSpacer />
			<Wrapper>
				{props.semester.assessment.length > 1 ? (
					<>
						<OptionContainer>
							{(props.semester.assessment as ClientAsessment[]).map((a, i) => {
								return (
									<Option
										// eslint-disable-next-line
										key={i}
										active={index === i}
										onPress={() => {
											hapticFeedback('impact');
											setIndex(i);
										}}
									>
										<View
											style={{
												alignItems: 'center',
												justifyContent: 'center',
												flex: 1,
												flexDirection: 'column',
											}}
										>
											<Label>
												<Text
													style={{
														color: index === i ? 'white' : appearance.TITLE,
													}}
												>
													{renderLabel(props.institution, i + 1, a)}
												</Text>
												{renderSubLabel(a) ? (
													<SubLabel
														style={{
															color: index === i ? 'white' : 'black',
														}}
													>
														{'\n'}
														{renderSubLabel(a)}
													</SubLabel>
												) : null}
											</Label>
										</View>
									</Option>
								);
							})}
						</OptionContainer>
						<Spacer />
					</>
				) : null}
				<AssessmentVariant variant={props.semester.assessment[index]} />
			</Wrapper>
		</View>
	);
};
