// Safari 3.0+ "[object HTMLElementConstructor]"

const isSafari =
	/constructor/i.test(window.HTMLElement) ||
	(function(p) {
		return p.toString() === "[object SafariRemoteNotification]";
	})(
		!window["safari"] ||
			(typeof safari !== "undefined" && safari.pushNotification)
	);

export function getChromeVersion() {
	var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

	return raw ? parseInt(raw[2], 10) : false;
}

export default isSafari;
