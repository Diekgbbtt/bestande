import got from 'got';
import md5 from 'md5';
import {SetUsernamePayload} from '../../../core/actions/users';
import {UZH} from '../../../core/models/university';
import {FileSharingUploadRequest} from '../../../core/types/file-sharing-document';
import {documentsCollection} from '../../src/db/collections';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach.always(afterEach);

test('Should not be able to add a file without setting a username', async (t) => {
	const payload: FileSharingUploadRequest = {
		token: '',
		uni_identifier: '50430354',
		university: UZH,
		fileName: 'my file name',
		s3Key: '',
		fileSize: 1234567890,
		mimeType: 'application/pdf',
		sendToChat: false,
	};
	try {
		await got.put(`${t.context.api}/documents`, {
			json: true,
			body: payload,
		});
		t.fail();
	} catch (err) {
		t.regex(err.body.error, /invalid md5 token/i);
		t.pass();
	}
});

test('Should be able to upload a file and then delete it', async (t) => {
	const randomMd5 = md5(String(Math.random()));
	const setUsernamePayload: SetUsernamePayload = {
		token: randomMd5,
		username: 'mensachiller123',
		appVersion: '2.2.0',
		language: 'de',
	};
	await got.post(`${t.context.api}/chat/username`, {
		json: true,
		body: setUsernamePayload,
	});
	const filePayload: FileSharingUploadRequest = {
		token: randomMd5,
		uni_identifier: '50430354',
		university: UZH,
		fileName: 'my file name',
		s3Key: 'myfile.pdf',
		fileSize: 1234567890,
		mimeType: 'application/pdf',
		sendToChat: false,
	};
	// Put successfully
	const response = await got.put(`${t.context.api}/documents`, {
		json: true,
		body: filePayload,
	});
	t.is(response.statusCode, 200);
	t.is(1, await documentsCollection().countDocuments());
	// Get document
	const doc = await got(
		`${t.context.api}/documents/${response.body.data.document._id}`,
		{
			json: true,
		}
	);
	t.is(doc.body.data.s3Key, filePayload.s3Key);
	t.is(doc.body.data.user.username, setUsernamePayload.username);
	t.is(doc.body.data.user.token, undefined);
	// Invalid delete
	try {
		await got.delete(
			`${t.context.api}/documents/${response.body.data.document._id}`,
			{
				json: true,
				body: {
					token: md5(String(Math.random())),
				},
			}
		);
		t.fail();
	} catch (err) {
		t.regex(err.body.error, /Unauthenticated/);
	}

	t.is(1, await documentsCollection().countDocuments());
	// Delete successfully
	const deleteResponse = await got.delete(
		`${t.context.api}/documents/${response.body.data.document._id}`,
		{
			json: true,
			body: {
				token: randomMd5,
			},
		}
	);
	t.true(deleteResponse.body.success);
	t.is(0, await documentsCollection().countDocuments());
});

test('Should be able to get the documents of a course', async (t) => {
	const randomMd5 = md5(String(Math.random()));
	const setUsernamePayload: SetUsernamePayload = {
		token: randomMd5,
		username: 'mensachiller123',
		appVersion: '2.2.0',
		language: 'de',
	};
	await got.post(`${t.context.api}/chat/username`, {
		json: true,
		body: setUsernamePayload,
	});
	const filePayload: FileSharingUploadRequest = {
		token: randomMd5,
		uni_identifier: '50430354',
		university: UZH,
		fileName: 'my file name',
		s3Key: 'myfile.pdf',
		fileSize: 1234567890,
		mimeType: 'application/pdf',
		sendToChat: false,
	};
	const response = await got.put(`${t.context.api}/documents`, {
		json: true,
		body: filePayload,
	});
	t.is(response.statusCode, 200);
	const courseDocuments = await got(
		`${t.context.api}/institution/uzh/module/50430354/documents?sort=newest`,
		{
			json: true,
		}
	);
	t.is(courseDocuments.body.data.documents.length, 1);
	t.is(
		courseDocuments.body.data.documents[0].user.username,
		setUsernamePayload.username
	);
	t.is(courseDocuments.body.data.documents[0].s3Key, 'myfile.pdf');
	t.is(courseDocuments.body.data.documents[0].user.token, undefined);
});
