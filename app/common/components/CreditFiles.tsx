import React, {useCallback, useEffect, useReducer} from 'react';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {EmptyView} from '../../../core/components/EmptyView';
import {Flexer, Row} from '../../../core/components/Primitives';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {getDocumentsForCourse} from '../../../core/functions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {ExpandedPublicFileSharingDocument} from '../../../core/types/file-sharing-document';
import {FileSortOption} from '../../../core/types/types';
import {CreditFileList} from './CreditFileList';
import {FileSortPicker} from './FileSortPicker';

const TopRow = styled(Row)`
	padding-left: 12px;
	padding-right: 12px;
	align-items: center;
	color: ${(props) => props.theme.BLUE_TINT};
`;

const UploadLabel = styled(Text)`
	color: ${(props) => props.theme.BLUE_TINT};
	font-weight: bold;
`;

const UploadButtonRow = styled(Row)`
	align-items: center;
`;

const AddIcon = styled(Image)`
	tint-color: ${(props) => props.theme.BLUE_TINT};
	height: 28px;
	width: 28px;
`;

type State = {
	loading: boolean;
	files: ExpandedPublicFileSharingDocument[];
	sortOption: FileSortOption;
};

type Actions =
	| {type: 'setFiles'; payload: Array<ExpandedPublicFileSharingDocument>}
	| {type: 'addFile'; payload: ExpandedPublicFileSharingDocument}
	| {type: 'deleteFile'; payload: string}
	| {type: 'setFileSortOption'; payload: FileSortOption}
	| {type: 'fetchDocs'};

const Wrapper = styled(SafeSideSpace)`
	padding-top: 20px;
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'fetchDocs':
			return {
				...state,
				files: [],
				loading: true,
			};
		case 'setFiles':
			return {...state, files: action.payload, loading: false};
		case 'deleteFile':
			return {
				...state,
				files: state.files.filter((f) => f._id !== action.payload),
			};
		case 'setFileSortOption':
			return {...state, sortOption: action.payload};

		case 'addFile':
			return {
				...state,
				files: [...state.files, action.payload],
			};
		default:
			return state;
	}
};

const CreditFiles: React.FC<{credit: Credit}> = ({credit}) => {
	const language = useLanguage();
	const [{files, loading, sortOption}, dispatch] = useReducer(reducer, {
		files: [],
		loading: false,
		sortOption: 'newest',
	});
	const navigation = useNavigationInNative();

	const setSortOption = useCallback((payload: FileSortOption) => {
		dispatch({type: 'setFileSortOption', payload});
	}, []);

	const fetchDocs = useCallback(async () => {
		dispatch({type: 'fetchDocs'});
		const docs = await getDocumentsForCourse(
			CreditHelpers.getInstitution(credit),
			getModuleId(credit) as string,
			sortOption
		);
		dispatch({type: 'setFiles', payload: docs.documents});
	}, [credit, sortOption]);

	useEffect(() => {
		fetchDocs();
	}, [credit, fetchDocs, sortOption]);

	const onFileDeleted = useCallback((id: string) => {
		dispatch({type: 'deleteFile', payload: id});
	}, []);

	const onFileAdd = useCallback(
		(document: ExpandedPublicFileSharingDocument) => {
			dispatch({type: 'addFile', payload: document});
		},
		[]
	);

	const goToUploader = useCallback(() => {
		navigation.navigate('UploadFile', {
			uni_identifier: getModuleId(credit) as string,
			university: CreditHelpers.getInstitution(credit),
			onFileAdd,
		});
	}, [credit, navigation, onFileAdd]);

	return (
		<Wrapper>
			<TopRow>
				<Flexer />
				<FileSortPicker current={sortOption} setSort={setSortOption} />
			</TopRow>

			{loading ? (
				<UnifiedProgress />
			) : files.length > 0 ? (
				<CreditFileList
					files={files}
					onDeleted={onFileDeleted}
					onRefresh={fetchDocs}
					refreshing={loading}
				/>
			) : (
				<EmptyView
					icon={require('../assets/twotone_note_add_black_48dp.png')}
					text={rawStrings.NO_FILES[language]}
				/>
			)}
		</Wrapper>
	);
};

export default CreditFiles;
