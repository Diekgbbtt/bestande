import {NextFunction, Request, Response} from 'express';
import {WebUser} from '../../core/types/ratings';
import {connectToMongo} from './db/modern';

type ResponseCustom = Response & {
	status: (code: number) => ResponseCustom;
	json: (json: any) => void;
	headersSent: boolean;
	locals: any;
};

const errorHandler = (
	response: ResponseCustom,
	err: Error & {status?: number}
) => {
	const statusCode = err.status || 500;
	response.status(statusCode).json({
		success: false,
		error: err.message,
	});
};

const successHandler = (response: ResponseCustom, data: any) => {
	response.json({
		success: true,
		data,
	});
};

export type ExpressRequest = Pick<
	Request,
	Exclude<keyof Request, 'body' | 'params' | 'query' | 'user'>
> & {
	user?: WebUser;
	get: (hi: string) => string;
};

export function asyncHandler<Req, Res>(
	fn: (req: ExpressRequest & Req, res: ResponseCustom) => Promise<Res>
) {
	return async function (request: Request, response: ResponseCustom) {
		await connectToMongo();
		try {
			const data = await fn(
				(request as unknown) as ExpressRequest & Req,
				response
			);
			if (!response.headersSent) {
				successHandler(response, data);
			}
		} catch (err) {
			if (!process.env.TEST || !err.status) {
				if (err.status !== 404) {
					console.log(err);
				}
			}

			errorHandler(response, err);
		}
	};
}

export const asyncNextHandler = <Req>(
	fn: (
		req: ExpressRequest & Req,
		res: ResponseCustom,
		next: NextFunction
	) => Promise<void> | void
) => {
	return async function (
		request: Request,
		response: ResponseCustom,
		next: NextFunction
	) {
		try {
			await connectToMongo();
			await fn((request as unknown) as ExpressRequest & Req, response, next);
		} catch (err) {
			if (!process.env.TEST || !err.status) {
				console.log(err);
			}

			errorHandler(response, err);
		}
	};
};
