import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export function headerMenuAnimation() {
	const menu = document.querySelector('[data-menu="menu"]');
	if (!menu) return;

	let menuOpen = false;

	// Elements
	const menuWrap = document.querySelector('[data-menu="wrap"]');
	const menuOverlay = menu.querySelector('[data-menu="overlay"]');
	const menuButtons = document.querySelectorAll('[data-menu="toggle"]');
	const menuCloseBtn = document.querySelector("#menu-close-btn");
	const menuContentWrap = menu.querySelector(".menu_container");
	const hamburgerBtn = document.querySelector(".nav-bar_hamburger");

	let openTl = gsap.timeline({ paused: true });
	openTl
		.set(menu, { display: "block" })
		.to([menuWrap, menuContentWrap], {
			y: 0,
			duration: 1,
			ease: "power3.inOut",
		})
		.to(
			hamburgerBtn,
			{
				backgroundColor: "#1C1C1C",
				borderColor: "#1C1C1C",
				duration: 0.3,
			},
			"<0.12"
		)
		.to(
			".nav-bar_hamburger-line",
			{
				backgroundColor: "white",
				duration: 0.3,
			},
			"<"
		)
		.fromTo(
			".mask-item",
			{
				y: 100,
			},
			{
				y: 0,
				duration: 0.7,
				ease: "power2.out",
			},
			"<0.3"
		)
		.fromTo(
			".menu_nav-col",
			{
				opacity: 0,
				y: "24px",
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				ease: "power2.out",
				stagger: 0.1,
			},
			0.4
		);

	function toggleMenu() {
		if (!menuOpen) {
			menuOpen = true;
			hamburgerBtn.classList.add("is-open");
			openTl.play();
		} else {
			menuOpen = false;
			hamburgerBtn.classList.remove("is-open");
			openTl.reverse();
		}
	}

	menuButtons.forEach((btn) => {
		btn.addEventListener("click", toggleMenu);
	});

	menuOverlay.addEventListener("click", toggleMenu);
}

export function mobileMenuAccordion() {
	const navItems = document.querySelectorAll(".menu_nav-col");
	if (navItems.length === 0) return;

	let activeTl = null;
	let activeItem = null;

	navItems.forEach((item, index) => {
		const titleWrap = item.querySelector(".menu_nav-title-wrap");
		const accordionIcon = item.querySelector(".menu_nav-icon");
		const expandWrap = item.querySelector(".menu_expand-wrap");
		const navLinks = item.querySelectorAll(".menu_nav-link");

		let mm = gsap.matchMedia();
		mm.add("(max-width: 991px)", () => {
			const tl = gsap
				.timeline({
					paused: true,
					onComplete: () => {
						ScrollTrigger.refresh();
					},
				})
				.fromTo(
					expandWrap,
					{
						y: "32px",
						height: 0,
						autoAlpha: 0,
					},
					{
						y: "0px",
						height: "auto",
						autoAlpha: 1,
						duration: 0.5,
						ease: "power3.inOut",
					}
				)
				.fromTo(
					navLinks,
					{
						y: "24px",
						opacity: 0,
					},
					{
						y: "0px",
						opacity: 1,
						duration: 0.3,
						ease: "power3.inOut",
					},
					"<"
				)
				.to(
					accordionIcon,
					{
						duration: 0.5,
						rotation: 180,
						ease: "power3.inOut",
					},
					0
				);

			item.addEventListener("click", () => toggleFaqItem(item, tl));

			// Function to toggle faq items
			const toggleFaqItem = function (item, tl) {
				if (activeTl && activeTl !== tl) {
					activeTl.reverse();
					activeItem.classList.remove("is-open");
				}

				item.classList.toggle("is-open");
				item.classList.contains("is-open") ? tl.play() : tl.reverse();

				// Update currently active items
				activeTl = tl;
				activeItem = item;
			};
		});
	});
}

export function indexVideoReveal() {
	const videoBlocks = document.querySelectorAll('[data-video-reveal="video-block"]');
	if (videoBlocks.length === 0) return;

	const videoCount = videoBlocks.length;
	const randomNumber = Math.floor(Math.random() * videoCount); // Change to Math.floor
	const selectedVideoBlock = videoBlocks[randomNumber];
	const selectedOverlays = selectedVideoBlock.querySelectorAll(".home-hero_video-overlay");
	const selectedVideoWraps = selectedVideoBlock.querySelectorAll(".home-hero_video-wrap");
	const selectedVideos = selectedVideoBlock.querySelectorAll("video");
	const selectedThumbnails = selectedVideoBlock.querySelectorAll(".home-hero_video-thumbnail");

	selectedVideoBlock.style.display = "flex";

	let loadedVideos = 0;

	selectedVideos.forEach((videoEl) => {
		videoEl.play();
		videoEl.addEventListener("play", hideVideoThumbnail);
	});

	function hideVideoThumbnail() {
		loadedVideos++;
		if (loadedVideos < 2) return;

		gsap.set(selectedThumbnails, {
			opacity: 0,
		});

		// Remove the 'canplay' event listener from each video element
		selectedVideos.forEach((videoEl) => {
			videoEl.removeEventListener("canplay", hideVideoThumbnail);
		});
	}

	const tl = gsap.timeline({
		onComplete: () => {
			ScrollTrigger.refresh();
		},
	});

	tl.to(selectedOverlays, {
		x: "0%",
		duration: 1.2,
		ease: "custom",
		stagger: 0.15,
	})
		.to(
			".home-hero_icon",
			{
				x: 0,
				duration: 0.6,
				ease: "power2.out",
			},
			"<+0.8"
		)
		.set(selectedVideoWraps, {
			opacity: 1,
		})
		.to(selectedOverlays, {
			x: "100%",
			duration: 1.2,
			ease: "custom",
			stagger: 0.15,
		})
		.from(
			".home-hero_video",
			{
				scale: 1.4,
				duration: 2,
				ease: "custom",
			},
			"<+0.3"
		)
		.to(
			[".nav-bar_logo-link", ".button.is-white-bg", ".nav-bar_hamburger"],
			{
				y: 0,
				duration: 0.5,
				ease: "power2.out",
			},
			"-=1.2"
		)
		.to(
			[".home-hero_bottom-content", ".home-hero_top-bottom"],
			{
				opacity: 1,
				duration: 0.5,
			},
			"<"
		);
}

export function textRevealAnimation() {
	const animatedTexts = document.querySelectorAll('[data-text-reveal="text"]');
	if (!animatedTexts.length) return;

	animatedTexts.forEach((animatedText) => {
		const splitText = new SplitType(animatedText);

		const lines = animatedText.querySelectorAll(".line");

		lines.forEach((line) => {
			// Create and insert text overlay into DOM
			const textOverlay = document.createElement("div");
			textOverlay.className = "text-animation_overlay";
			line.appendChild(textOverlay);

			const words = line.querySelectorAll(".word");
			const chars = Array.from(line.querySelectorAll(".char"));

			// Animate overlay
			const tl = gsap.timeline();
			tl.to(textOverlay, {
				x: "0%",
				duration: 0.8,
				// ease: "power4.inOut",
				ease: "custom",
			})
				.set(words, {
					autoAlpha: 1,
				})
				.to(
					textOverlay,
					{
						x: "100%",
						duration: 0.8,
						// ease: "power4.inOut",
						ease: "custom",
					},
					"+=0.2"
				)
				.fromTo(
					chars.slice(1),
					{
						x: (i, target) => {
							return (-0.1 * i) / 2 + "em";
						},
					},
					{
						x: "0px",
						duration: 0.8,
						ease: "power3.out",
						// ease: "custom",
						stagger: {
							each: 0.01,
						},
					},
					"<+0.2"
				);
		});
	});
}
