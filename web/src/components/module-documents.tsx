import React, {useCallback, useEffect, useReducer, useState} from 'react';
import styled from 'styled-components';
import {ExpandedPublicFileSharingDocument} from '../../../core/types/file-sharing-document';
import {FileSortOption} from '../../../core/types/types';
import {getDocumentsForCourse} from '../../../core/functions/api';
import {Institution} from '../../../core/models/credit';
import {Container} from '../../../core/components/layout/container';
import {UploadFile} from './upload-file/UploadFile';
import {mobile} from '../../../core/components/layout/responsive';
import {FilePreview} from './upload-file/FilePreview';
import {useHistory} from 'react-router';
import {apiRequest} from '../../../core/functions/api-request';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {isStudentStillLoggedIn} from '../our-auth-flow';

const DocumentsSummary = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	padding-bottom: 20px;
	${mobile`
		display: block;
	`};
`;

const TableHeaderText = styled.span`
	font-weight: normal;
	font-size: 0.8125rem;
	color: #9c9c9c;
`;

const DocumentsRight = styled.div`
	flex: 3;
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

export const ModuleDocuments = (props) => {
	const history = useHistory();

	const {module: credit} = props;

	const [{files, loading, sortOption}, dispatch] = useReducer(reducer, {
		files: [],
		loading: false,
		sortOption: 'newest',
	});

	const clickLogin = () => {
		history.push('/login');
	};

	const [myDocuments, setMyDocuments] = useState<
		ExpandedPublicFileSharingDocument[]
	>([]);
	const fetchMyDocs = async (uni_identifier: string, university: Institution) => {
		try {
			const myDocuments: ExpandedPublicFileSharingDocument[] = await apiRequest(
				`/institution/${mapToUniSlug(
					university
				)}/module/${uni_identifier}/documents/mine`,
				{
					method: 'GET',
				}
			);
			setMyDocuments(myDocuments);
		} catch (e) {
			//
		}
	};

	const fetchDocs = useCallback(
		async (uni_identifier: string, institution: Institution) => {
			dispatch({type: 'fetchDocs'});
			const docs = await getDocumentsForCourse(
				institution,
				uni_identifier,
				sortOption
			);
			dispatch({type: 'setFiles', payload: docs.documents});
		},
		[sortOption]
	);

	useEffect(() => {
		if (isStudentStillLoggedIn()) {
			fetchMyDocs(credit.uni_identifier, credit.university);
		} else {
			setMyDocuments([]);
		}
		fetchDocs(credit.uni_identifier, credit.university);
	}, [fetchDocs, sortOption]);

	const deleteMyDocument = async (documentId: string) => {
		try {
			await apiRequest(`/documents/${documentId}`, {
				method: 'DELETE',
			});
			dispatch({type: 'deleteFile', payload: documentId});
		} catch (e) {
			//
		}
	};

	return (
		<div>
			<Container style={{paddingTop: 20}}>
				<DocumentsSummary>
					{/* <DocumentsLeft>
						<DocumentSortPicker
							sortOption={sortOption}
							setSortOption={(newSortOption: FileSortOption) =>
								dispatch({
									type: 'setFileSortOption',
									payload: newSortOption,
								})
							}
						/>
					</DocumentsLeft> */}

					<DocumentsRight>
						{isStudentStillLoggedIn() ? (
							<div
								style={{
									padding: 20,
								}}
							>
								<UploadFile
									uni_identifier={credit.uni_identifier}
									university={credit.university}
									onUpload={(file) => {
										dispatch({type: 'addFile', payload: file});
										fetchMyDocs(
											credit.uni_identifier,
											credit.university
										);
									}}
								/>
								{files.length === 0 ? (
									<div
										style={{
											width: '100%',
											textAlign: 'center',
											marginTop: 20,
										}}
									>
										<span style={{fontSize: 30}}>
											{'¯(°_o)/¯'}
										</span>
										<p>
											Ach! Niemand hat bis jetzt ein Dokument
											geteilt für dieses Modul - Sei die / der
											Erste!
										</p>
									</div>
								) : (
									<table
										style={{
											width: '100%',
											marginTop: 20,
											tableLayout: 'fixed',
											borderCollapse: 'collapse',
										}}
									>
										<thead>
											<tr>
												<th
													align="left"
													style={{
														width: '60%',
														borderBottom:
															'1px solid #eee',
													}}
												>
													<TableHeaderText>
														Name
													</TableHeaderText>
												</th>
												<th
													align="left"
													style={{
														width: '14%',
														borderBottom:
															'1px solid #eee',
													}}
												>
													<TableHeaderText>
														Grösse
													</TableHeaderText>
												</th>
												<th
													align="left"
													style={{
														width: '16%',
														borderBottom:
															'1px solid #eee',
													}}
												>
													<TableHeaderText>
														Datum
													</TableHeaderText>
												</th>
												<th
													align="left"
													style={{
														width: '10%',
														borderBottom:
															'1px solid #eee',
													}}
												></th>
											</tr>
										</thead>
										<tbody>
											{files.map((f) => {
												let isMyDocument =
													myDocuments.find(
														(d) => d._id === f._id
													) !== undefined;

												return (
													<FilePreview
														file={f}
														canDelete={isMyDocument}
														onDeleted={(id) => {
															deleteMyDocument(id);
														}}
													/>
												);
											})}
										</tbody>
									</table>
								)}
							</div>
						) : (
							<div style={{padding: 40}}>
								<h3 style={{margin: 0}}>Du bist nicht angemeldet</h3>
								<p style={{marginTop: 10, marginBottom: 0}}>
									Melde dich{' '}
									<span
										onClick={clickLogin}
										style={{
											textDecoration: 'underline',
											color: 'blue',
											cursor: 'pointer',
										}}
									>
										hier
									</span>{' '}
									an und teile noch heute Dateien mit deinen
									Kommilitonen!
								</p>
							</div>
						)}
					</DocumentsRight>
				</DocumentsSummary>
			</Container>
		</div>
	);
};
