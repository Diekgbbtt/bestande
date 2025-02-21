import {combineReducers} from 'redux';
import {chatserverReducer} from '../../../core/reducers/chat-server';
import {examReturnsReducer} from '../../../core/reducers/exam-returns';
import {food} from '../../../core/reducers/food';
import {institution} from '../../../core/reducers/institution';
import {modals} from '../../../core/reducers/modals';
import {people} from '../../../core/reducers/people';
import {promotions} from '../../../core/reducers/promotions';
import {users} from '../../../core/reducers/users';
import {login} from '../../../core/reducers/web-login';
import {WebState} from '../../../core/types/web-state';
import {appearance} from './appearance';
import gradeStatistics from './grade-statistics';
import {language} from './language';
import {moduleRatings} from './moduleRatings';
import {modules} from './modules';
import {ratings} from './ratings';
import schedule from './schedule';

const app = combineReducers<WebState>({
	modules,
	login,
	people,
	promotions,
	gradeStatistics,
	ratings,
	moduleRatings,
	food,
	schedule,
	language,
	appearance,
	chatServer: chatserverReducer,
	users,
	modals,
	institution,
	examReturns: examReturnsReducer,
});

export default app;
