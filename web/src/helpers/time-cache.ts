function getTimeElapsed(prevTime) {
	const currentTime = new Date();
	const a = currentTime.getTime() - prevTime.getTime();

	return Math.floor(a);
}

export default class TimeCache {
	options: {
		validity: number;
	};

	entries: Map<string, any>;
	constructor(options = {validity: 1}) {
		this.options = options;
		this.entries = new Map();
	}

	sweep = () => {
		this.entries.forEach((entry, key) => {
			const v = entry.validity || this.options.validity;
			const delta = getTimeElapsed(entry.timestamp);
			if (delta > v) {
				this.entries.delete(key);
			}
		});
	};

	put = (key: string, value: any, validity: number = this.options.validity) => {
		if (!this.has(key)) {
			this.entries.set(key, {
				value,
				timestamp: new Date(),
				validity,
			});
		}
	};

	get = (key: string) => {
		this.sweep();

		if (this.entries.has(key)) {
			return this.entries.get(key).value;
		}

		throw new Error('key does not exist');
	};

	has = (key: string) => {
		this.sweep();
		return this.entries.has(key);
	};
}
