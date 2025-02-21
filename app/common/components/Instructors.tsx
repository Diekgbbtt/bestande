import React, {Fragment} from 'react';
import {View} from 'react-native';
import {VSpace} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import renderModuleType from '../../../core/functions/render-module-type';
import {truthy} from '../../../core/functions/truthy';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {SemesterResponse} from '../../../core/reducers/api';
import {ForwardArrowButton} from './ForwardArrowButton';
import {PersonPreview} from './PersonPreview';

type Props = {
	semester: SemesterResponse;
};

export const Instructors = ({semester}: Props) => {
	const [showAll, setShowAll] = React.useState(false);
	const language = useLanguage();
	if (semester.instructors.length === 0) {
		return null;
	}

	return (
		<View style={{marginBottom: 8}}>
			<BlockTextTitle style={{marginBottom: 6}}>
				{rawStrings.INSTRUCTORS[language]}
			</BlockTextTitle>
			{semester.instructors
				.filter(truthy)
				.filter((r) => r.instructor)
				.filter((i) => i.important || showAll)
				.map((r) => {
					return (
						<Fragment key={r.id}>
							<PersonPreview
								person={r.instructor}
								subtitle={r.type
									.map((t) => renderModuleType(t, language))
									.join(', ')}
							/>
							<VSpace />
						</Fragment>
					);
				})}
			{!showAll &&
				semester.instructors.filter((i) => i.important).length >
					semester.instructors.length && (
					<ForwardArrowButton
						noPadding
						icon={require('../assets/expanded.png')}
						text={rawStrings.SHOW_ALL[language]}
						onPress={() => setShowAll(true)}
					/>
				)}
		</View>
	);
};
