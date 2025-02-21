import {WithId} from 'mongodb';
import {ChatMessage} from '../../../core/actions/chat-server';
import {DatabaseUser} from '../../../core/actions/users';
import {ModuleCollectionItem} from '../../../core/models/credit';
import {Impression} from '../../../core/models/impression-type';
import Module from '../../../core/models/module';
import {PromotionResponse} from '../../../core/models/promotion';
import {FileSharingDocument} from '../../../core/types/file-sharing-document';
import {DbMealPicture} from '../../../core/types/food';
import {EventType, RawPerson, RoomType} from '../../../core/types/schedule';
import {ExamReturnStatistic, Job} from '../../../core/types/types';
import Rating from '../models/rating';
import {modern} from './modern';
import { DatabaseStudent } from './students';

export const moduleCollectionCollection = () =>
	modern().collection<ModuleCollectionItem>('modulecollection');
export const moduleCollection = () => modern().collection<Module>('modules');
export const userCollection = () =>
	modern().collection<DatabaseUser>('chatusers');
export const messagesCollection = () =>
	modern().collection<ChatMessage>('chatmessages');
export const examReturnsCollection = () =>
	modern().collection<ExamReturnStatistic>('examreturns');
export const ratingsCollection = () => modern().collection<Rating>('ratings');
export const roomCollection = () => modern().collection<RoomType>('rooms');
export const eventCollection = () => modern().collection<EventType>('events');
export const promotionsCollection = () =>
	modern().collection<PromotionResponse>('promotions');
export const documentsCollection = () =>
	modern().collection<WithId<FileSharingDocument>>('documents');
export const moduleCacheCollection = () => modern().collection<any>('module');
export const impressionsCollection = () =>
	modern().collection<Impression>('impressions');
export const taskCollection = () => modern().collection<Job<any>>('task');
export const peopleCollection = () => modern().collection<RawPerson>('people');
export const mealPictureCollection = () =>
	modern().collection<DbMealPicture>('mealpictures');
export const eduwoCollection = () => modern().collection('eduworating');
export const studentsCollection = () => modern().collection<DatabaseStudent>('students');
