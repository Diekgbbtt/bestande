import {WebUser} from '../../../core/types/ratings';

const admins = [
	'jonathanburger11@gmail.com',
	'mehmet@remotion.dev',
	'mehmet@jonny.io',
];
export const isUserAdmin = (user: WebUser | undefined | null): boolean => {
	if (!user) return false;
	return Boolean(
		user.emails.find((e) => admins.includes(e.value) && e.verified)
	);
};
