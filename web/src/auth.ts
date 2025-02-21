import {Router} from 'express';
import passport from 'passport';
import {OAuth2Strategy, Profile} from 'passport-google-oauth';
import {getOwnDomain} from './domain';

const users = new Map<string, Profile>();

passport.use(
	new OAuth2Strategy(
		{
			clientID:
				'947417396845-nfe674betrulfv1i7crrgf67g0u3lfed.apps.googleusercontent.com',
			clientSecret: 'dEN0nGplr3TAtNRtZ1vzKKjr',
			callbackURL: `${getOwnDomain()}/auth/google/callback`,
		},
		(accessToken, refreshToken, profile, done) => {
			users.set(profile.id, profile);

			done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	const u = user as Profile;
	users.set(u.id, u);
	done(null, u.id);
});

passport.deserializeUser((id: string, done) => {
	if (!users.has(id)) {
		return done(new Error('Id'), null);
	}

	done(null, users.get(id));
});

export const authRouter = Router();

authRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/plus.login',
			'https://www.googleapis.com/auth/userinfo.email',
		],
	})
);

authRouter.get('/logout', (req, res) => {
	req.logOut();
	if (req.user) {
		users.delete((req.user as Profile).id);
	}

	res.redirect('/admin');
});

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
authRouter.get(
	'/google/callback',
	passport.authenticate('google', {failureRedirect: '/admin'}),
	(req, res) => {
		res.redirect('/admin');
	}
);
