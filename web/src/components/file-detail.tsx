import format from 'date-fns/format';
import { mailTo as mailstring } from 'mailstring';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { match } from 'react-router';
import styled from 'styled-components';
import { VSpace } from '../../../core/components/Base';
import { Button, ButtonLabel } from '../../../core/components/BigButton';
import { FileThumbnail } from '../../../core/components/FileThumbnail';
import { Container } from '../../../core/components/layout/container';
import { UnifiedProgress } from '../../../core/components/UnifiedProgress';
import { addImpression, getDocument } from '../../../core/functions/api';
import { getCdnUrlWithOptions } from '../../../core/functions/get-image-url';
import { getUserHash } from '../../../core/functions/get-user-hash';
import { useIsomorphicState } from '../../../core/functions/use-app-state';
import { useAppearance } from '../../../core/functions/use-appearance';
import { Institution } from '../../../core/models/credit';
import { ExpandedPublicFileSharingDocument } from '../../../core/types/file-sharing-document';
import { NotFound } from './not-found';

const ThumbnailContainer = styled.div`
	display: flex;
	justify-content: center;
`;

const Statistic = styled.div`
	font-size: 16px;
	padding-bottom: 4px;
	padding-top: 4px;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
	text-align: center;
	font-size: 20px;
	font-weight: bold;
`;

const ReportLink = styled.a`
	font-size: 0.8em;
	margin-top: 30px;
`;

export const FileDetail: React.FC<{
	match: match<{
		fileId: string;
	}>;
}> = ({ match: { params } }) => {
	const appearance = useAppearance();
	const token = useIsomorphicState((state) => getUserHash(state, null));
	const { fileId } = params;
	const [file, setFile] = useState<any | null>(
		null
	);
	const [loaded, setLoaded] = useState<boolean>(false);

	const loadFile = useCallback(
		async (id: string) => {
			try {
				const res = await getDocument(id);
				setFile(res);
				addImpression({
					content: 'FILE',
					level: 'CLICK',
					identifier: token,
					content_id: fileId,
					platform: 'web',
					language: 'de',
					institution: file?.university as Institution,
				});
			} catch (err) {
				console.log(err);
			} finally {
				setLoaded(true);
			}
		},
		[file?.university, fileId, token]
	);

	useEffect(() => {
		loadFile(fileId);
	}, [fileId, loadFile]);

	const reportMail = useMemo(
		(): string =>
			mailstring('info@bestande.ch', {
				subject: 'Datei melden',
				body: `Die folgende Datei verstösst gegen das Urheberrecht / sonstiger Grund bitte nennen: \n\nhttps://bestande.ch/files/${fileId}`,
			}),
		[fileId]
	);

	const trackDownload = useCallback(() => {
		addImpression({
			content: 'FILE',
			level: 'CTA',
			identifier: token,
			content_id: fileId,
			platform: 'web',
			language: 'de',
			institution: file?.university as Institution,
		});
	}, [file?.university, fileId, token]);

	if (!file && loaded) {
		return <NotFound />;
	}

	if (!loaded) {
		// TODO remove redundancy with RelatedModules
		return (
			<View
				style={{
					paddingTop: 20,
					backgroundColor: appearance.BACKGROUND,
					flex: 1,
					justifyContent: 'center',
				}}
			>
				<UnifiedProgress />
			</View>
		);
	}

	if (!file) {
		return null;
	}

	return (
		<Container>
			<ThumbnailContainer>
				<FileThumbnail s3Key={file.s3Key as string} size={150} />
			</ThumbnailContainer>
			<Title>{file.fileName}</Title>
			<VSpace />
			<VSpace />

			<a
				href={getCdnUrlWithOptions(undefined, file.s3Key, {})}
				target="_blank"
				onClick={trackDownload}
			>
				<Button>
					<ButtonLabel>Öffnen</ButtonLabel>
				</Button>
			</a>
			<VSpace />

			<a
				href={getCdnUrlWithOptions(undefined, file.s3Key, { dl: file.fileName })}
				download={file.fileName}
				onClick={trackDownload}
			>
				<Button>
					<ButtonLabel>Herunterladen</ButtonLabel>
				</Button>
			</a>
			<VSpace />
			<VSpace />
			<Statistic>Grösse: {prettyBytes(file.fileSize)}</Statistic>
			<Statistic>Hochgeladen von {file.user.username}</Statistic>
			<Statistic>
				Hochgeladen am {format(file.uploaded, 'dd.MM.yyyy')}
			</Statistic>
			<Statistic>{file.stats.views} mal angesehen</Statistic>
			<Statistic>{file.stats.downloads} mal heruntergeladen</Statistic>

			<ReportLink href={reportMail}>Datei melden</ReportLink>
		</Container>
	);
};
