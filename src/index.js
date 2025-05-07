import barba from "@barba/core";

import "./custom-styles.css"; // Custom CSS import
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
CustomEase.create("custom", `M0,0 C0.5,0 0,1 1,1`);

// Importing all modules
import { lenisSmoothScroll, lenisSidebarScroll } from "./modules/smoothScroll";
import { combineIndexPosts, newsMasonryGrid, newsPostLayout, newsPostUrl, cmsPagination, setCaseUrl, customSaunaCaseStudy } from "./modules/posts";
import { indexSpotlightSlider, mobileOnlySwiper, dataProjectsSwiper, testimonialsSwiper, teamMembersSwiper } from "./modules/sliders";
import { customFormValidation, formSuccessState, formURLfield, formSelectDropdown, formCustomLoader } from "./modules/forms";
import { headerMenuAnimation, mobileMenuAccordion, indexVideoReveal, textRevealAnimation } from "./modules/animations";
import { cookiesPopup } from "./modules/cookies";
import { careerCounter, emptyPositions } from "./modules/career";
import { refreshScrollTriggers, currentYear, initFinsweetAttributes, autoplayVideos } from "./modules/utils";

// Initializing barba page transitions
function barbaJS() {
	const transitionContainer = document.querySelector('[data-transition-animation="container"]');
	if (!transitionContainer) return;

	const transitionOverlay = transitionContainer.querySelector('[data-transition-animation="overlay"]');
	const transitionWrap = transitionContainer.querySelector('[data-transition-animation="wrap"]');
	const transitionLines = transitionContainer.querySelectorAll('[data-transition-animation="line"]');

	function transitionIn(data) {
		return new Promise((resolve) => {
			const tl = gsap.timeline({
				onComplete: () => {
					// Scroll to top after new page content has entered
					window.scrollTo(0, 0);
					resolve();
				},
			});

			tl.set(transitionContainer, {
				autoAlpha: 1,
			})
				.to(transitionOverlay, {
					opacity: 0.4,
					duration: 0.4,
					ease: "linear",
				})
				.to(
					transitionWrap,
					{
						y: 0,
						duration: 1.5,
						ease: "custom",
					},
					"<"
				)
				.to(
					data.current.container,
					{
						y: -150,
						duration: 1.5,
						ease: "custom",
					},
					"<"
				)
				.to(
					transitionLines,
					{
						x: "0%",
						duration: 0.7,
						ease: "custom",
						stagger: 0.1,
					},
					">-0.7"
				);
		});
	}

	function transitionOut(data) {
		const tl = gsap.timeline({
			onComplete: () => {
				// Reset styles for next transition after current animation completes
				gsap.set(transitionWrap, { y: "100%" });
				gsap.set(transitionOverlay, { opacity: 0 });
				gsap.set(transitionContainer, { autoAlpha: 0 });
				gsap.set(transitionLines, { x: "-100%" });
			},
		});

		tl.to(transitionLines, {
			x: "100%",
			duration: 0.7,
			ease: "power3.inOut",
			stagger: 0.1,
		})
			.to(
				transitionOverlay,
				{
					opacity: 0,
					duration: 1,
					ease: "linear",
				},
				">-0.5"
			)
			.to(
				transitionWrap,
				{
					y: "-100%",
					duration: 1.5,
					ease: "custom",
				},
				"<"
			)
			.from(
				data.next.container,
				{
					y: 100,
					duration: 1.5,
					ease: "custom",
				},
				"<"
			)
			.set(transitionContainer, {
				autoAlpha: 0,
			});
	}

	barba.init({
		transitions: [
			{
				name: "overlay-transition",

				// Start the overlay animation
				async leave(data) {
					await transitionIn(data);
				},

				// Clean up ScrollTrigger after leave animation completes
				async afterLeave(data) {
					ScrollTrigger.getAll().forEach((st) => st.kill());
				},

				// Initialize new page after old DOM is removed
				async after(data) {
					initFunctions();

					// Animate out the overlay
					transitionOut(data);
				},
			},
		],
	});
}

function initFunctions() {
	initFinsweetAttributes();
	lenisSmoothScroll();
	lenisSidebarScroll();
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
	customSaunaCaseStudy();
	formSelectDropdown();
	formCustomLoader();
	autoplayVideos();
}

document.addEventListener("DOMContentLoaded", () => {
	initFunctions();
	barbaJS();
});
