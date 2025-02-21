import React from 'react';
import {ScrollView, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Flexer} from '../../../core/components/Primitives';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {renderSemester} from '../../../core/functions/render-semester';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {Button, Label} from './Button';
import {CreditInfo} from './CreditInfo';
import {CreditSemesterView} from './CreditSemester';

const Container = styled(ScrollView)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const InfoView = styled(View)`
	flex-direction: row;
	background-color: ${(props) => props.theme.BACKGROUND};
	padding-right: 12px;
	padding-left: 12px;
	align-items: center;
	padding-top: 10px;
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const Arrow = styled(Image)`
	height: 16px;
	width: 16px;
	tint-color: ${(props) => props.theme.BLUE_TINT};
`;

const SemesterPicker = styled(View)`
	width: 100px;
`;

export const CreditInfoTab: React.FC<{
	semester: string;
	moduleId: string;
	credit: Credit;
}> = ({semester, moduleId, credit}) => {
	const language = useLanguage();

	return (
		<Container>
			<SafeSideSpace>
				<InfoView>
					<Subtitle>{rawStrings.SHOW_INFO_FOR_SEMESTER[language]}:</Subtitle>
					<Flexer />
					<SemesterPicker>
						<CreditSemesterView
							semester={semester}
							moduleId={moduleId}
							credit={credit}
						>
							<Button>
								<Label>{renderSemester(semester, language)}</Label>
								<Flexer />
								<Arrow source={require('../assets/expanded.png')} />
							</Button>
						</CreditSemesterView>
					</SemesterPicker>
				</InfoView>
				<CreditInfo
					credit={credit}
					moduleId={moduleId}
					semester={semester as string}
				/>
			</SafeSideSpace>
		</Container>
	);
};
