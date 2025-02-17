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
