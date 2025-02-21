import {useCallback, useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {CountsTowardsAverage} from '../../../core/functions/CountsTowardsAverage';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getOnlyNumberIdentifier} from '../../../core/functions/get-only-number-identifier';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {persistGradeStatisticLastUploadedHashState} from '../../../core/logic/grade-opt/persistance';
import {
	setGradeStatisticsLastUploadState,
	setLastUploadHash,
} from '../../../core/logic/grade-opt/reducer';
import {Institution} from '../../../core/models/credit';
import {DOMAIN} from '../../../core/models/domain';
import {InsertGradePayload} from '../../../core/types/grade-statistics';

export const GradeOptManager: React.FC = () => {
	const credits = useAppState((state) => getVisibleCredits(state));
	const token = useAppState((state) => getUserHash(state, null));
	const optedIn = useAppState((state) => state.gradeOpt.optedIn);
	const lastHashState = useAppState((state) => state.gradeOpt.lastUploadHash);
	const dispatch = useDispatch();

	const creditsWithGrades = useMemo(() => {
		if (!optedIn) {
			return [];
		}

		return credits
			.filter((c) => c.status === 'PASSED' || c.status === 'FAILED')
			.filter((c) => !c.custom);
	}, [credits, optedIn]);

	const deleteAllFromServer = useCallback(async () => {
		const payload = {
			user: token,
		};
		const response = await fetch(`${DOMAIN}/grades`, {
			method: 'DELETE',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		console.log('deleted', await response.json());
	}, [token]);

	const sendToGradeServer = useCallback(async () => {
		if (creditsWithGrades.length > 0) {
			const payload = {
				user: token,
				grades: creditsWithGrades.map(
					(c): InsertGradePayload => {
						return {
							semester: c.semester as string,
							module: getOnlyNumberIdentifier(getModuleId(c)),
							grade: CountsTowardsAverage.parseGrade(c.grade) as number,
							institution: CreditHelpers.getInstitution(c) as Institution,
							// TODO: Good to hardcode repeated = false?
							repeated: false,
						};
					}
				),
			};
			const response = await fetch(`${DOMAIN}/grades`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log('uploaded', await response.json());
		} else {
			await deleteAllFromServer();
		}

		persistGradeStatisticLastUploadedHashState(lastHashState);

		dispatch(setGradeStatisticsLastUploadState(Date.now()));
	}, [creditsWithGrades, deleteAllFromServer, dispatch, lastHashState, token]);

	// Uploading effect
	useEffect(() => {
		const currentHash = creditsWithGrades
			.map((c) => {
				return [
					CreditHelpers.getInstitution(c),
					getModuleId(c),
					CountsTowardsAverage.parseGrade(c.grade),
					CreditHelpers.getSemester(c),
				].join(',');
			})
			.join('|');
		const lastHash = lastHashState.hash;
		if (currentHash !== lastHash) {
			dispatch(setLastUploadHash(currentHash));
			console.log('hash NOT the same, uploading', {currentHash, lastHash});
			sendToGradeServer();
		}
	}, [
		creditsWithGrades,
		deleteAllFromServer,
		dispatch,
		lastHashState,
		sendToGradeServer,
	]);

	// Persist once uploaded
	useEffect(() => {
		console.log('changed.persisting', lastHashState);
		persistGradeStatisticLastUploadedHashState(lastHashState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastHashState.lastUploded]);

	return null;
};
