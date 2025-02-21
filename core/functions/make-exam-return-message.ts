import ms from 'ms';
import {ChatMessage, SystemMessageType} from '../actions/chat-server';
import {ExpandedExamReturnStatistic} from '../types/types';

export const makeExamReturnMessage = (
	examReturn: ExpandedExamReturnStatistic
): ChatMessage => {
	return {
		_id: `examreturn-${examReturn.uni_identifier}-${examReturn.return_date}`,
		text: 'examreturn',
		createdAt: examReturn.return_date + ms('1m'),
		system: true,
		uni_identifier: examReturn.uni_identifier,
		university: examReturn.university,
		userId: '0',
		systemMessageMetadata: {
			type: SystemMessageType.EXAM_RETURNED,
			examReturn,
		},
	};
};
