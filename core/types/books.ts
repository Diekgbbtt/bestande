import {Institution} from '../models/credit';

export type Book = {
	available: string;
	priceInFrancs: string;
	title: string;
	institution: Institution;
	uni_identifier: string;
};

export type Course = {
	id: string;
	university: string;
	books: Book[];
};
