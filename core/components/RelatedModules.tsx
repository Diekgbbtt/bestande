import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {getRelatedModules} from '../functions/api';
import {formatString} from '../functions/format-string';
import {globalStyles} from '../functions/styles';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {RelatedResponse} from '../reducers/api';
import {DuotoneIcon, IconRow, IconRowLabel, VSpace} from './Base';
import {EmptyView} from './EmptyView';
import {Container} from './layout/container';
import {RelatedItemList} from './RelatedItemList';
import {SafeSideSpace} from './SafeSideSpace';
import {UnifiedProgress} from './UnifiedProgress';

type Props = {
	university: Institution;
	moduleId: string;
	name: string;
	totalCount: number;
};

export const RelatedModules = (props: Props) => {
	const [loading, setLoading] = React.useState<boolean>(true);
	const [data, setData] = React.useState<null | RelatedResponse>(null);
	const [err, setErr] = React.useState<null | Error>(null);

	const language = useLanguage();
	const appearance = useAppearance();

	React.useEffect(() => {
		getRelatedModules(props.university, props.moduleId)
			.then((related: RelatedResponse) => {
				setLoading(false);
				setData(related);
				setErr(null);
			})
			.catch((error) => {
				setLoading(false);
				setData(null);
				setErr(error.message);
			});
	}, [props.moduleId, props.university]);

	if (loading) {
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

	if (err) {
		return (
			<View>
				<Text>
					{rawStrings.ERROR[language]}: {err}
				</Text>
			</View>
		);
	}

	if (data === null || data.length === 0) {
		return (
			<Container
				style={{
					paddingTop: 30,
					backgroundColor: appearance.BACKGROUND,
					alignItems: 'center',
				}}
			>
				<EmptyView
					icon={require('../assets/clear.png')}
					text={rawStrings.RELATED_MODULES_NOT_FOUND[language]}
				/>
			</Container>
		);
	}

	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<SafeSideSpace>
				<VSpace />
				<RelatedItemList modules={data} totalCount={props.totalCount} />
				<View style={{height: 10}} />

				<IconRow>
					<DuotoneIcon
						style={{
							tintColor: appearance.BLUE_TINT,
						}}
						source={require('../assets/twotone_bookmarks_black_48dp.png')}
					/>
					<View style={globalStyles.flex1}>
						<IconRowLabel
							style={{
								color: appearance.SUBTITLE,
							}}
						>
							{formatString(
								rawStrings.RELATED_MODULES_EXPLAINER[language],
								props.name
							)}
						</IconRowLabel>
					</View>
				</IconRow>
				<View style={{height: 10}} />
				<IconRow>
					<DuotoneIcon
						style={{
							tintColor: appearance.BLUE_TINT,
						}}
						source={require('../assets/twotone_pie_chart_black_48dp.png')}
					/>
					<View style={globalStyles.flex1}>
						<IconRowLabel
							style={{
								color: appearance.SUBTITLE,
							}}
						>
							{formatString(
								rawStrings.CORRELATION_EXPLAINER[language],
								props.name
							)}
						</IconRowLabel>
					</View>
				</IconRow>
				<View style={{height: 20}} />
			</SafeSideSpace>
		</Container>
	);
};
