import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisSidebarScroll } from "./smoothScroll";

export function refreshScrollTriggers() {
	window.fsAttributes = window.fsAttributes || [];

	// CMS Load Callback
	window.fsAttributes.push([
		"cmsload",
		(listInstances) => {
			const [listInstance] = listInstances;
			listInstance.on("renderitems", (renderedItems) => {
				setTimeout(() => {
					ScrollTrigger.refresh();
				}, 400);
			});
		},
	]);

	// CMS Combine Callback
	window.fsAttributes.push([
		"cmscombine",
		(listInstances) => {
			const [listInstance] = listInstances;

			if (!listInstance) {
				lenisSidebarScroll();
				return;
			}

			listInstance.on("renderitems", (renderedItems) => {
				setTimeout(() => {
					ScrollTrigger.refresh();
					if (!window.sidebarLenis) {
						lenisSidebarScroll();
					}
				}, 500);
			});
		},
	]);
}

export function currentYear() {
	const yearPlaceholders = document.querySelectorAll(".dynamic-year");
	if (yearPlaceholders.length === 0) return;
	const year = new Date().getFullYear();

	yearPlaceholders.forEach((placeholder) => {
		placeholder.textContent = year;
	});
}
