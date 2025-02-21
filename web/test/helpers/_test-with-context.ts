import anyTest, {TestInterface} from 'ava';
import {Server} from 'http';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Store} from 'redux';
import {App} from '../../../core/reducers';

export type TestContext = {
	api: string;
	dbName: string;
	userName: string;
	dbUrl: string;
	dbUri: string;
	port: number;
	mongoinstance: MongoMemoryServer;
	app: Server;
	parseDemo: (file: string) => any;
	parseStreetFood: () => any[];
	store: Store<ReturnType<typeof App>>;
};

export const test = anyTest as TestInterface<TestContext>;
