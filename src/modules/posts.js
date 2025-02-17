import MagicGrid from "magic-grid";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function combineIndexPosts() {
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

export function newsMasonryGrid() {
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

export function newsPostLayout(newsPosts = null) {
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
export function newsPostUrl(newsPosts = null) {
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

export function cmsPagination() {
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

export function setCaseUrl() {
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

export function customSaunaCaseStudy() {
	const saunaTrigger = document.querySelector(".sauna-case-inner-condition");
	if (!saunaTrigger) return;

	const mainWrapper = document.querySelector(".main-wrapper");

	const saunaValue = saunaTrigger.textContent;

	if (saunaValue === "true") {
		mainWrapper.classList.add("is-sauna");
	}
}
