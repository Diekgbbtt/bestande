import {DocumentPickerResponse} from 'react-native-document-picker';
import {FixedDocumentData} from './types';

type State = {
	fileName: string;
	uploadToChat: boolean;
	uploadProgress: number;
	temporaryFile: File | null;
	uploadedFile: FixedDocumentData | null;
	posting: boolean;
};

type Actions =
	| {type: 'setUploadToChat'; payload: boolean}
	| {type: 'setFileName'; payload: string}
	| {type: 'setTemporaryFile'; payload: File}
	| {type: 'setUploadedFile'; payload: FixedDocumentData}
	| {type: 'setUploadProgress'; payload: number}
	| {type: 'removeFile'}
	| {type: 'setPosting'; payload: boolean};

export const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'setTemporaryFile':
			return {...state, temporaryFile: action.payload};
		case 'setUploadToChat':
			return {...state, uploadToChat: action.payload};
		case 'setFileName':
			return {...state, fileName: action.payload};
		case 'setUploadedFile':
			return {...state, uploadedFile: action.payload};
		case 'setUploadProgress':
			return {...state, uploadProgress: action.payload};
		case 'removeFile':
			return {
				...state,
				temporaryFile: null,
				fileName: '',
				uploadedFile: null,
				uploadProgress: 0,
			};
		case 'setPosting':
			return {
				...state,
				posting: action.payload,
			};
		default:
			return state;
	}
};

