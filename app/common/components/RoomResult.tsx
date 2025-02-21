import React from 'react';
import {truthy} from '../../../core/functions/truthy';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {RoomType} from '../../../core/types/schedule';
import {ResultContainer, ResultSubtitle, ResultTitle} from './ResultLayout';

const RoomResult = (props: {room: RoomType}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<ResultContainer>
			<ResultTitle style={[uiKit.subheadEmphasized, {color: appearance.TITLE}]}>
				{props.room.name}
			</ResultTitle>
			<ResultSubtitle>
				{[
					props.room.subtitle,
					props.room.plan ? rawStrings.PLAN_AVAILABLE[language] : null,
				]
					.filter(truthy)
					.join(' • ')}
			</ResultSubtitle>
			<ResultSubtitle>
				{[
					props.room.campus,
					props.room.address ? props.room.address.split('\n')[0] : null,
				]
					.filter(truthy)
					.join(' • ')}
			</ResultSubtitle>
		</ResultContainer>
	);
};

export default RoomResult;
