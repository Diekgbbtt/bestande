import {Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';

export const getStudentTradeUniversityBookName = (institution: Institution) => {
	if (institution === UZH) {
		return 'Universität%20Zürich';
	}

	if (institution === ETH) {
		return 'ETH%20Z%C3%BCrich';
	}
};

export const getInstitutionByStudenttradeName = (name: string): Institution => {
	if (name === 'ETH Zürich') {
		return ETH;
	}

	if (name === 'Universität Zürich') {
		return UZH;
	}

	return UZH;
};

export const fetchBooks = async (
	identifiers: string[],
	institution: Institution
) => {
	// return fetch(
	//     `https://www.studenttrade.ch/books_services/find?identifiers=${identifiers.join()}&university=${getStudentTradeUniversityBookName(
	//         institution
	//     )}`
	// );
	const mockResponse = {
		ok: true,
		json: () => Promise.resolve({}),
	};

	return Promise.resolve(mockResponse);
};
