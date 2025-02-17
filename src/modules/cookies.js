export function cookiesPopup() {
	function applyCustomCode() {
		const preferenceCenter = document.querySelector(".cky-preference-center");
		if (!preferenceCenter) return;

		preferenceCenter.setAttribute("data-lenis-prevent", "");
		const closeImg = preferenceCenter.querySelector(".cky-btn-close img");
		const newCloseImage = "https://cdn.prod.website-files.com/66deddeed7fdcd89b6b4d6a7/672bc1e32815078091d25109_close.svg";
		closeImg.src = newCloseImage;
	}

	// Mutation observer to wait for cookieYes banner to load
	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				// Check if the cookie banner is now in the DOM
				if (document.querySelector(".cky-consent-container")) {
					applyCustomCode();
					observer.disconnect(); // Stop observing once the banner is found
					break;
				}
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}
