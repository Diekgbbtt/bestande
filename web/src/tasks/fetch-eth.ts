import cheerio from 'cheerio';
import findPackageJson from 'find-package-json';
import fs from 'fs';
import got from 'got';
import pThrottle from 'p-throttle';
import path from 'path';
import slugify from 'slugify';

const rootPackage = findPackageJson(__dirname).next().filename as string;

const map = new Map();

const gotThrottled = pThrottle({
	interval: 1100,
	limit: 1,
})(got);

const snapShotFolder = path.join(rootPackage, '..', 'eth-snapshots');

if (!fs.existsSync(snapShotFolder)) {
	fs.mkdirSync(snapShotFolder);
}

const retryConfig = {
	retries: (ret: number) => {
		if (ret >= 4) {
			return 0;
		}

		return 1000 * 2 ** ret + Math.random() * 100;
	},
};

const getWithSnapshot = async (
	url: string,
	throttle: boolean,
	options: got.GotBodyOptions<null> = {}
) => {
	const urlSlug = slugify(url).substr(0, 250); // macOS file name limit
	const cacheFile = path.join(snapShotFolder, `${urlSlug}.html`);
	if (process.env.TEST && fs.existsSync(cacheFile)) {
		return fs.promises.readFile(cacheFile, 'utf-8');
	}

	const response = await (throttle ? gotThrottled : got)(url, {
		...options,
		retry: retryConfig,
		cache: map,
	});
	await fs.promises.writeFile(cacheFile, response.body);
	return response.body;
};

export const fetchModule = async (
	moduleID: string,
	semester: string,
	throttle: boolean
): Promise<string> => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/lerneinheit.view?semkez=${semester}&ansicht=ALLE&lerneinheitId=${moduleID}&lang=de`,
		throttle
	);

	if (/Bitte starten Sie eine neue Suche/.exec(body.toString())) {
		throw new Error('Not found');
	}

	return body.toString();
};

export const fetchPerson = async (
	personId: string,
	semester: string,
	throttle: boolean
) => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/dozentPre.do?dozide=${personId}&ansicht=1&semkez=${semester}&lang=de`,
		throttle
	);

	if (/Bitte starten Sie eine neue Suche/.exec(body.toString())) {
		throw new Error('Not found');
	}

	return body;
};

export const fetchEventSeries = async (
	eventSeriesId: string,
	semester: string
) => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/lehrveranstaltungPre.do?semkez=${semester}&lehrveranstaltungId=${eventSeriesId}&lang=de`,
		true
	);
	if (/Fehler in der Applikation Vorlesungsverzeichnis/.exec(body.toString())) {
		throw new Error('Not found:' + eventSeriesId);
	}

	return body;
};

export const fetchStartTime = async (startTimeId: string, semester: string) => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/belegungsseriePre.do?semkez=${semester}&belegungsserieId=${startTimeId}&lang=de`,
		true
	);

	if (/Bitte starten Sie eine neue Suche/.exec(body.toString())) {
		throw new Error('Not found');
	}

	return body;
};

export const fetchListPage = async (semester: string, page = 1) => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/sucheLehrangebot.do?seite=${page}&semkez=${semester}`,
		true
	);
	const pageContent = cheerio
		.load(body.toString())('.pagination li')
		.eq(0)
		.contents()
		.filter((i, p) => p.type === 'text')
		.text()
		.trim()
		.replace(/\s/g, '');
	const match = /Seite([0-9]+)von([0-9]+)/.exec(pageContent);
	if (!match) {
		throw new Error('no match');
	}

	const [, current, total] = match;

	if (parseInt(current, 10) > parseInt(total, 10)) {
		throw new Error('More than last page');
	}

	return [parseInt(total, 10), body];
};

export const fetchDepartmentPage = async (
	semester: string,
	departmentId: string,
	page = 1
) => {
	const body = await getWithSnapshot(
		`http://www.vvz.ethz.ch/Vorlesungsverzeichnis/sucheLehrangebot.view?lang=de&semkez=${semester}&studiengangTyp=&deptId=${departmentId}&studiengangAbschnittId=&lerneinheitstitel=&lerneinheitscode=&famname=&rufname=&wahlinfo=&lehrsprache=&katalogdaten=&_strukturAus=on&seite=${page}`,
		true
	);
	const pageContent = cheerio
		.load(body.toString())('.pagination li')
		.eq(0)
		.contents()
		.filter((i, p) => p.type === 'text')
		.text()
		.trim()
		.replace(/\s/g, '');

	const match = /Seite([0-9]+)von([0-9]+)/.exec(pageContent);

	if (!match) {
		throw new Error('no match');
	}

	const [, current, total] = match;

	if (parseInt(current, 10) > parseInt(total, 10)) {
		throw new Error('More than last page');
	}

	return {total: parseInt(total, 10), body};
};

export const fetchRoom = async (roomId: string): Promise<string> => {
	const parts = roomId.split('-');
	const body = await getWithSnapshot(
		`http://www.mapsearch.ethz.ch/map.do?gebaeudeMap=${parts[0]}&farbcode=c010&lang=de`,
		true,
		{
			headers: {
				Cookie: 'msSessionid=test',
			},
		}
	);
	return body.toString();
};
