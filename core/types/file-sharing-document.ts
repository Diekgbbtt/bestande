import {WithId} from 'mongodb';
import {Institution} from '../models/credit';

export type FileSharingUploadRequest = {
	uni_identifier: string;
	university: Institution;
	fileName: string;
	s3Key: string;
	fileSize: number;
	mimeType: string;
	token: string;
	sendToChat: boolean;
};

export type FileSharingDeleteRequest = {
	_id: string;
	token: string;
};

export type FileSharingDocument = {
	userId: string;
	mimeType: string;
	fileSize: number;
	s3Key: string;
	fileName: string;
	university: Institution;
	uni_identifier: string;
	uploaded: number;
	stats: {
		views: number;
		downloads: number;
	};
};

type PublicFileSharingDocument = WithId<FileSharingDocument>;

export type ExpandedPublicFileSharingDocument = Omit<
	PublicFileSharingDocument,
	'userId' | '_id'
> & {
	_id: string;
};

export type ExamReturnPutRequest = {
	uni_identifier: string;
	university: Institution;
	period: number;
	exam_date: number;
	return_date: number;
	token: string;
	usernameOverride?: string;
	skipNotification?: boolean;
};

