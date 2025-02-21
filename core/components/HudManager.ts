import {Hud} from './Hud';

let hud: Hud | null = null;

export class HudManager {
	static setHud(_hud: Hud) {
		hud = _hud;
	}

	static setHudContent({
		icon = require('../assets/check-hq.png'),
		label,
	}: {
		icon?: NodeRequire;
		label: string;
	}) {
		if (hud) {
			hud.setContent({icon, label});
			hud.show();
		}
	}
}
