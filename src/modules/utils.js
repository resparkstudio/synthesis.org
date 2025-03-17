import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisSidebarScroll } from "./smoothScroll";

export function refreshScrollTriggers() {
	// Custom CMS Load Callback
	document.addEventListener(
		"fs-cmsload-ready",
		(event) => {
			const listInstances = event.detail.instances;
			const [listInstance] = listInstances;

			listInstance.on("renderitems", (renderedItems) => {
				setTimeout(() => {
					ScrollTrigger.refresh();
				}, 400);
			});
		},
		{ once: true }
	);

	// Custom CMS Combine Callback
	document.addEventListener(
		"fs-cmscombine-ready",
		(event) => {
			const listInstances = event.detail.instances;
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
		{ once: true }
	);
}

export function currentYear() {
	const yearPlaceholders = document.querySelectorAll(".dynamic-year");
	if (yearPlaceholders.length === 0) return;
	const year = new Date().getFullYear();

	yearPlaceholders.forEach((placeholder) => {
		placeholder.textContent = year;
	});
}

export async function initFinsweetAttributes() {
	await window.fsAttributes.destroy();

	// Initialize all attributes
	window.cmsloadInstances = await window.fsAttributes.cmsload.init();
	window.cmscombineInstances = await window.fsAttributes.cmscombine.init();
	window.cmssortInstances = await window.fsAttributes.cmssort.init();
	window.cmsfilterInstances = await window.fsAttributes.cmsfilter.init();

	// Dispatch event for cmsload
	if (window.cmsloadInstances && window.cmsloadInstances.length > 0) {
		const cmsloadEvent = new CustomEvent("fs-cmsload-ready", {
			detail: { instances: window.cmsloadInstances },
		});
		document.dispatchEvent(cmsloadEvent);
	}

	// Dispatch event for cmscombine
	if (window.cmscombineInstances && window.cmscombineInstances.length > 0) {
		const cmscombineEvent = new CustomEvent("fs-cmscombine-ready", {
			detail: { instances: window.cmscombineInstances },
		});
		document.dispatchEvent(cmscombineEvent);
	}

	// Dispatch event for cmssort
	if (window.cmssortInstances && window.cmssortInstances.length > 0) {
		const cmssortEvent = new CustomEvent("fs-cmssort-ready", {
			detail: { instances: window.cmssortInstances },
		});
		document.dispatchEvent(cmssortEvent);
	}

	// Dispatch event for cmsfilter
	if (window.cmsfilterInstances && window.cmsfilterInstances.length > 0) {
		const cmsfilterEvent = new CustomEvent("fs-cmsfilter-ready", {
			detail: { instances: window.cmsfilterInstances },
		});
		document.dispatchEvent(cmsfilterEvent);
	}
}
