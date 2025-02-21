import {Credit} from '../models/credit';

export type UzhLoginResponse = {
	demo?: boolean;
	version?: number;
	warning?: string | null;
	credits: Credit[];
	success: true;
	identity?: any;
};
