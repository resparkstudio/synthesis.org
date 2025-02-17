export function customFormValidation() {
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

export function formSuccessState() {
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

export function formURLfield() {
	const urlField = document.querySelector('input[name="url"]');
	if (!urlField) return;

	const pageURL = window.location.href;
	urlField.value = pageURL;
}
