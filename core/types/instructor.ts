import {ModuleType} from '../models/module-type';

export type Instructor = {
	important: boolean;
	id: string;
	type: ModuleType;
};

export type InstructorWithTypeArray = {
	important: boolean;
	id: string;
	type: ModuleType[];
};
