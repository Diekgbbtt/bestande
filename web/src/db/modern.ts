import {Db, MongoClient} from 'mongodb';
import {connect} from './modules';
import {dbUrl} from './url';

const map: {[key: string]: Db} = {};

export const connectToMongo = async (): Promise<Db> => {
	const connectionString = dbUrl();
	if (!map[connectionString]) {
		const client = await MongoClient.connect(connectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		await connect(client);
		map[connectionString] = client.db();
	}

	return map[connectionString];
};

export const modern = (): Db => {
	return map[dbUrl()];
};

