import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {UniversalState} from '../types/universalState';
import {truthy} from './truthy';

export const getUserPool = createSelector(
	[
		(state: UniversalState) => state.users.userProfile,
		(state: UniversalState) => state.users.otherUsers,
	],
	(profile, otherUsers) =>
		uniqBy([profile, ...otherUsers].filter(truthy), (user) => user.id)
);
