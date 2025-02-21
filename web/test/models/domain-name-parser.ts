import {getDomainFromUrl} from '../../../core/functions/get-domain-from-url';
import {test} from '../helpers/_test-with-context';

test('Domain Name Parser', (t) => {
	t.is(
		getDomainFromUrl(
			'https://www.jobs.aldi.ch/news/details/?tx_ttnews%5Btt_news%5D=85&cHash=a432991c08368b22d00a9beda417f625'
		),
		'aldi.ch'
	);
});
