// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";

export function indexSpotlightSlider() {
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

export function mobileOnlySwiper() {
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

export function dataProjectsSwiper() {
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

export function testimonialsSwiper() {
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

export function teamMembersSwiper() {
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
