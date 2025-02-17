import Lenis from "lenis";
import { gsap } from "gsap";

export function lenisSmoothScroll() {
	window.mainLenis = new Lenis({
		lerp: 0.1,
		smooth: true,
	});

	// GSAP ticker for smooth scrolling
	gsap.ticker.add((time) => {
		window.mainLenis.raf(time * 1000);
	});

	// Disable lag smoothing in GSAP for immediate response
	gsap.ticker.lagSmoothing(0);
}

export function lenisSidebarScroll() {
	const sidebarElement = document.querySelector('[data-lenis-sidebar="wrap"]');
	if (!sidebarElement) return;
	const sidebarContent = sidebarElement.querySelector('[data-lenis-sidebar="content"]');

	// Check if the sidebar content is scrollable
	const isSidebarScrollable = sidebarContent.scrollHeight > sidebarElement.clientHeight;
	if (!isSidebarScrollable) return;

	// Initialize Lenis for sidebar if it has scrollable content
	window.sidebarLenis = new Lenis({
		wrapper: sidebarElement,
		content: sidebarContent,
		lerp: 0.1,
		smooth: true,
		overscroll: true,
	});

	// GSAP ticker for smooth scrolling
	gsap.ticker.add((time) => {
		if (window.sidebarLenis) {
			window.sidebarLenis.raf(time * 1000);
		}
	});
}
