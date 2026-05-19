// import getCurrentAndroidVersion from 'current-android-app-version';
// import getCurrentIosVersion from 'current-ios-app-version';
import {Router} from 'express';
// import createError from 'http-errors';
// import groupBy from 'lodash/groupBy';
// import ms from 'ms';
// import {PlatformOSType} from 'react-native';
// import semver from 'semver';
// import semverSort from 'semver-sort';
// import {
// 	AppChangePlatform,
// 	changelog,
// 	Changelog,
// } from '../../../../core/data/changelog';
import {CoronaInfo} from '../../../../core/types/types';
import {asyncHandler} from '../../handlers';
// import {ANDROID_LINK, ITUNES_LINK} from '../../helpers/app-links';

const router = Router();

// DEPRECATED Mobile APPS
// let iosAppVersion: string | null = null;
// let androidAppVersion: string | null = null;

// const fetchVersions = async () => {
// 	try {
// 		[iosAppVersion, androidAppVersion] = await Promise.all([
// 			getCurrentIosVersion('1058948091'),
// 			getCurrentAndroidVersion('bestande.bestande'),
// 		]);
// 	} catch (err) {
// 		console.log('Could not fetch app ID', err);
// 	}
// };

// fetchVersions()
// 	.then(() => {
// 		console.log('New app versions fetched');
// 	})
// 	.catch((err) => {
// 		console.log('Error fetching new app versions', err);
// 	});
// setInterval(fetchVersions, ms('12h'));

// router.get(
// 	'/',
// 	asyncHandler<
// 		{
// 			query: {version: string; platform: PlatformOSType};
// 		},
// 		{
// 			upToDate: boolean;
// 			link?: string;
// 			warning: string | null;
// 			warningColor: string;
// 		}
// 	>(async (request) => {
// 		const {version, platform} = request.query;
// 		if (!['ios', 'android', 'web'].includes(platform)) {
// 			throw createError(400, 'Invalid platform');
// 		}

// 		if (!semver.valid(version)) {
// 			throw createError(400, 'Invalid version');
// 		}

// 		let warning: string | null = null;
// 		if (platform === 'ios' && version === '2.15.3') {
// 			warning =
// 				'**Update verfügbar**: In dieser Version existiert ein Fehler, welches das Login verhindert. Lade das Update auf 2.15.4 herunter und logge dich erneut ein.';
// 		}

// 		if (
// 			platform === 'ios' &&
// 			iosAppVersion &&
// 			semver.gt(iosAppVersion, version)
// 		) {
// 			return {
// 				upToDate: false,
// 				link: ITUNES_LINK,
// 				warning,
// 				warningColor: '#fffce5',
// 			};
// 		}

// 		if (
// 			platform === 'android' &&
// 			androidAppVersion &&
// 			semver.gt(androidAppVersion, version)
// 		) {
// 			return {
// 				upToDate: false,
// 				link: ANDROID_LINK,
// 				warning,
// 				warningColor: '#fffce5',
// 			};
// 		}

// 		return {
// 			upToDate: true,
// 			warning,
// 			warningColor: '#fffce5',
// 		};
// 	})
// );

router.get(
	'/corona',
	asyncHandler(
		async (): Promise<CoronaInfo> => {
			return {
				timetableBanner: null,
				mainViewBanner: null,
				cancellationDeadlineBanner: null,
			};
		}
	)
);

// router.get(
// 	'/versions',
// 	asyncHandler<
// 		{},
// 		{
// 			ios: string | null;
// 			android: string | null;
// 		}
// 	>(async () => {
// 		return {
// 			ios: iosAppVersion,
// 			android: androidAppVersion,
// 		};
// 	})
// );

// router.get(
// 	'/changelog',
// 	asyncHandler<
// 		{
// 			query: {
// 				platform: AppChangePlatform;
// 			};
// 		},
// 		Changelog
// 	>(async (request) => {
// 		const {platform} = request.query;
// 		if (!['ios', 'android', 'web'].includes(platform)) {
// 			throw createError(400, 'Invalid platform');
// 		}

// 		const filteredByPlatform = changelog.filter(
// 			(c) => c.platform.includes(platform) || request.query.platform === 'web'
// 		);
// 		const grouped = groupBy(filteredByPlatform, (g) => g.version);
// 		const versions = Object.keys(grouped);
// 		const sorted = semverSort.desc(versions) as string[];
// 		const changeLogResponse: Changelog = sorted.map((s) => {
// 			return {
// 				version: s,
// 				changes: grouped[s],
// 			};
// 		});
// 		return changeLogResponse;
// 	})
// );

export default router;
