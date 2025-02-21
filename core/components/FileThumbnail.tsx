import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getAppearance} from '../functions/get-appearance';
import {getImageUrl} from '../functions/get-image-url';
import {useAppState} from '../functions/use-app-state';
import {UnifiedProgress} from './UnifiedProgress';

const Container = styled(View)``;

const Img = styled(Image)<{
	size: number;
}>`
	height: ${(props) => props.size}px;
	width: ${(props) => props.size}px;
`;

const ProgressLoader = styled(View)<{
	size: number;
}>`
	height: ${(props) => props.size}px;
	width: ${(props) => props.size}px;
	position: absolute;
	justify-content: center;
	align-items: center;
`;

export const FileThumbnail: React.FC<{
	s3Key: string;
	size: number;
}> = ({s3Key, size}) => {
	const theme = useAppState((state) => getAppearance(state.appearance));
	const [loaded, setLoaded] = useState(false);

	const source = useMemo(
		() => ({
			uri:
				getImageUrl({
					cdn_identifier: s3Key,
					width: 200,
					height: 'auto',
					crop: null,
				}) + `&border=3,${theme === 'dark' ? '99333333' : '99dddddd'}`,
		}),
		[s3Key, theme]
	);

	const onLoad = useCallback(() => setLoaded(true), []);

	return (
		<Container>
			{loaded ? null : (
				<ProgressLoader size={size}>
					<UnifiedProgress />
				</ProgressLoader>
			)}
			<Img resizeMode="contain" {...{onLoad, source, size}} />
		</Container>
	);
};
