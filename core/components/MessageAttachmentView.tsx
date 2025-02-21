import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import rawStrings from '../raw-strings';
import {MessageAttachment} from '../types/types';
import {ChatFileAttachment} from './ChatFileAttachment';

const Container = styled(View)``;

const UpdateNotice = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

export const MessageAttachmentView: React.FC<{
	attachments: MessageAttachment[] | undefined;
}> = ({attachments}) => {
	return (
		<Container>
			{(attachments || []).map((attachment) => {
				if (attachment.type === 'FILE_ATTACHMENT') {
					return (
						<ChatFileAttachment
							key={attachment.key}
							fileId={attachment.fileId}
						/>
					);
				}

				return (
					<UpdateNotice key={attachment.key}>
						{rawStrings.UPDATE_BESTANDE_TO_SEE_ATTACHMENT.de}
					</UpdateNotice>
				);
			})}
		</Container>
	);
};
