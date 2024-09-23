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

// Global vars
let menuOpen = false;

function refreshScrollTriggers() {
	window.fsAttributes = window.fsAttributes || [];

	// Helper function to refresh ScrollTrigger after a delay
	const refreshAfterRender = () => {
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 200);
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
				duration: 0.2,
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

			if (index === 0) toggleFaqItem(item, tl);
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
	if (!document.querySelector('[data-combine-posts="list"]')) return;

	// CMS Combine functionality
	window.fsAttributes.push([
		"cmscombine",
		(listInstances) => {
			// Access the first CMS list instance (if you have only one list)
			const listInstance = listInstances[0];

			// Listen for the 'renderitems' event to make sure all items are rendered
			listInstance.on("renderitems", (renderedItems) => {
				// Now that the items are rendered, we can safely adjust the styles
				const postsArray = document.querySelectorAll('[data-combine-posts="item"]');
				adjustPostsStyles(postsArray);
			});

			// Trigger the sort button click to apply sorting
			document.querySelector(".cms-sort-btn").click();
		},
	]);

	// Function to adjust the styles of posts
	const adjustPostsStyles = function (postsArray) {
		// Classes that we need to remove before applying new ones
		const headingClassesToRemove = ["title-style-xl", "title-style-l"];
		const descriptionClassesToRemove = ["title-style-s", "display-none"];
		const itemClassesToRemove = ["is-large", "is-small", "is-reverse", "display-none"];

		postsArray.forEach((post, index) => {
			// Remove previously added classes
			post.classList.remove(...itemClassesToRemove);
			post.querySelector(".home-posts_heading").classList.remove(...headingClassesToRemove);
			post.querySelector(".home-posts_description").classList.remove(...descriptionClassesToRemove);

			let headingClasses = [];
			let descriptionClasses = [];
			let itemClass = [];

			// Hide posts after the 5th one
			if (index >= 5) {
				itemClass.push("display-none");
			}

			// Large cards
			if (index === 0 || index === 3) {
				headingClasses.push("title-style-xl");
				descriptionClasses.push("title-style-s");
				itemClass.push("is-large");
			}
			// Small cards
			else if (index === 1 || index === 2 || index === 4) {
				headingClasses.push("title-style-l");
				descriptionClasses.push("display-none");
				itemClass.push("is-small");
			}

			// Add "is-reverse" class if index === 2
			if (index === 2) {
				itemClass.push("is-reverse");
			}

			// Add classes to the post element (spread the array of classes)
			post.querySelector(".home-posts_heading").classList.add(...headingClasses);
			post.querySelector(".home-posts_description").classList.add(...descriptionClasses);
			post.classList.add(...itemClass);
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
		postsArray.forEach((item, index) => {
			const postLayout = item.querySelector('[data-news-post="layout"]').textContent;
			const postTitle = item.querySelector('[data-news-post="title"]');

			// Set item styles depending on column
			if ((index + 1) % 3 === 1) {
				item.classList.add("news-list_left-col");
			} else if ((index + 1) % 3 === 2) {
				item.classList.add("news-list_middle-col");
			} else if ((index + 1) % 3 === 0) {
				item.classList.add("news-list_right-col");
			}

			// Set post heading style depending on layout
			if (postLayout === "Heading + Description") {
				postTitle.classList.add("title-style-s");
			} else if (postLayout === "Image + Heading") {
				postTitle.classList.add("title-style-s");
			} else {
				postTitle.classList.add("title-style-l");
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
		const postLayout = post.querySelector('[data-news-post="layout"]').textContent;
		const imageSize = post.querySelector('[data-news-post="image-size"]').textContent;
		const postDescription = post.querySelector('[data-news-post="description"]');
		const postImage = post.querySelector('[data-news-post="image"]');
		const isSpotlight = post.querySelector('[data-news-post="spotlight"]');

		// Set post layout from CMS
		if (postLayout === "Heading + Description") {
			postImage.classList.add("display-none");
		} else if (postLayout === "Image + Heading") {
			postDescription.classList.add("display-none");
		} else {
			postDescription.classList.add("display-none");
			postImage.classList.add("display-none");
		}

		function cardImageSize() {
			if (imageSize === "Small") {
				postImage.classList.add("is-small");
			} else if (imageSize === "Medium") {
				postImage.classList.add("is-medium");
			} else {
				postImage.classList.add("is-large");
			}
		}

		// Layout function is applied for spotlight only
		if (isSpotlight) {
			spotlightCardLayout();
		}

		// Image size function is applied only to regular news (!spotlight)
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
		const internalUrl = post.querySelector('[data-news-post="internal-url"]');
		const externalUrl = post.querySelector('[data-news-post="external-url"]');
		const postLinkWrap = post.querySelector('[data-news-post="link-wrap"]');
		let activeUrl = "";

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
	setTimeout(() => {
		let st = ScrollTrigger.create({
			trigger: ".section_solutions",
			pin: pinSection,
			start: "top bottom",
			end: "top top",
			pinSpacing: false,
		});
	}, 300);
}

function indexSpotlightSlider() {
	const swiperWrap = document.querySelector(".home-spotlights_mobile_spotlight-swiper");
	if (!swiperWrap) return;
	const swiper = new Swiper(swiperWrap, {
		// Optional parameters
		loop: false,
		slidesPerView: 2.2,
		spaceBetween: 32,
	});
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
});
