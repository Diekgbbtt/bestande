import {Router as router} from 'express';
import {getCourses} from './get-courses';
import {getNonce} from './get-nonce';
import {getPreferences} from './get-preferences';
import {setCourses} from './set-courses';

export const accountRouter = router();

accountRouter.post('/preferences', getPreferences);
accountRouter.get('/nonce', getNonce);
accountRouter.get('/courses', getCourses);
accountRouter.post('/courses', setCourses);
