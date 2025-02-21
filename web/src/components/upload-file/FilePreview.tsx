import React from 'react';
import styled from 'styled-components';
import {ExpandedPublicFileSharingDocument} from '../../../../core/types/file-sharing-document';
import prettyBytes from 'pretty-bytes';
import {format} from 'date-fns';
import {SvgIcon} from '@mui/material';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
	padding-left: 15px;
	padding-right: 15px;
	border-style: solid;
	border-width: 1px;
	border-color: lightgray;
	border-radius: 5px;
`;

const Filename = styled.h3`
	max-width: 400px;
	font-size: 13px;
	text-align: start;
	color: #000000;
	padding: 0;
`;

const FileSubtitle = styled.h4`
	color: #000000;
	font-size: 11px;
	padding: 0;
`;

const TableRow = styled.tr`
	height: 2.5625rem;
	:hover {
		background-color: rgba(46, 204, 113, 0.05);
		border-bottom: 1px solid rgba(46, 204, 113, 0.2);
	}
	border-bottom: 1px solid #eee;
`;

const TableData = styled.td`
	padding: 0;
	font-size: 0.8rem;
`;

export const FilePreview: React.FC<{
	file: ExpandedPublicFileSharingDocument;
	canDelete: boolean;
	onDeleted: (id: string) => void;
}> = ({file, canDelete, onDeleted}) => {
	return (
		<TableRow>
			<TableData>
				<span style={{color: ' #2ecc71'}}>{file.fileName}</span>
			</TableData>
			<TableData>{prettyBytes(file.fileSize)}</TableData>
			<TableData>{format(file.uploaded, 'dd.MM.yyyy')}</TableData>
			<TableData>
				{canDelete ? (
					<SvgIcon
						onClick={() => onDeleted(file._id)}
						style={{
							margin: 5,
							width: 25,
							height: 25,
							cursor: 'pointer',
						}}
					>
						<svg>
							<path
								d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
								fill="#dd2e44"
							/>
						</svg>
					</SvgIcon>
				) : null}
				<a
					href={`https://bestande.fra1.cdn.digitaloceanspaces.com/${file.s3Key}`}
					download={file.fileName}
				>
					<SvgIcon
						style={{
							margin: 5,
							width: 25,
							height: 25,
						}}
					>
						<svg>
							<path
								d="M12 14L11.6464 14.3536L12 14.7071L12.3536 14.3536L12 14ZM12.5 5C12.5 4.72386 12.2761 4.5 12 4.5C11.7239 4.5 11.5 4.72386 11.5 5L12.5 5ZM6.64645 9.35355L11.6464 14.3536L12.3536 13.6464L7.35355 8.64645L6.64645 9.35355ZM12.3536 14.3536L17.3536 9.35355L16.6464 8.64645L11.6464 13.6464L12.3536 14.3536ZM12.5 14L12.5 5L11.5 5L11.5 14L12.5 14Z"
								fill="#2ecc71"
								id="path1"
							/>
							<path
								d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
								fill="#00000000"
								strokeWidth={2}
								stroke="#2ecc71"
								id="path2"
							/>
						</svg>
					</SvgIcon>
				</a>
			</TableData>
		</TableRow>
	);
};

