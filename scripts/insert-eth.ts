import insertEth from '../web/src/tasks/update-eth-module';

insertEth({attrs: {data: {uni_identifier: '117956', semester: '2017W'}}})
	.then(console.log)
	.catch(console.error);
