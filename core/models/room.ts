import {Building} from '../data/uzh-buildings';
import {ImageSize} from '../types/types';
import {Institution} from './credit';
import {UZH} from './university';

export const getRoomSearchModel = (room: Room) => {
	return {
		university: room.university,
		name: room.name,
		id: room.id,
		location: room.location,
		plan: room.plan,
		subtitle: room.subtitle,
		campus: room.campus,
		plan_dimensions: room.plan_dimensions,
		address: room.address,
	};
};

class Room {
	university: Institution;
	name: string;
	id: string;
	location?: {
		longitude: number;
		latitude: number;
	} | null;

	plan: string | null;
	plan_dimensions: ImageSize | null;
	subtitle: string | null;
	campus: string | null;
	building: Building | null;
	address?: string;

	constructor(data = {}) {
		this.university = UZH;
		this.name = '';
		this.id = '';
		this.plan = null;
		this.plan_dimensions = null;
		this.subtitle = null;
		this.campus = null;
		Object.assign(this, data);
	}
}
export default Room;
