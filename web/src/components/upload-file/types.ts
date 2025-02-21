import {FileSharingUploadRequest} from '../../../../core/types/file-sharing-document';

export type FixedDocumentData = Omit<
	FileSharingUploadRequest,
	'fileName' | 'sendToChat' | 'token'
>;

