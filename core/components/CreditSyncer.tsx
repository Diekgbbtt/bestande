import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
	NewNonceNotification,
	SocketChatMessageTypes,
} from '../actions/chat-server';
import {fetchServerNonce, getCourses, syncCourses} from '../functions/api';
import {getVisibleCredits} from '../functions/Credits';
import {getCredit} from '../functions/get-credit';
import {getStatusFromGrade} from '../functions/get-status-from-grade';
import {getUserHash} from '../functions/get-user-hash';
import {makeModuleCollection} from '../functions/make-module-collection';
import {useAppState} from '../functions/use-app-state';
import {periodToString} from '../functions/uzh-period';
import {persistClientNonce} from '../logic/sync-persistance';
import {Override, setOverride} from '../reducers/creditOverrides';
import {setModules} from '../reducers/moduleCollection';
import {store} from '../reducers/store';
import {setClientNonce, setServerNonce} from '../reducers/sync';

export const CreditSyncer = () => {
	const chatInstance = useAppState((state) => state.chatServer.chatInstance);

	const hash = useAppState((s) => getUserHash(s, null));
	const clientNonce = useAppState((s) => s.sync.clientNonce as number);
	const serverNonce = useAppState((s) => s.sync.serverNonce);
	const dispatch = useDispatch();

	const fetchNonce = useCallback(async () => {
		try {
			const {nonce} = await fetchServerNonce(hash);
			dispatch(setServerNonce(nonce));
		} catch (err) {
			console.log('no user token', err);
		}
	}, [dispatch, hash]);

	useEffect(() => {
		if (serverNonce === null) {
			fetchNonce();
		}
	}, [dispatch, fetchNonce, hash, serverNonce]);

	useEffect(() => {
		persistClientNonce(clientNonce);
	}, [clientNonce]);

	const pushCourses = useCallback(async () => {
		const credits = getVisibleCredits(store.getState());
		const res = await syncCourses(credits, hash, clientNonce);
		console.log(res);
	}, [clientNonce, hash]);

	const pullCourses = useCallback(async () => {
		const {courses, nonce} = await getCourses(hash);
		const map = courses.map((c) => {
			return {
				course: c,
				credit: getCredit(
					store.getState(),
					c.uni_identifier,
					periodToString(c.period),
					c.university
				),
				mod: makeModuleCollection({
					uni_identifier: c.uni_identifier,
					university: c.university,
					name: c.name,
					credits_worth: c.credits,
					period: c.period,
					short_name: c.short_name,
				}),
			};
		});
		dispatch(
			setModules(
				map.map((c) => {
					return c.mod;
				})
			)
		);

		map.forEach((course) => {
			const status = getStatusFromGrade(course.course.grade);
			const newOverride: Override = {
				grade: course.course.grade ?? null,
				period: course.course.period,
				status: getStatusFromGrade(course.course.grade),
				credits_received: status === 'PASSED' ? course.course.credits : 0,
			};
			dispatch(setOverride(course.credit, newOverride, 'pull'));
		});
		dispatch(setClientNonce(nonce));
	}, [dispatch, hash]);

	const compare = useCallback(async () => {
		if (clientNonce === null || serverNonce === null) {
			return;
		}

		console.log({clientNonce, serverNonce});
		if (clientNonce > serverNonce) {
			pushCourses();
			console.log('Client has newer version. uploading...');
		} else if (serverNonce > clientNonce) {
			pullCourses();
			console.log('Server has newer version. downloading...');
		} else {
			console.log('same version on client and server, not doing anything');
		}
	}, [clientNonce, pullCourses, pushCourses, serverNonce]);

	const onNewNonce = useCallback(
		(payload: NewNonceNotification) => {
			dispatch(setServerNonce(payload.newNonce));
		},
		[dispatch]
	);

	// Listen to new changes
	useEffect(() => {
		if (chatInstance === null) {
			return;
		}

		chatInstance.on(SocketChatMessageTypes.NEW_NONCE, onNewNonce);

		return () => {
			chatInstance.off(SocketChatMessageTypes.NEW_NONCE, onNewNonce);
		};
	}, [chatInstance, onNewNonce]);

	// Check if push / pull necessary
	useEffect(() => {
		compare();
	}, [clientNonce, compare, serverNonce]);
	return null;
};
