const isIOS = Boolean(
	navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
);
const isAndroid = Boolean(/android/i.test(navigator.userAgent));

if (window.location.origin.includes('app.jonny.io')) {
	if (isIOS) {
		window.location.href =
			'https://itunes.apple.com/sc/app/anysticker/id1427127826?mt=8';
	} else if (isAndroid) {
		window.location.href =
			'https://play.google.com/store/apps/details?id=jonnyburger.anysticker&utm_source=https://anysticker.app&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1';
	}
}
