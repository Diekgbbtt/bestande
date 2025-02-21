import groupBy from 'lodash/groupBy';
import React from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {ActivityIndicator, Alert, Text} from 'react-native-normalized';
// only /native works with web
import styled from 'styled-components/native';
import {AppChange, AppChangeType, Changelog} from '../data/changelog';
import {Config} from '../data/Config';
import {getChangelog} from '../functions/api';
import {Colors} from '../functions/Colors';
import {globalStyles} from '../functions/styles';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {VSpace} from './Base';
import {BlockText} from './BlockText';
import {ChangelogHeader} from './ChangelogHeader';
import {Container} from './layout/container';
import {SafeSideSpace} from './SafeSideSpace';

const Outer = styled(Config.IS_WEBSITE ? View : ScrollView)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

const VersionTitle = styled(Text)`
	font-size: 15px;
	font-weight: bold;
	color: ${(props) => props.theme.TITLE};
`;

const SingleVersionContainer = styled(View)`
	margin-top: 12px;
	padding-bottom: 5px;
	border-bottom-width: 1px;
	border-bottom-color: ${(props) => props.theme.BORDER_COLOR};
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	margin-top: 3px;
	font-size: 12px;
`;

const Badge = styled(View)`
	padding-left: 6px;
	padding-right: 6px;
	padding-top: 3px;
	padding-bottom: 3px;
	border-radius: 2px;
	margin-top: 10px;
	margin-bottom: 4px;
`;

const BadgeLabel = styled(Text)`
	color: white;
	font-size: 11px;
`;

const Row = styled(View)`
	flex-direction: row;
`;

const Flex1 = styled(View)`
	flex: 1;
`;

const AddedChangedRemovedBadge = ({type}: {type: AppChangeType}) => {
	const language = useLanguage();
	const color =
		type === AppChangeType.BUGFIX
			? Colors.Orange
			: type === AppChangeType.ADDED
			? Colors.Green
			: Colors.Red;
	const label =
		type === AppChangeType.BUGFIX
			? rawStrings.FIXED[language]
			: type === AppChangeType.ADDED
			? rawStrings.ADDED[language]
			: rawStrings.REMOVED[language];
	return (
		<Row>
			<Badge
				style={{
					backgroundColor: color,
				}}
			>
				<BadgeLabel>{label}</BadgeLabel>
			</Badge>
			<Flex1 />
		</Row>
	);
};

const SingleVersionChangelog = ({
	changes,
	version,
}: {
	version: string;
	changes: AppChange[];
}) => {
	const grouped = groupBy(changes, (c) => c.type);
	const groups = Object.keys(grouped);
	const language = useLanguage();
	const actualLanguage = language === 'en' ? 'en' : 'de';
	return (
		<SingleVersionContainer>
			<SafeSideSpace>
				<VersionTitle>{version}</VersionTitle>
				{groups.map((g) => {
					return (
						<View key={g}>
							<AddedChangedRemovedBadge type={g as AppChangeType} />
							{grouped[g].map((feature) => {
								return (
									<React.Fragment key={feature.description[actualLanguage]}>
										<BlockText text={feature.description[actualLanguage]} />
										{feature.credits ? (
											<Subtitle>
												{rawStrings.CREDITS_THANKS_TO[language]}{' '}
												{feature.credits.join(', ')}.
											</Subtitle>
										) : null}
										<VSpace />
										<VSpace />
									</React.Fragment>
								);
							})}
						</View>
					);
				})}
			</SafeSideSpace>
		</SingleVersionContainer>
	);
};

export const ChangelogView = () => {
	const [changelog, setChangelog] = React.useState<Changelog | null>(null);
	const language = useLanguage();
	const appearance = useAppearance();
	const fetchChangelog = React.useCallback(async () => {
		try {
			const log = await getChangelog(Platform.OS);
			setChangelog(log);
		} catch (err) {
			Alert.alert(rawStrings.ERROR[language] + ': ' + err.message);
		}
	}, [language]);
	React.useEffect(() => {
		fetchChangelog();
	}, [fetchChangelog]);
	return (
		<Outer style={globalStyles.flex1}>
			{Config.IS_WEBSITE ? <ChangelogHeader /> : null}
			<Container style={Config.IS_WEBSITE ? {flex: 0} : globalStyles.flex1}>
				<View>
					{changelog ? (
						<View style={globalStyles.flex1}>
							{changelog.map((v) => {
								return (
									<SingleVersionChangelog
										key={v.version}
										changes={v.changes}
										version={v.version}
									/>
								);
							})}
						</View>
					) : (
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								paddingTop: 40,
							}}
						>
							<ActivityIndicator color={appearance.SUBTITLE} />
						</View>
					)}
				</View>
			</Container>
		</Outer>
	);
};
