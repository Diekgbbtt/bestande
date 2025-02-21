import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import {doTelemetry} from '../../../core/functions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getCredit} from '../../../core/functions/get-credit';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {makeModuleCollection} from '../../../core/functions/make-module-collection';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {humanToPeriod} from '../../../core/functions/uzh-period';
import {Institution} from '../../../core/models/credit';
import {UZH} from '../../../core/models/university';
import {SemesterResponse} from '../../../core/reducers/api';
import {addModules} from '../../../core/reducers/moduleCollection';
import {getApiResponse} from '../api/get-api-response';
import {getConfig} from '../api/get-config';

const ModuleStatusButton = (props: {
	institution: Institution;
	moduleId: string;
	semester: string | null;
}) => {
	const apiResponse = useAppState((state) =>
		getApiResponse(state, props.institution, props.moduleId)
	);
	const semesterString =
		props.semester ||
		(apiResponse?.details?.semesters?.length
			? apiResponse.details.semesters[0].period_human
			: null);
	const credit = useAppState((state) =>
		getCredit(state, props.moduleId, semesterString, props.institution)
	);
	const creditInstitution = CreditHelpers.getInstitution(credit);
	const institutionSetting = useAppState(
		(state) => state.institution.institution
	);
	const username = useAppState((state) =>
		state.multiLogin[institutionSetting].loggedIn
			? state.multiLogin[institutionSetting].username
			: null
	);
	const hash = useAppState((state) => getUserHash(state, creditInstitution));
	const dispatch = useDispatch();
	const language = useLanguage();
	const appearance = useAppearance();
	const navigation = useNavigationInNative();
	const {details} = apiResponse;
	if (!details) {
		return null;
	}

	const config = () => {
		return getConfig(credit.status, language, appearance);
	};

	const {status, icon} = config();
	const inner = (
		<View
			style={{
				padding: 6,
				paddingRight: 9,
			}}
		>
			<Image
				style={{
					height: 22,
					width: 22,
					tintColor: 'white',
				}}
				source={icon ? icon : require('../assets/add.png')}
			/>
		</View>
	);
	if (!semesterString) {
		return null;
	}

	const semester = details.semesters.find(
		(s) => s.period === humanToPeriod(semesterString)
	) as SemesterResponse;
	return (
		<TouchableOpacity
			onPress={() => {
				if (status === 'NOT_BOOKED') {
					dispatch(
						addModules([
							makeModuleCollection({
								uni_identifier: props.moduleId,
								university: creditInstitution || UZH,
								period: humanToPeriod(semesterString) as number,
								name: details.name,
								short_name: details.short_name,
								credits_worth: semester.credits,
							}),
						])
					);
					doTelemetry(
						CreditHelpers.getInstitution(credit),
						[details],
						username as string,
						hash as string
					)
						.then(() => {
							// noop
						})
						.catch((err) => {
							console.log('telemetry failed', err);
						});
				}

				navigation.navigate('CreditConfiguration', {
					credit,
					showAddedIndicator: true,
				});
			}}
		>
			{inner}
		</TouchableOpacity>
	);
};

export default ModuleStatusButton;
