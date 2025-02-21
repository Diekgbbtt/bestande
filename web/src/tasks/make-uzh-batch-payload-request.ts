const makePayloadWithRequest = (request: string) => {
	return request;
};

const makeFilter = (obj: {[key: string]: string}) => {
	const filters: string[] = [];
	const keys = Object.keys(obj);
	for (const key of keys) {
		filters.push(`${key} eq '${obj[key]}'`);
	}

	return filters.join(' and ');
};

export const makeQuery = (query: {
	expand?: string;
	filter?: {
		PiqYear: number;
		PiqSession: string;
	};
	inlinecount?: string;
	skip?: number;
	top?: number;
	orderby?: string;
}) => {
	const params: string[] = [];
	const keys = Object.keys(query);
	for (const key of keys) {
		let value = query[key];
		if (key === 'filter') {
			value = makeFilter(value);
		}

		params.push(`$${key}=${encodeURIComponent(value).replace(/'/g, '%27')}`);
	}

	return params.join('&');
};

export const listPayload = (top = 20, skip = 0, query = {}) => {
	const finalQuery = {
		skip,
		top,
		orderby: 'SmStext asc',
		...query,
	};
	const request = `SmSearchSet?${makeQuery(finalQuery)}`;
	return makePayloadWithRequest(request);
};

export const detailPayload = (
	moduleID: string | number,
	year: string | number,
	session: string
) => {
	const expand = [
		'Partof',
		'Organizations',
		'Responsible',
		'Events',
		'Events/Persons',
		'OfferPeriods',
	].join(',');
	const request = `SmDetailsSet(SmObjId='${moduleID}',PiqYear='${year}',PiqSession='${session}')?$expand=${encodeURIComponent(
		expand
	)}`;
	return makePayloadWithRequest(request);
};

export const eventPayload = (moduleID, year, session) => {
	const query = {
		expand:
			'Rooms,Persons,Schedule,Schedule/Rooms,Schedule/Persons,Modules,Links',
	};
	const request = `EDetailsSet(EObjId='${moduleID}',PiqYear='${year}',PiqSession='${session}')?${makeQuery(
		query
	)}`;
	return makePayloadWithRequest(request);
};

export const roomPayload = (roomId, year, session) => {
	const request = `GDetailsSet(GObjid='${roomId}',PiqYear='${year}',PiqSession='${session}')`;
	return makePayloadWithRequest(request);
};
