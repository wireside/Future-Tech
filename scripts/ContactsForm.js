const formSelector = '[data-js-contacts-form]'

class ContactsForm {
	selectors = {
		form: formSelector,
		button: '[data-js-contacts-form-button]',
		phoneNumberSelect: '[data-js-contacts-form-phone-number-prefix-select]',
		phoneNumberControl: '[data-js-contacts-form-phone-number-control]',
	}
	
	errorMessages = {
		valueMissing: () => 'Пожалуйста, заполните это поле',
		patternMismatch: ({title}) => title || 'Данные не соответствуют формату',
		tooShort: ({minLength}) => `Слишком короткое значение, минимум символов — ${minLength}`,
		tooLong: ({maxLength}) => `Слишком длинное значение, ограничение символов — ${maxLength}`,
	}
	
	getNormalizedPhoneNumber(phoneNumber) {
		return phoneNumber.replace(/[^+\d]/g, '')
	}
	
	constructor() {
		this.formElement = document.querySelector(this.selectors.form)
		this.buttonElement = document.querySelector(this.selectors.button)
		this.phoneNumberSelectElement = document.querySelector(
			this.selectors.phoneNumberSelect,
		)
		this.phoneNumberControlElement = document.querySelector(
			this.selectors.phoneNumberControl,
		)
		this.bindEvents()
	}
	
	validateField(fieldControlElement) {
		const errors = fieldControlElement.validity
		const errorMessages = []
		
		Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
			if (errors[errorType]) {
				errorMessages.push(getErrorMessage(fieldControlElement))
			}
		})
		
		const isValid = errorMessages.length === 0
		
		fieldControlElement.ariaInvalid = !isValid
		
		return isValid
	}
	
	onSubmit = (event) => {
		const isFormElement = event.target.matches(this.selectors.form)
		if (!isFormElement) {
			return
		}
		
		const requiredControlElements = [...event.target.elements]
			.filter(({required}) => required)
		let isFormValid = true
		let firstInvalidFieldControl = null
		
		requiredControlElements.forEach((field) => {
			const isFieldValid = this.validateField(field)
			
			if (!isFieldValid) {
				isFormValid = false
				
				if (!firstInvalidFieldControl) {
					firstInvalidFieldControl = field
				}
			}
		})
		
		if (!isFormValid) {
			event.preventDefault()
			firstInvalidFieldControl.focus()
			return
		}
		
		const formData = new FormData(this.formElement)
		const formDataObject = Object.fromEntries(formData)
		
		this.sendRequest(formDataObject);
	}
	
	bindEvents() {
		document.addEventListener('submit', this.onSubmit)
	}
	
	sendRequest(formDataObject) {
		const prefix = this.phoneNumberSelectElement.value
		const phoneNumberWithoutPrefix = this.phoneNumberControlElement.value
		
		const phoneNumber = (
			prefix + this.getNormalizedPhoneNumber(phoneNumberWithoutPrefix)
		)
		console.log(phoneNumber)
		
		fetch('http://localhost:3000/feedbacks/', {
			method: 'POST',
			body: JSON.stringify({
				...formDataObject,
				phone_number: phoneNumber,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			}
		}).then((response) => {
			console.log(response)
			
			return response.json()
		}).then((json) => {
			console.log(json)
		})
	}
}

class ContactsFormCollection {
	constructor() {
		this.init()
	}
	
	init() {
		document.querySelectorAll(formSelector).forEach((element) => {
			new ContactsForm(element)
		})
	}
}

export default ContactsFormCollection