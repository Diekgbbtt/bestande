import React, {useCallback} from 'react';
import {FlatList, ListRenderItem, RefreshControl, View} from 'react-native';
import styled from 'styled-components/native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {ExpandedPublicFileSharingDocument} from '../../../core/types/file-sharing-document';
import {FilePreview} from './UploadFile/FilePreview';

const Container = styled(View)`
	flex: 1;
`;

export const CreditFileList: React.FC<{
	files: ExpandedPublicFileSharingDocument[];
	onDeleted: (id: string) => void;
	onRefresh: () => void;
	refreshing: boolean;
}> = ({files, onDeleted, onRefresh, refreshing}) => {
	const appearance = useAppearance();

	const renderItem: ListRenderItem<ExpandedPublicFileSharingDocument> = useCallback(
		({item}) => {
			return <FilePreview {...{onDeleted, file: item}} />;
		},
		[onDeleted]
	);

	return (
		<Container>
			<FlatList
				refreshControl={
					<RefreshControl
						{...{onRefresh, refreshing}}
						tintColor={appearance.SUBTITLE}
						colors={[appearance.SUBTITLE]}
					/>
				}
				keyExtractor={(d) => d.s3Key}
				style={{flex: 1}}
				data={files}
				numColumns={3}
				{...{renderItem, refreshing}}
			/>
		</Container>
	);
};
