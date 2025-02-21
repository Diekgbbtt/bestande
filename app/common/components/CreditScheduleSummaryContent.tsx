import groupBy from 'lodash/groupBy';
import React from 'react';
import {View} from 'react-native';
import {
	BaseTouchable,
	Chevron,
	Content,
	Label,
} from '../../../core/components/Base';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getSchedule} from '../../../core/functions/get-next-event-from-credit';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import renderModuleType from '../../../core/functions/render-module-type';
import {SeriesConfig} from '../../../core/functions/SeriesConfig';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import {ModuleType} from '../../../core/models/module-type';
import rawStrings from '../../../core/raw-strings';
import {Schedule} from '../../../core/types/schedule';
import {globalNavigate} from '../api/set-master-navigator';

type Props = {
	credit: Credit;
	semester: string;
};

export const CreditScheduleSummaryContent = ({credit, semester}: Props) => {
	const language = useLanguage();
	const schedule = useAppState((state) =>
		getSchedule(state.schedule, credit, semester)
	).schedule as Schedule;
	const config = useAppState(
		(state) =>
			state.seriesConfig[getUniqueIdentifier(credit, true)] ||
			SeriesConfig.getDefault(schedule)
	);
	const grouped = groupBy(
		schedule.filter((s) => config[`e-${s.id}.termine.html`]),
		(s) => s.category
	);
	const selected = Object.keys(grouped).map(
		(g) =>
			`${grouped[g].length}x ${renderModuleType(g as ModuleType, language)}`
	);
	return (
		<BaseTouchable
			padded
			onPress={() => {
				globalNavigate('TimetableOptionDetail', {
					unislug: mapToUniSlug(CreditHelpers.getInstitution(credit)) as string,
					uni_identifier: getModuleId(credit) as string,
					semester,
				});
			}}
		>
			<Content style={globalStyles.flex1}>
				<View>
					<Label>{credit.short_name}</Label>
					<Label style={{opacity: 0.7, fontWeight: '500'}}>
						{selected.length > 0
							? selected.join(', ')
							: rawStrings.NOTHING_SELECTED[language]}
					</Label>
				</View>
				<View style={globalStyles.flex1} />
				<Chevron source={require('../../../core/assets/collapsed.png')} />
			</Content>
		</BaseTouchable>
	);
};
