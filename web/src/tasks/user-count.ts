import got from 'got';
import ms from 'ms';
import xns from 'xns';
import {getActiveUsers} from '../db/active-users';

xns(async () => {
	const activeUsers = await getActiveUsers(ms('1d'));

	await got.post(
		`https://hackercompany.slack.com/services/hooks/slackbot?token=${process.env.SLACK_TOKEN}&channel=bestande-users`,
		{
			body: `There were ${activeUsers} users active in the last 24 hours.`,
		}
	);
});
