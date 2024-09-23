import "./custom-styles.css"; // Custom CSS import
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicGrid from "magic-grid";
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Split JS
import SplitType from "split-type";

// Global vars
let menuOpen = false;

function refreshScrollTriggers() {
	window.fsAttributes = window.fsAttributes || [];

	// Helper function to refresh ScrollTrigger after a delay
	const refreshAfterRender = () => {
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 300);
	};

	// CMS Load Callback
	window.fsAttributes.push([
		"cmsload",
		(listInstances) => {
			const [listInstance] = listInstances;
			listInstance.on("renderitems", (renderedItems) => {
				refreshAfterRender();
			});
		},
	]);

	// CMS Combine Callback
	window.fsAttributes.push([
		"cmscombine",
		(listInstances) => {
			const [listInstance] = listInstances;
			listInstance.on("renderitems", (renderedItems) => {
				refreshAfterRender();
			});
		},
	]);
}

function headerAnimation() {
	const header = document.querySelector(".header");
	if (!header) return;

	let lastScrollY = window.scrollY;

	let hideTl = gsap.timeline({
		paused: true,
	});

	hideTl.to(header, {
		y: "-100%",
		duration: 0.3,
		ease: "power2.inOut",
		onComplete: () => {
			header.classList.add("is-scroll");
		},
	});

	ScrollTrigger.create({
		start: "top top",
		end: "100px top", // Background change persists beyond 100px
		onLeaveBack: () => {
			header.classList.remove("is-scroll");
		},
	});

	window.addEventListener("scroll", () => {
		if (menuOpen) return;
		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY) {
			hideTl.play();
		} else {
			hideTl.reverse();
		}

		lastScrollY = currentScrollY;
	});
}

function headerMenuAnimation() {
	const menuWrap = document.querySelector(".menu");
	if (!menuWrap) return;

	// Elements
	const menuButtons = document.querySelectorAll('[data-menu="toggle"]');
	const menuCloseBtn = document.querySelector("#menu-close-btn");
	const menuContentWrap = document.querySelector(".menu_container");
	const hamburgerBtn = document.querySelector(".nav-bar_hamburger");

	let openTl = gsap.timeline({ paused: true });
	openTl
		.to([menuWrap, menuContentWrap], {
			y: 0,
			duration: 1,
			ease: "power3.inOut",
		})
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
}

function mobileMenuAccordion() {
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

function careerCounter() {
	const careerList = document.querySelector(".career-list-count");
	const careerCounters = document.querySelectorAll(".career-counter-number");
	if (!careerList) return;

	const careerCount = careerList.querySelectorAll(".w-dyn-item").length;

	careerCounters.forEach((counter) => {
		counter.textContent = careerCount;
	});
}

function currentYear() {
	const yearPlaceholders = document.querySelectorAll(".dynamic-year");
	if (yearPlaceholders.length === 0) return;
	const year = new Date().getFullYear();

	yearPlaceholders.forEach((placeholder) => {
		placeholder.textContent = year;
	});
}

function combineIndexPosts() {
	let postsArray = document.querySelectorAll('[data-combine-posts="post"]');

	if (!postsArray) return;

	// CMS Combine functionality
	window.fsAttributes.push([
		"cmscombine",
		(listInstances) => {
			// Access the first CMS list instance (if you have only one list)
			const listInstance = listInstances[0];

			listInstance.on("renderitems", (renderedItems) => {
				// Now that the items are rendered, we can safely adjust the styles
				postsArray = document.querySelectorAll('[data-combine-posts="post"]');
				adjustPostsStyles(postsArray);
			});
			// Trigger the sort button click to apply sorting
			document.querySelector(".cms-sort-btn").click();
		},
	]);

	// Function to adjust the styles of posts
	const adjustPostsStyles = function (postsArray) {
		// Classes that we need to remove before applying new ones
		const headingClassesToRemove = ["title-style-xl", "title-style-l", "tablet-title-style-m", "mobile-title-style-s"];
		const descriptionClassesToRemove = ["title-style-s", "display-none", "tablet-body-style-m", "hide-mobile-landscape"];
		const itemClassesToRemove = ["is-large", "is-small", "is-reverse", "display-none", "hide-tablet"];

		postsArray.forEach((post, index) => {
			const postHeading = post.querySelector('[data-combine-posts="title"]');
			const postDescription = post.querySelector('[data-combine-posts="description"]');

			// Remove previously added classes
			post.classList.remove(...itemClassesToRemove);
			postHeading.classList.remove(...headingClassesToRemove);
			postDescription.classList.remove(...descriptionClassesToRemove);

			let headingClasses = [];
			let descriptionClasses = [];
			let itemClass = [];

			// Hide posts after the 5th one
			if (index >= 5) {
				itemClass.push("display-none");
			}
			// Show only 3 posts on tablet and lower
			if (index >= 3) {
				itemClass.push("hide-tablet");
			}
			if (index === 2) {
				itemClass.push("is-reverse");
			}

			// Large cards
			if (index === 0 || index === 3) {
				headingClasses.push("title-style-xl", "tablet-title-style-m", "mobile-title-style-s");
				descriptionClasses.push("title-style-s", "tablet-body-style-m", "hide-mobile-landscape");
				itemClass.push("is-large");
			}
			// Small cards
			else if (index === 1 || index === 2 || index === 4) {
				headingClasses.push("title-style-l", "tablet-title-style-s");
				descriptionClasses.push("display-none");
				itemClass.push("is-small");
			}

			// Add classes to the post element
			post.classList.add(...itemClass);
			postHeading.classList.add(...headingClasses);
			postDescription.classList.add(...descriptionClasses);
		});
	};
}

function newsMasonryGrid() {
	const masonryContainer = document.querySelector("#masonry-container");
	if (!masonryContainer) return;

	let page = 1;

	window.fsAttributes.push([
		"cmsload",
		(listInstances) => {
			// The callback passes a `listInstances` array with all the `CMSList` instances on the page.
			const [listInstance] = listInstances;

			// The `renderitems` event runs whenever the list renders items after switching pages.
			listInstance.on("renderitems", (renderedItems) => {
				magicGrid.positionItems();

				// Getting newly loaded posts so that we can style them later
				const allNewsPosts = document.querySelectorAll('[data-masonry-post="true"]');
				const loadedNewsPosts = Array.from(allNewsPosts).slice(page * 9);
				styleArchivePosts(loadedNewsPosts);
				newsPostLayout(loadedNewsPosts);
				newsPostUrl(loadedNewsPosts);
				page += 1;
			});
		},
	]);

	// Initiating instance of Magic Grid
	let magicGrid = new MagicGrid({
		container: "#masonry-container",
		animate: true,
		gutter: 0,
		static: true,
	});

	magicGrid.listen();

	const initialNewsPosts = document.querySelectorAll('[data-masonry-post="true"]');
	styleArchivePosts(initialNewsPosts);

	function styleArchivePosts(postsArray) {
		postsArray.forEach((post, index) => {
			const postLayout = post.querySelector('[data-news-post="layout"]').textContent;
			const postTitle = post.querySelector('[data-news-post="title"]');
			const isSpotlight = post.querySelector('[data-news-post="spotlight"]');

			// Setting separate title styles for spotlights
			function spotlightTitleSize() {
				postTitle.className = "";
				if (postLayout === "Heading + Description") {
					postTitle.classList.add("title-style-s", "tablet-title-style-xs");
				} else if (postLayout === "Image + Heading") {
					postTitle.classList.add("title-style-s", "tablet-title-style-xs");
				} else {
					postTitle.classList.add("title-style-l", "tablet-title-style-xs");
				}
			}

			// Post title sizes change only on news archive and only for spotlights (masonry runs only on archive)
			if (isSpotlight) {
				spotlightTitleSize();
			}
		});
	}
}

function newsPostLayout(newsPosts = null) {
	// Get page posts if no posts are passed from CMS pagination
	if (!newsPosts) {
		newsPosts = document.querySelectorAll('[data-news-post="post"]');
	}

	if (!newsPosts) return;

	newsPosts.forEach((post, index) => {
		// Set item styles from CMS
		const isSpotlight = post.querySelector('[data-news-post="spotlight"]');

		// Only runs if news post is spotlight
		function spotlightCardLayout() {
			// Get spotlight layout value from CMS field
			const spotlightLayout = post.querySelector('[data-news-post="layout"]').textContent;

			// Add additional spotlight class to set a different tablet/mobile style for spotlights
			post.classList.add("is-spotlight");

			if (spotlightLayout === "Heading + Description") {
				post.classList.add("is-heading-description");
			} else if (spotlightLayout === "Image + Heading") {
				post.classList.add("is-image-heading");
			} else {
				post.classList.add("is-heading");
			}
		}

		// Set image size for regular news from CMS values
		function cardImageSize() {
			// Get image size value from CMS field
			const imageSize = post.querySelector('[data-news-post="image-size"]').textContent;
			const postImage = post.querySelector('[data-news-post="image"]');

			if (imageSize === "Small") {
				postImage.classList.add("is-small");
			} else if (imageSize === "Medium") {
				postImage.classList.add("is-medium");
			}
		}

		if (isSpotlight) {
			spotlightCardLayout();
		}

		if (!isSpotlight) {
			cardImageSize();
		}
	});
}

// Function for news posts only because they can have internal/external url so need to dynamically set wrap url
function newsPostUrl(newsPosts = null) {
	if (!newsPosts) {
		newsPosts = document.querySelectorAll('[data-news-post="post"]');
	}
	if (newsPosts.length === 0) return;

	newsPosts.forEach((post) => {
		let activeUrl = "";
		const internalUrl = post.querySelector('[data-news-post="internal-url"]');
		const externalUrl = post.querySelector('[data-news-post="external-url"]');
		const postLinkWrap = post.querySelector('[data-news-post="link-wrap"]');

		if (!internalUrl.classList.contains("w-condition-invisible")) {
			activeUrl = internalUrl;
		} else if (!externalUrl.classList.contains("w-condition-invisible")) {
			activeUrl = externalUrl;
			postLinkWrap.setAttribute("target", "_blank");
		}

		if (activeUrl) {
			postLinkWrap.href = activeUrl;
			post.classList.add("has-url");
		}
	});
}

function sectionPinAnimation() {
	const pinSection = document.querySelector('[data-pin-section="true"]');
	if (!pinSection) return;

	let st = ScrollTrigger.create({
		trigger: ".section_solutions",
		pin: pinSection,
		start: "top bottom",
		end: "top top",
		pinSpacing: false,
	});
}

function indexSpotlightSlider() {
	const swiperWrap = document.querySelector(".home-spotlights_mobile_spotlight-swiper");
	if (!swiperWrap) return;

	const swiper = new Swiper(swiperWrap, {
		loop: false,
		slidesPerView: 1.2,
		spaceBetween: 32,
		breakpoints: {
			768: {
				slidesPerView: 2.2,
			},
		},
	});
}

function indexVideoReveal() {
	const videoBlocks = document.querySelectorAll('[data-video-reveal="video-block"]');
	if (videoBlocks.length === 0) return;

	const videoCount = videoBlocks.length;
	const randomNumber = Math.round(Math.random() * (videoCount - 1));
	const selectedVideoBlock = videoBlocks[randomNumber];
	const selectedOverlays = selectedVideoBlock.querySelectorAll(".home-hero_video-overlay");
	const selectedVideos = selectedVideoBlock.querySelectorAll(".home-hero_video");
	selectedVideoBlock.style.display = "flex";

	const tl = gsap.timeline({
		onComplete: () => {
			ScrollTrigger.refresh();
		},
	});
	tl.to(selectedOverlays, {
		x: "0%",
		duration: 0.8,
		ease: "power4.inOut",
	})
		.set(selectedVideos, {
			opacity: 1,
		})
		.to(
			selectedOverlays,
			{
				x: "100%",
				duration: 0.8,
				ease: "power4.inOut",
			},
			"+=0.2"
		)
		.fromTo(
			[".header", ".home-hero_icon", ".home-hero_bottom-content"],
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 1,
				stagger: 0.1,
			},
			"+=0.1"
		);
}

function textRevealAnimation() {
	let animationTargets = document.querySelectorAll('[data-text-reveal="wrap"]');
	if (animationTargets.length === 0) return;

	animationTargets.forEach((target) => {
		// Split text into chars for animation
		const animationText = target.querySelector('[data-text-reveal="text"]');
		const splitText = new SplitType(animationText);
		const animationChars = splitText.chars;

		// Create and insert text overlay into DOM
		const textOverlay = document.createElement("div");
		textOverlay.className = "text-animation_overlay";
		target.appendChild(textOverlay);

		// Animate overlay
		const tl = gsap.timeline();
		tl.to(textOverlay, {
			x: "0%",
			duration: 0.8,
			ease: "power4.inOut",
		})
			.set(animationText, {
				opacity: 1,
			})
			.to(
				textOverlay,
				{
					x: "100%",
					duration: 0.8,
					ease: "power4.inOut",
				},
				"+=0.2"
			)
			.fromTo(
				animationChars.slice(1),
				{
					x: (i, target) => {
						return (-0.1 * i) / 2 + "em";
					},
				},
				{
					x: "0px",
					duration: 0.8,
					ease: "power3.out",
					stagger: {
						each: 0.02,
					},
				},
				"<+0.2"
			);
	});
}

function relatedPostsSwiper() {
	const relatedPostsWrap = document.querySelector(".related-posts_wrap");
	if (!relatedPostsWrap) return;

	const breakpoint = window.matchMedia("(max-width: 767px)");
	let swiper = null;

	breakpoint.addEventListener("change", (event) => {
		if (event.matches) {
			initSwiper();
		} else {
			if (swiper) {
				swiper.destroy(true, true);
			}
		}
	});

	function initSwiper() {
		swiper = new Swiper(relatedPostsWrap, {
			modules: [Navigation, Pagination],
			slidesPerView: 1,
			spaceBetween: 20,
			pagination: {
				bulletClass: "related-posts_pagination-bullet",
				bulletActiveClass: "is-active",
				el: ".related-posts_pagination",
			},
			navigation: {
				nextEl: ".related-posts_btn-next",
				prevEl: ".related-posts_btn-prev",
			},
		});
	}

	// Try to init swiper when page loads
	if (breakpoint.matches) {
		initSwiper();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);
	refreshScrollTriggers();
	headerAnimation();
	headerMenuAnimation();
	mobileMenuAccordion();
	careerCounter();
	currentYear();
	combineIndexPosts();
	newsMasonryGrid();
	newsPostLayout();
	newsPostUrl();
	sectionPinAnimation();
	indexSpotlightSlider();
	indexVideoReveal();
	textRevealAnimation();
	relatedPostsSwiper();
});
