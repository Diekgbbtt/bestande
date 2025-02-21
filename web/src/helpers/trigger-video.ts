import {Octokit} from '@octokit/rest';
import xns from 'xns';

export const triggerVideo = xns(
	async (
		messageIds: string[] = [
			'0ed77e51-11a1-497a-b5fa-63538f6cd0c8',
			'2c2c3099-4a57-48b3-ae8c-1b0ec2c35bb5',
		]
	) => {
		const octokit = new Octokit({
			auth: process.env.GITHUB_TOKEN,
		});

		await octokit.actions.createWorkflowDispatch({
			owner: 'JonnyBurger',
			repo: 'programmatic-stories',
			workflow_id: 'render-video.yml',
			ref: 'main',
			inputs: {
				messageIds: messageIds.join(','),
			},
		});
	}
);
