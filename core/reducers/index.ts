import {combineReducers} from 'redux';
import {gradeOptReducer} from '../logic/grade-opt/reducer';
import {ETH, UZH} from '../models/university';
import {apiReducer} from './api';
import {appearanceReducer} from './appearance';
import {chatserverReducer} from './chat-server';
import connectivity from './connectivity';
import {coronaReducer} from './corona';
import countsTowardsAverage from './countsTowardsAverage';
import countsTowardsCredits from './countsTowardsCredits';
import {creditOverridesReducer} from './creditOverrides';
import {customCredits} from './customCredits';
import {examReturnsReducer} from './exam-returns';
import {food} from './food';
import {instititionReducer as institutionGradeStatisticsReducer} from './grade-statistics';
import {hiddenContent} from './hiddenContent';
import {institution} from './institution';
import {language} from './language';
import {institionReducer as institutionLoginReducer} from './login';
import {modals} from './modals';
import {moduleCollection} from './moduleCollection';
import {moduleRatings} from './moduleRatings';
import {institutionReducer as institutionMyRatingsReducer} from './myRatings';
import {notifications} from './notifications';
import {people} from './people';
import {promotions} from './promotions';
import {ratings} from './ratings';
import {ready} from './ready';
import {room} from './room';
import {schedule} from './schedule';
import {selectedMessages} from './selected-messages';
import {seriesConfig} from './seriesConfig';
import {institutionReducer as institutionSummaryReducer} from './summary';
import {syncReducer} from './sync';
import {timetable} from './timetable';
import {users} from './users';

const multiLogin = combineReducers({
	UZH: institutionLoginReducer(UZH),
	ETH: institutionLoginReducer(ETH),
} as any);

const multiSummary = combineReducers({
	UZH: institutionSummaryReducer(UZH),
	ETH: institutionSummaryReducer(ETH),
} as any);

const multiMyRatings = combineReducers({
	UZH: institutionMyRatingsReducer(UZH),
	ETH: institutionMyRatingsReducer(ETH),
} as any);

const multiGradeStatistics = combineReducers({
	UZH: institutionGradeStatisticsReducer(UZH),
	ETH: institutionGradeStatisticsReducer(ETH),
} as any);

export const App = combineReducers({
	multiGradeStatistics,
	ready,
	creditOverrides: creditOverridesReducer,
	connectivity,
	countsTowardsAverage,
	countsTowardsCredits,
	schedule,
	seriesConfig,
	timetable,
	api: apiReducer,
	room,
	people,
	promotions,
	food,
	moduleCollection,
	institution,
	moduleRatings,
	ratings,
	multiLogin,
	multiSummary,
	multiMyRatings,
	hiddenContent,
	modals,
	chatServer: chatserverReducer,
	users,
	notifications,
	language,
	appearance: appearanceReducer,
	customCredits,
	examReturns: examReturnsReducer,
	corona: coronaReducer,
	gradeOpt: gradeOptReducer,
	sync: syncReducer,
	selectedMessages,
});
