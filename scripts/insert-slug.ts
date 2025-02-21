import xns from 'xns';
import Module from '../core/models/module';
import {UZH} from '../core/models/university';
import {getByGuess, moduleAddSlug} from '../web/src/db/modules';

xns(async () => {
	const module = await getByGuess(UZH, '50430354');
	return moduleAddSlug(module as Module, 'game-theory');
});
