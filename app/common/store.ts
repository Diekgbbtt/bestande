if (process.env.NODE_ENV !== 'production') {
	global.XMLHttpRequest =
		// @ts-expect-error
		global.originalXMLHttpRequest || global.XMLHttpRequest;
	// @ts-expect-error
	global.FormData = global.originalFormData || global.FormData;

	// @ts-expect-error
	if (window.FETCH_SUPPORT) {
		// @ts-expect-error
		window.FETCH_SUPPORT.blob = false;
	} else {
		// @ts-expect-error
		global.Blob = global.originalBlob || global.Blob;
		// @ts-expect-error
		global.FileReader = global.originalFileReader || global.FileReader;
	}
}
