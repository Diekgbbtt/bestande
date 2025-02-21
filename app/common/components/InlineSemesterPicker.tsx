import React from 'react';
import {ScrollView} from 'react-native';
import {Label, Option, OptionContainer} from '../../../core/components/Options';
import {Colors} from '../../../core/functions/Colors';
import {renderSemester} from '../../../core/functions/render-semester';
import {useLanguage} from '../../../core/functions/use-language';

export const InlineSemesterPicker = (props: {
	availableSemesters: number[];
	selectedPeriod: number | null;
	setPeriod: (period: number) => void;
}) => {
	const language = useLanguage();
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<OptionContainer style={{width: 90 * props.availableSemesters.length}}>
				{props.availableSemesters.map((period) => {
					const isActive = period === props.selectedPeriod;
					return (
						<Option
							key={period as number}
							style={{width: 90}}
							activeColor={Colors.Blue}
							active={isActive}
							onPress={() => {
								props.setPeriod(period);
							}}
						>
							<Label active={isActive}>
								{renderSemester(period as number, language)}
							</Label>
						</Option>
					);
				})}
			</OptionContainer>
		</ScrollView>
	);
};
