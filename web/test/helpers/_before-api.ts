import {ObjectID} from 'mongodb';
import {UZH} from '../../../core/models/university';
import {peopleCollection, roomCollection} from '../../src/db/collections';
import {connectToMongo} from '../../src/db/modern';
import {addDemoModule} from './_add-demo-module';
import {beforeEach} from './_hooks';

const beforeApiTest = async (t) => {
	await beforeEach(t);
	await connectToMongo();
	await peopleCollection().insertOne({
		uni_identifier: '12345678',
		name: 'Jonny Burger',
		university: UZH,
		title: '',
		_id: ObjectID.createFromTime(Date.now()),
	});
	await roomCollection().insertOne({
		university: UZH,
		name: 'AND-3-44',
		id: '50331324',
		location: {
			longitude: 8.548717,
			latitude: 47.413167,
		},
		plan_dimensions: null,
		subtitle: '',
		building: null,
		campus: 'Irchel',
		plan: 'https://www.plaene.uzh.ch/floormaps/AND_3.png',
	});
	t.context.app.listen(t.context.port);
	await addDemoModule();
};

export default beforeApiTest;
