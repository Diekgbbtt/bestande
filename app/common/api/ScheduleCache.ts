import {getModuleId} from '../../../core/functions/get-module-id';
import {schedulecacheKey} from '../../../core/functions/schedule-cache-key';
import {Credit} from '../../../core/models/credit';
import {UZH} from '../../../core/models/university';
import {ScheduleApiResponse} from '../../../core/types/schedule';
import {CacheStore} from './CacheStorage';
import {CreditSchedule, WrappedScheduleApiResponse} from './CreditSchedule';

const REQUIRED_VERSION = 16;
const CACHE_MINUTES = 1440; // 3 days

export class ScheduleCache {
	static set(
		credit: Credit,
		semester: string,
		schedule: WrappedScheduleApiResponse
	) {
		return CacheStore.set(
			schedulecacheKey(credit, semester),
			JSON.stringify(schedule),
			CACHE_MINUTES
		);
	}

	static get(credit: Credit, semester: string): Promise<string> {
		return CacheStore.get(schedulecacheKey(credit, semester));
	}

	static async getWithCache(
		credit: Credit,
		semester: string
	): Promise<ScheduleApiResponse> {
		const cachedSchedule = await ScheduleCache.get(credit, semester);
		if (cachedSchedule !== null) {
			const parsed: WrappedScheduleApiResponse = JSON.parse(cachedSchedule);
			if (this.isValid(parsed)) {
				return parsed.data;
			}
		}

		const body = await CreditSchedule(
			credit.institution || UZH,
			getModuleId(credit) as string,
			semester
		);
		if (!body.success) {
			return {
				data: [],
				gradesOut: null,
				version: REQUIRED_VERSION,
			};
		}

		const response = body.data;
		if (this.isValid(body)) {
			await this.set(credit, semester, body);
		}

		return response;
	}

	static isValid(parsed: WrappedScheduleApiResponse) {
		return parsed.data && parsed.data.version >= REQUIRED_VERSION;
	}
}
