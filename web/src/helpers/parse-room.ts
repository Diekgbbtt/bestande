const campuses: {[key: string]: string} = {
	'C1R,C2R,GLL,GLM,GLN,GLO,GLP,GLT,HAH,HAL,HIM,HAN,KIR,KO2,KOH,KOL,KUN,M2R,MEN,MOD,MOL,MOO,P5R,PED,PEL,PLB,PLC,PLD,PLE,PLF,PLM,RAI,RAK,RAL,SNA,SOA,SOB,SOC,SOD,SOE,SOG,SOM,TEL,ZUA,ZUB,ZUG,ZUI':
		'Zentrum',
	'AFL-,BIN-,AND-': 'Oerlikon',
	'Y,TAS,TAT,TBA,TBS,TBT,TDE,TDI,TFA,TKK,TKL,TLZ,TNS,TNU,TOP,TPB,TPE,TPV,TQP,TQS,TRE,TSA,TSB,TSC,TSL,TWF,TWW':
		'Irchel',
	'WAF,WAD,WAE,WAA': 'Schlieren',
};

const parseRoomName = (
	name: string
): {
	name: string;
	subtitle: string | null;
	campus: string | null;
} => {
	let subtitle: string | null = null;
	let campus: string | null = null;
	// Remove 06xx
	name = name.replace(/06xx/g, '');
	name = name.replace(/04xx/g, '');
	const parenthesisText = name.match(/(\(.*\))/g);
	if (parenthesisText) {
		subtitle = parenthesisText[0].substr(1, parenthesisText[0].length - 2);
		name = name.replace(/\(.*\)/g, '');
	}

	if (name.includes('Seminarraum')) {
		subtitle = 'Seminarraum';
		name = name.replace(/Seminarraum/g, '');
	}

	if (name.includes('Kursräume')) {
		subtitle = 'Kursräume';
		name = name.replace(/Kursräume/g, '');
	}

	if (name.includes('Konferenzraum')) {
		subtitle = 'Konferenzraum';
		name = name.replace(/Konferenzraum/g, '');
	}

	if (name.includes('Hörsaal')) {
		subtitle = 'Hörsaal';
		name = name.replace(/Hörsaal/g, '');
	}

	if (name.includes('Sitzungszimmer')) {
		subtitle = 'Sitzungszimmer';
		name = name.replace(/Sitzungszimmer/g, '');
	}

	if (name.includes('Praktikumsraum mit Computer')) {
		subtitle = 'Praktikumsraum mit Computer';
		name = name.replace('Praktikumsraum mit Computer', '');
	}

	if (name.includes('Praktikumsraum/Laborraum')) {
		subtitle = 'Praktikumsraum/Laborraum';
		name = name.replace('Praktikumsraum/Laborraum', '');
	}

	if (name.includes('Kleiner Hörsaal')) {
		subtitle = 'Kleiner Hörsaal';
		name = name.replace('Kleiner Hörsaal', '');
	}

	if (name.includes('Grosser Hörsaal')) {
		subtitle = 'Grosser Hörsaal';
		name = name.replace('Grosser Hörsaal', '');
	}

	if (name.includes('(Prakt. Phys.Ch. Biologen')) {
		subtitle = 'Prakt. Phys.Ch. Biologen';
		name = name.replace('(Prakt. Phys.Ch. Biologen', '');
	}

	if (name.includes('Workshopraum/Spezialraum')) {
		subtitle = 'Workshopraum/Spezialraum';
		name = name.replace('Workshopraum/Spezialraum', '');
	}

	if (name.includes('Kantonsschule Freudenberg')) {
		campus = 'Kantonsschule Freudenberg';
		name = name.replace(/Kantonsschule Freudenberg/g, '');
	}

	if (name.includes('Kantonsschule Wetzikon')) {
		campus = 'Kantonsschule Wetzikon';
		name = name.replace(/Kantonsschule Wetzikon/g, '');
	}

	if (name.includes("Kantonsschule Rychenberg W'thur")) {
		campus = 'Kantonsschule Rychenberg Winterthur';
		name = name.replace(/Kantonsschule Rychenberg W'thur/g, '');
	}

	Object.keys(campuses).forEach((cmpses) => {
		if (
			cmpses.split(',').some((prefix) => {
				return name.startsWith(prefix);
			})
		) {
			campus = campuses[cmpses];
		}
	});
	return {
		name: name.trim(),
		subtitle: subtitle ? subtitle.trim() : null,
		campus,
	};
};

export default parseRoomName;
