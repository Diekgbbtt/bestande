import {Credit, Institution} from '../../../core/models/credit';
import {ETH, UZH} from '../../../core/models/university';
import {Book} from '../../../core/types/books';

const supportedUnis = [UZH, ETH] as Institution[];

export const fetchRecommendedBooks = async (credits: Credit[]): Promise<Book[]> => {
	// const [activeNonCustomCredits] = partition(
	// 	credits,
	// 	(c) => isCreditBooked(c) && !c.custom
	// );
	// const groupedByUnis = groupBy(activeNonCustomCredits, (c) =>
	// 	CreditHelpers.getInstitution(c)
	// );
	// const unis = Object.keys(groupedByUnis).filter((u) =>
	// 	supportedUnis.includes(u as Institution)
	// ) as Institution[];

	// const results = await Promise.all(
	// 	unis.map(async (uni) => {
	// 		const identifiers = groupedByUnis[uni]
	// 			.map((i) => getModuleId(i))
	// 			.filter(truthy);
	// 		const result = await fetchBooks(identifiers, uni);
	// 		const books = await result.json();
	// 		if (!books.courses) {
	// 			return [];
	// 		}

	// 		return books.courses.map((course: Course) => {
	// 			return course.books.map(
	// 				(book): Book => {
	// 					return {
	// 						...book,
	// 						uni_identifier: course.id,
	// 						institution: getInstitutionByStudenttradeName(course.university),
	// 					};
	// 				}
	// 			) as Book[];
	// 		}) as Book[];
	// 	})
	// );
	// return flattenDeep(results);
	return [];
};
