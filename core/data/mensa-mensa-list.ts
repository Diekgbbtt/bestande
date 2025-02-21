import {truthy} from '../functions/truthy';
import ethMensi from './eth-mensa';
import unifiedMensa from './unified-mensa';
import uzhMensa from './uzh-mensa';

export const mensaMensaList = () => {
	return [...unifiedMensa, ...uzhMensa, ...ethMensi].filter(truthy);
};
