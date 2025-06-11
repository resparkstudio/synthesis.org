export function careerCounter() {
	const careerList = document.querySelector('[data-career-count="list"]');
	const careerCounters = document.querySelectorAll(".career-counter-number");
	if (!careerList) return;

	const careerCount = careerList.querySelectorAll(".w-dyn-item").length;

	careerCounters.forEach((counter) => {
		counter.textContent = careerCount;
	});
}

export function emptyPositions() {
	const positionsCollection = document.querySelector('[data-empty-positions="collection"]');
	if (!positionsCollection) return;

	const emptyCollection = positionsCollection.querySelector(".w-dyn-empty");
	const collectionSection = positionsCollection.closest("section");

	const anchorBtn = document.querySelector('[data-empty-positions="anchor-btn"]');

	const contactSection = document.querySelector('[data-empty-positions="contact-section"]');

	function hideSection() {
		if (collectionSection) {
			collectionSection.style.display = "none";
		}

		if (anchorBtn) {
			anchorBtn.style.display = "none";
		}

		if (contactSection) {
			contactSection.classList.add("positions-empty");
			const contactSectionTitle = contactSection.querySelector('[data-empty-positions="contact-title"]');
			contactSectionTitle.textContent = "NO OPEN POSITIONS?";
		}
	}

	if (emptyCollection) {
		hideSection();
	} else {
		return;
	}
}
