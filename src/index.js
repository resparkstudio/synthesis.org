import "./custom-styles.css"; // Custom CSS import
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicGrid from "magic-grid";
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
// Split JS
import SplitType from "split-type";

// Global vars
let menuOpen = false;
let mainLenis;
let sidebarLenis;

function lenisSmoothScroll() {
	mainLenis = new Lenis({
		lerp: 0.1,
		smooth: true,
	});

	// GSAP ticker for smooth scrolling
	gsap.ticker.add((time) => {
		mainLenis.raf(time * 1000);
	});

	// Disable lag smoothing in GSAP for immediate response
	gsap.ticker.lagSmoothing(0);
}

function lenisSidebarScroll() {
	const sidebarElement = document.querySelector('[data-lenis-sidebar="wrap"]');
	if (!sidebarElement) return;
	const sidebarContent = sidebarElement.querySelector('[data-lenis-sidebar="content"]');

	// Check if the sidebar content is scrollable
	const isSidebarScrollable = sidebarContent.scrollHeight > sidebarElement.clientHeight;
	if (!isSidebarScrollable) return;

	// Initialize Lenis for sidebar if it has scrollable content
	sidebarLenis = new Lenis({
		wrapper: sidebarElement,
		content: sidebarContent,
		lerp: 0.1,
		smooth: true,
		overscroll: true,
	});

	// GSAP ticker for smooth scrolling
	gsap.ticker.add((time) => {
		if (sidebarLenis) {
			sidebarLenis.raf(time * 1000);
		}
	});
}

function refreshScrollTriggers() {
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
					if (!sidebarLenis) {
						lenisSidebarScroll();
					}
				}, 500);
			});
		},
	]);
}

function headerMenuAnimation() {
	const menu = document.querySelector('[data-menu="menu"]');
	if (!menu) return;

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
	const careerList = document.querySelector('[data-career-count="list"]');
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

	if (!postsArray.length) return;
	window.fsAttributes = window.fsAttributes || [];

	// CMS Combine functionality
	window.fsAttributes.push([
		"cmscombine",
		(listInstances) => {
			// Access the first CMS list instance (if you have only one list)
			const listInstance = listInstances[0];

			if (!listInstance) {
				adjustPostsStyles(postsArray);
				return;
			}

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
	window.fsAttributes = window.fsAttributes || [];
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

	magicGrid.onPositionComplete(() => {
		ScrollTrigger.refresh();
	});
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

function indexSpotlightSlider() {
	const swiperWrap = document.querySelector(".home-spotlights_mobile_spotlight-swiper");
	if (!swiperWrap) return;

	const swiper = new Swiper(swiperWrap, {
		loop: false,
		slidesPerView: 1.2,
		speed: 500,
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
	const randomNumber = Math.floor(Math.random() * videoCount); // Change to Math.floor
	const selectedVideoBlock = videoBlocks[randomNumber];
	const selectedOverlays = selectedVideoBlock.querySelectorAll(".home-hero_video-overlay");
	const selectedVideoWraps = selectedVideoBlock.querySelectorAll(".home-hero_video-wrap");
	const selectedVideos = selectedVideoBlock.querySelectorAll("video");
	const selectedThumbnails = selectedVideoBlock.querySelectorAll(".home-hero_video-thumbnail");

	selectedVideoBlock.style.display = "flex";

	let loadedVideos = 0;

	selectedVideos.forEach((videoEl) => {
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
		ease: "power4.inOut",
		stagger: 0.15,
	})
		.to(
			".home-hero_icon",
			{
				x: 0,
				duration: 0.6,
				ease: "power2.out",
			},
			"<+0.6"
		)
		.set(selectedVideoWraps, {
			opacity: 1,
		})
		.to(selectedOverlays, {
			x: "100%",
			duration: 1.2,
			ease: "power4.inOut",
			stagger: 0.15,
		})
		.from(
			".home-hero_video",
			{
				scale: 1.4,
				duration: 2,
				ease: "power3.out",
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
			"-=0.9"
		)
		.to(
			".home-hero_bottom-content",
			{
				opacity: 1,
				duration: 0.5,
			},
			"<"
		);
}

function textRevealAnimation() {
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
				ease: "power4.inOut",
			})
				.set(words, {
					autoAlpha: 1,
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
						stagger: {
							each: 0.01,
						},
					},
					"<+0.2"
				);
		});
	});
}

function mobileOnlySwiper() {
	const swiperTargets = document.querySelectorAll('[data-mobile-swiper="target"]');
	if (swiperTargets.length === 0) return;

	const breakpoint = window.matchMedia("(max-width: 767px)");

	swiperTargets.forEach((swiperTarget) => {
		const swiperName = swiperTarget.getAttribute("data-swiper-name");

		let swiper = null;
		const wrapper = swiperTarget.querySelector('[data-mobile-swiper="wrap"]');
		const slides = swiperTarget.querySelectorAll('[data-mobile-swiper="slide"]');

		// Find navigation and pagination elements relted to the specific swiperTarget
		const paginationEl = document.querySelector(`[data-swiper-pagination="${swiperName}"]`);
		const nextBtn = document.querySelector(`[data-swiper-next="${swiperName}"]`);
		const prevBtn = document.querySelector(`[data-swiper-prev="${swiperName}"]`);

		function addSwiperClasses() {
			wrapper.classList.add("swiper-wrapper");
			slides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}

		function removeSwiperClasses() {
			wrapper.classList.remove("swiper-wrapper");
			slides.forEach((slide) => {
				slide.classList.remove("swiper-slide");
			});
		}

		function initSwiper() {
			addSwiperClasses(); // Add classes before initializing Swiper
			swiper = new Swiper(swiperTarget, {
				modules: [Navigation, Pagination],
				slidesPerView: 1,
				spaceBetween: 20,
				speed: 500,
				pagination: {
					bulletClass: "swiper-pagination-bullet",
					bulletActiveClass: "is-active",
					el: paginationEl,
				},
				navigation: {
					nextEl: nextBtn,
					prevEl: prevBtn,
				},
			});
		}

		function destroySwiper() {
			if (swiper) {
				swiper.destroy(true, true);
				swiper = null;
			}
			removeSwiperClasses(); // Remove classes after destroying Swiper
		}

		breakpoint.addEventListener("change", (event) => {
			if (event.matches) {
				initSwiper();
			} else {
				destroySwiper();
			}
		});

		// Try to init swiper when page loads if the breakpoint matches
		if (breakpoint.matches) {
			initSwiper();
		} else {
			destroySwiper();
		}
	});
}

function dataProjectsSwiper() {
	const swiperTargets = document.querySelectorAll('[data-desktop-swiper="target"]');
	if (!swiperTargets.length) return;

	const breakpoint = window.matchMedia("(min-width: 768px)");

	swiperTargets.forEach((target) => {
		let swiper = null;

		const swiperName = target.getAttribute("data-swiper-name");
		const wrapper = target.querySelector('[data-desktop-swiper="wrap"]');
		const slides = target.querySelectorAll('[data-desktop-swiper="slide"]');
		const nextBtn = document.querySelector(`[data-swiper-next="${swiperName}"]`);
		const prevBtn = document.querySelector(`[data-swiper-prev="${swiperName}"]`);

		function addSwiperClasses() {
			wrapper.classList.add("swiper-wrapper");
			slides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}

		function removeSwiperClasses() {
			wrapper.classList.remove("swiper-wrapper");
			slides.forEach((slide) => {
				slide.classList.remove("swiper-slide");
			});
		}

		function initSwiper() {
			addSwiperClasses();
			swiper = new Swiper(target, {
				modules: [Navigation],
				slidesPerView: 2,
				speed: 500,
				spaceBetween: 32,
				navigation: {
					nextEl: nextBtn,
					prevEl: prevBtn,
				},
			});
		}

		function destroySwiper() {
			if (swiper) {
				swiper.destroy(true, true);
				swiper = null;
			}
			removeSwiperClasses(); // Remove classes after destroying Swiper
		}

		breakpoint.addEventListener("change", (event) => {
			if (event.matches) {
				initSwiper();
			} else {
				destroySwiper();
			}
		});

		// Try to init swiper when page loads if the breakpoint matches
		if (breakpoint.matches) {
			initSwiper();
		} else {
			destroySwiper();
		}
	});
}

function testimonialsSwiper() {
	const swiperTarget = document.querySelector(".testimonials_swiper");
	if (!swiperTarget) return;

	const currentEl = document.querySelector('[data-testimonial-slider="current"]');
	const totalEl = document.querySelector('[data-testimonial-slider="total"]');

	const swiper = new Swiper(swiperTarget, {
		modules: [Navigation],
		slidesPerView: 1,
		autoHeight: true,
		speed: 500,
		spaceBetween: 32,
		navigation: {
			prevEl: ".testimonials_nav-btn.is-prev",
			nextEl: ".testimonials_nav-btn.is-next",
		},
	});

	const slideCount = swiper.slides.length;
	totalEl.textContent = slideCount;

	swiper.on("activeIndexChange", () => {
		const currentIndex = swiper.activeIndex + 1;
		currentEl.textContent = currentIndex;
	});
}

function teamMembersSwiper() {
	const swiperTarget = document.querySelector(".company-members_collection");
	if (!swiperTarget) return;

	// Elements to add swiper classes dynamically
	const wrapper = swiperTarget.querySelector('[data-members-swiper="wrap"]');
	const slides = swiperTarget.querySelectorAll('[data-members-swiper="slide"]');

	let swiper = null;
	const breakpoint = window.matchMedia("(max-width: 991px)");

	function addSwiperClasses() {
		wrapper.classList.add("swiper-wrapper");
		slides.forEach((slide) => {
			slide.classList.add("swiper-slide");
		});
	}

	function removeSwiperClasses() {
		wrapper.classList.remove("swiper-wrapper");
		slides.forEach((slide) => {
			slide.classList.remove("swiper-slide");
		});
	}

	function initSwiper() {
		addSwiperClasses();
		swiper = new Swiper(swiperTarget, {
			slidesPerView: 1.3,
			speed: 500,
			spaceBetween: 20,
			breakpoints: {
				768: {
					slidesPerView: 2.5,
					spaceBetween: 32,
				},
			},
		});
	}

	function destroySwiper() {
		if (swiper) {
			swiper.destroy(true, true);
			removeSwiperClasses();
			swiper = null;
		}
	}

	breakpoint.addEventListener("change", (event) => {
		if (event.matches) {
			initSwiper();
		} else {
			destroySwiper();
		}
	});

	// Try to init swiper when page loads if the breakpoint matches
	if (breakpoint.matches) {
		initSwiper();
	} else {
		destroySwiper();
	}
}

function emptyPositions() {
	const positionsCollection = document.querySelector('[data-empty-positions="collection"]');
	if (!positionsCollection) return;
	const emptyCollection = positionsCollection.querySelector(".w-dyn-empty");

	const collectionSection = positionsCollection.closest("section");
	collectionSection.style.display = "none";

	const anchorBtn = document.querySelector('[data-empty-positions="anchor-btn"]');
	function hideSection() {
		if (anchorBtn) {
			anchorBtn.style.display = "none";
		}

		const contactSection = document.querySelector('[data-empty-positions="contact-section"]');
		if (contactSection) {
			contactSection.classList.add("positions-empty");
			const contactSectionTitle = contactSection.querySelector('[data-empty-positions="contact-title"]');
			contactSectionTitle.textContent = "NO OPEN POSITIONS?";
		}
	}

	if (!emptyCollection) {
		return;
	} else {
		hideSection();
	}
}

function customFormValidation() {
	const forms = document.querySelectorAll("form");
	if (!forms.length) return;
	$("form").each(function () {
		$(this).validate({
			rules: {
				Name: {
					required: true,
					minlength: 2,
				},
				Email: {
					required: true,
					email: true,
				},
				Discipline: {
					required: true,
				},
				LinkedinOrPortfolio: {
					url: true,
				},
				PrivacyPolicy: {
					required: true,
				},
			},
			messages: {
				Name: {
					required: "Please enter your name",
					minlength: "Your name must consist of at least 2 characters",
				},
				Email: {
					required: "Please enter your email",
					email: "Please enter a valid email address",
				},
				Discipline: {
					required: "Please enter your discipline",
				},
				LinkedinOrPortfolio: {
					url: "Please enter a valid URL",
				},
			},
			focusInvalid: false,
			highlight: function (element) {
				// Check if the element is the checkbox and add the error class to its wrapper
				if (element.type === "checkbox") {
					$(element).closest(".form_checkbox-wrap").find(".form_checkbox").addClass("checkbox-error");
				}
			},
			unhighlight: function (element) {
				// Remove the error class from the wrapper if the checkbox is valid
				if (element.type === "checkbox") {
					$(element).closest(".form_checkbox-wrap").find(".form_checkbox").removeClass("checkbox-error");
				}
			},
			errorPlacement: function (error, element) {
				// Prevent error message display for the checkbox
				if (element.attr("type") === "checkbox") {
					return; // Do nothing for checkboxes, so no error message is shown
				} else {
					error.insertAfter(element); // Place error message for other elements
				}
			},
		});
	});
}

function formSuccessState() {
	// Select the form blocks containing the form and success message elements
	const formBlocks = document.querySelectorAll('[data-form-success="form-block"]');

	formBlocks.forEach((formBlock) => {
		const form = formBlock.querySelector("form"); // Select the form within this block
		const successMessage = formBlock.querySelector('[data-form-success="success-msg"]');

		if (!successMessage || !form) return;

		const btnArrows = formBlock.querySelector('[data-form-success="btn-arrows"]');
		const successArrows = formBlock.querySelector('[data-form-success="success-icon"]');
		const submitBtnTexts = formBlock.querySelectorAll('[data-form-success="submit-text"]');

		// Define the custom function to run on successful submission
		function successFunction() {
			btnArrows.style.display = "none";
			successArrows.style.display = "flex";
			submitBtnTexts.forEach((text) => {
				text.textContent = "Sent";
			});
		}

		// Set up Mutation Observer for success message visibility
		const successObserver = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "style" && successMessage.style.display === "block") {
					successFunction();
					successObserver.disconnect();
				}
			});
		});

		// Start observing the success message element for style attribute changes
		successObserver.observe(successMessage, { attributes: true });

		// Set up another Mutation Observer to prevent form from being hidden
		const formObserver = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "style") {
					// Check if Webflow has set display: none on the form
					if (form.style.display === "none") {
						form.style.display = "block";
					}
				}
			});
		});

		// Start observing the form element for style attribute changes
		formObserver.observe(form, { attributes: true });
	});
}

function formURLfield() {
	const urlField = document.querySelector('input[name="url"]');
	if (!urlField) return;

	const pageURL = window.location.href;
	urlField.value = pageURL;
}

function cmsPagination() {
	const paginationList = document.querySelector('[data-custom-pagination="collection"]');
	if (!paginationList) return;

	window.fsAttributes = window.fsAttributes || [];
	window.fsAttributes.push([
		"cmsload",
		(listInstances) => {
			// The callback passes a `listInstances` array with all the `CMSList` instances on the page.
			const [listInstance] = listInstances;

			let totalPages = listInstance.totalPages;
			let currentPage = listInstance.currentPage;
			const prevButton = listInstance.paginationPrevious;
			const nextButton = listInstance.paginationNext;
			const currentEl = document.querySelector('[data-mobile-pagination="current"]');
			const totalEl = document.querySelector('[data-mobile-pagination="total"]');

			function setTotalPages(setTotalPages) {
				totalEl.textContent = totalPages;
			}

			setTotalPages(totalPages);

			function stylePaginationBtn(currentPage) {
				if (currentPage <= 1) {
					prevButton.classList.add("is-disabled");
					nextButton.classList.remove("is-disabled");
				} else if (currentPage >= totalPages) {
					prevButton.classList.remove("is-disabled");
					nextButton.classList.add("is-disabled");
				} else {
					prevButton.classList.remove("is-disabled");
					nextButton.classList.remove("is-disabled");
				}
			}
			stylePaginationBtn(currentPage);

			function mobileCurrentPagination(currentPage) {
				currentEl.textContent = currentPage;
			}

			mobileCurrentPagination(currentPage);

			function paginationAnchor() {
				const anchorTarget = document.querySelector('[data-pagination-anchor="target"]');
				if (!anchorTarget) return;

				const targetPosition = anchorTarget.getBoundingClientRect().top + window.scrollY;
				setTimeout(() => {
					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});
				}, 400);
			}

			function hidePagination() {
				const paginationWrap = listInstance.paginationWrapper;

				if (totalPages <= 1) {
					paginationWrap.classList.add("hide");
				} else {
					paginationWrap.classList.remove("hide");
				}
			}

			// The `renderitems` event runs whenever the list renders items after switching pages.
			listInstance.on("renderitems", (renderedItems) => {
				currentPage = listInstance.currentPage;
				totalPages = listInstance.totalPages;
				stylePaginationBtn(currentPage);
				mobileCurrentPagination(currentPage);
				// On mobile case studies have filters so page count is dynamic
				setTotalPages();
				paginationAnchor();
				hidePagination();
			});
		},
	]);
}

function setCaseUrl() {
	const casesPaginatedCollection = document.querySelector('[data-case-url="paginated-collection"]');
	const casesCollection = document.querySelector('[data-case-url="collection"]');

	if (casesPaginatedCollection) {
		setPaginatedUrl();
	} else if (casesCollection) {
		setUrl();
	} else {
		return;
	}

	function setUrl() {
		const posts = casesCollection.querySelectorAll('[data-case-url="post"]');
		posts.forEach((post) => {
			const postUrl = post.querySelector('[data-case-url="url"]').href;
			const postWrap = post.querySelector('[data-case-url="wrap"]');
			postWrap.addEventListener("click", () => {
				window.location.href = postUrl;
			});
		});
	}

	function setPaginatedUrl() {
		window.fsAttributes = window.fsAttributes || [];
		window.fsAttributes.push([
			"cmsload",
			(listInstances) => {
				// The callback passes a `listInstances` array with all the `CMSList` instances on the page.
				const [listInstance] = listInstances;
				const allPosts = listInstance.items;

				allPosts.forEach((post) => {
					const postUrl = post.href;
					post.element.addEventListener("click", () => {
						window.location.href = postUrl;
					});
				});
			},
		]);
	}
}

function cookiesPopup() {
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

document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);
	lenisSmoothScroll();
	headerMenuAnimation();
	mobileMenuAccordion();
	careerCounter();
	currentYear();
	combineIndexPosts();
	newsMasonryGrid();
	newsPostLayout();
	newsPostUrl();
	indexSpotlightSlider();
	indexVideoReveal();
	textRevealAnimation();
	mobileOnlySwiper();
	dataProjectsSwiper();
	testimonialsSwiper();
	teamMembersSwiper();
	emptyPositions();
	customFormValidation();
	formSuccessState();
	formURLfield();
	cmsPagination();
	setCaseUrl();
	cookiesPopup();
	refreshScrollTriggers();
});
