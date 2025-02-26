import "./custom-styles.css"; // Custom CSS import
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Importing all modules
import { lenisSmoothScroll } from "./modules/smoothScroll";
import { combineIndexPosts, newsMasonryGrid, newsPostLayout, newsPostUrl, cmsPagination, setCaseUrl, customSaunaCaseStudy } from "./modules/posts";
import { indexSpotlightSlider, mobileOnlySwiper, dataProjectsSwiper, testimonialsSwiper, teamMembersSwiper } from "./modules/sliders";
import { customFormValidation, formSuccessState, formURLfield, formSelectDropdown, formCustomLoader } from "./modules/forms";
import { headerMenuAnimation, mobileMenuAccordion, indexVideoReveal, textRevealAnimation } from "./modules/animations";
import { cookiesPopup } from "./modules/cookies";
import { careerCounter, emptyPositions } from "./modules/career";
import { refreshScrollTriggers, currentYear } from "./modules/utils";

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
	customSaunaCaseStudy();
	formSelectDropdown();
	formCustomLoader();
});
