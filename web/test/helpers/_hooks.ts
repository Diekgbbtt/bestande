import {ExecutionContext} from 'ava';
import getPort from 'get-port';
import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import randomstring from 'randomstring';
import {connectToMongo} from '../../src/db/modern';
import createApp from '../../src/server';
import {TestContext} from './_test-with-context';

const createMongoDB = async () => {
	const mongod = new MongoMemoryServer();
	const uri = await mongod.getUri();
	const dbName = await mongod.getDbName();

	const userName = 'bestande_test_user' + randomstring.generate(5);
	await new Promise<void>((resolve, reject) => {
		MongoClient.connect(
			uri,
			{useNewUrlParser: true, useUnifiedTopology: true},
			(err, client) => {
				if (err) {
					return reject(err);
				}

				client.db(dbName).addUser(
					userName,
					'test',
					{
						roles: [{role: 'readWrite', db: dbName}],
					},
					(err2) => {
						if (err2) {
							return reject(err2);
						}

						resolve();
					}
				);
			}
		);
	});
	return [uri, dbName, mongod];
};

export const beforeEach = async (t: ExecutionContext<TestContext>) => {
	let dbUri;
	let dbName;
	let instance;
	try {
		[dbUri, dbName, instance] = await createMongoDB();
	} catch (err) {
		t.fail(err);
	}

	t.context.dbUri = dbUri;
	t.context.dbName = dbName;
	t.context.mongoinstance = instance;
	process.env.MONGOURL = t.context.dbUri;
	await connectToMongo();
	t.context.port = await getPort();
	t.context.app = createApp();
	process.env.DOMAIN = `http://localhost:${t.context.port}`;
	t.context.api = `http://localhost:${t.context.port}/api`;
	global.alert = (err: string) => console.log(`[alert] ${err}`);
	global.confirm = () => true;
};

export const afterEach = async (t) => {
	await t.context.mongoinstance.stop();
};
