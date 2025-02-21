import xns from 'xns';
import {ChatMessage} from '../core/actions/chat-server';
import {nextPeriod, previousPeriod} from '../core/functions/validate-period';
import {
	examReturnsCollection,
	messagesCollection,
} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

const period = 20202;

const falsePositives = [
	'a4b93699-0640-4399-a1ed-31d06355bd34',
	'77eb4a01-3b51-4064-aaff-31e01ba9f51b',
	'25c87b3f-6508-4bb6-80f5-ba8afce496a0',
	'f9e94db2-d1ad-474f-8018-ddb7395db441',
	'04cb09d2-f5e3-4f15-8a3e-04bef2ca08ab',
	'f1092001-9f63-456a-b1a8-dfdb301eb4a2',
	'bbc02765-58cb-475a-9bf3-191316e0142c',
	'b157536a-469d-4643-8dcd-4f831fe9a6a5',
	'cce67e25-190d-4a8f-9174-7f02110b9804',
	'6558205c-b6b5-4321-a0eb-2b979b2837eb',
	'9b6f6b9a-50f7-4f2b-b067-505c46d199c8',
	'95314f15-13e1-4240-b2e8-bae68e59e51e',
	'3a68b77f-81e3-410b-826f-30a6cfb4e658',
	'05e560dc-28e5-480b-bdb8-fbdae2979e39',
	'd8444975-8ca3-4097-9e3f-5988269b0739',
	'2cf091ed-c17b-43ef-822b-4fb397522724',
	'66cc71f9-0d9f-462e-90b4-c52062298f68',
	'4d63efb4-768b-463b-bf35-5b588b8f91f6',
	'2d181b4e-a3d5-4d31-919b-1f0960cab407',
	'3a504315-2ab9-43d1-adc6-2016489b847f',
	'4d242959-0c09-4ccd-9830-c0dbf5051697',
	'c8ac9bfa-2b7e-4241-a942-75cd340b64ad',
	'cda81a0e-04bb-4f2e-9587-3a0cdcb07d6d',
	'db2ce448-7699-4767-a76c-928356fd4f7a',
	'19a0f5a0-733b-49d8-bef7-cb22cc24518d',
	'4a3ec399-5b9a-48b6-a5a0-39300fb6c4af',
	'e6724ef4-fa79-4676-866e-f313f6a40a97',
	'6bf0562a-d896-4c20-9a26-fd2d22ca341f',
	'08fe6190-1abb-4c2a-8f0e-82961522a0d7',
	'a0ed6913-fa80-4768-9944-4c05c83400aa',
	'd29d995a-c44c-4734-b2cd-05c2a2ea9fae',
	'c081e430-9c13-4427-9328-96146cef2ebb',
	'0aced53b-2e15-4124-a60e-fc1d767806de',
	'8786a6c6-5612-46ba-b9d6-eb2e450f94aa',
	'a378f2e1-5010-49f9-9bb5-c1c6b32a54f6',
	'56d77913-b90a-4147-b2f3-2fd8d359f721',
	'6e6e071f-add5-446c-8430-51815f664d41',
	'5bc55583-69d1-4f67-8cae-eab58567188c',
	'e3c2abac-c68d-4f49-9973-db21fd4d129a',
	'8d951656-3c10-4d86-925d-de67312dd5c4',
	'24157421-495f-4d38-b682-31942ae9edf3',
	'b9b50e3f-9fb9-45aa-9c25-c5ce4bf43889',
	'128a5af6-9e44-429f-8419-4da0ff4e4b76',
	'1a01c724-692c-4107-b521-b164b37ffad1',
	'a855f578-31e3-4d29-8f88-342221f501a1',
	'74580f6a-eda5-4039-8597-404aa9b96652',
	'c1c11500-c09e-4682-9168-bdcd0f56ef81',
	'4b445d99-44d0-4f7b-ac7d-05aa32309397',
	'0c1496d5-10cb-4dc4-a639-6bf0d6bb7935',
	'ea1a14c1-6648-4322-be88-3bda723095fb',
	'a855f578-31e3-4d29-8f88-342221f501a1',
	'08ee2f81-d871-45ae-bfce-003235d5781a',
	'401a37ec-fa5c-4705-ab25-f7f894fc2e79',
	'b719b95b-6a71-4183-bdf1-dc4271fc5f5d',
	'788005a7-660f-4da1-bdb1-7bbd488ed6f0',
	'0df667cb-fd79-4398-bd32-54f5c9cfe05a',
	'10c434a7-551d-47d5-ae3a-5324ce2955e9',
	'0bce01e1-3a0e-4d12-84ee-e44848085216',
	'57323810-bcec-439d-af98-e04078649402',
	'ba239946-54df-447e-9eea-1e5b90c94978',
	'd3d24b18-f561-45cf-82d7-b4d08ce8b8aa',
	'dae44e27-24a1-484f-9b29-0b9db95b0ebc',
	'945e9967-4c30-4f05-9077-474716776a0a',
];

xns(async () => {
	await connectToMongo();
	const messages = messagesCollection()
		.find({
			text: /dusse|grades|draußen|draussen|online/,
		})
		.sort({
			createdAt: -1,
		});

	let i = 0;
	while (await messages.hasNext()) {
		const message = (await messages.next()) as ChatMessage;
		if (falsePositives.includes(message?._id as string)) {
			continue;
		}

		const examReturn = await examReturnsCollection().findOne({
			uni_identifier: message.uni_identifier,
			university: message.university,
			period: {$in: [period, previousPeriod(period), nextPeriod(period)]},
		});
		if (examReturn) {
			continue;
		}

		i++;
		console.log(`'${message._id}',`);
		console.log(message);
		if (i === 20) {
			process.exit(0);
		}
	}
});
