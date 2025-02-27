import BaseComponent from "./BaseComponent.js";
import MatchMedia from "./MatchMedia.js";

const rootSelector = '[data-js-select]'

class Select extends BaseComponent {
  selectors = {
    root: rootSelector,
    originalControl: '[data-js-select-original-control]',
    button: '[data-js-select-button]',
    dropdown: '[data-js-select-dropdown]',
    option: '[data-js-select-option]',
  }
  
  stateClasses = {
    isExpanded: 'is-expanded',
    isSelected: 'is-selected',
    isCurrent: 'is-current',
    isOnTheLeftSide: 'is-on-the-left-side',
    isOnTheRightSide: 'is-on-the-right-side',
  }
  
  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    ariaSelected: 'aria-selected',
    ariaActiveDescendant: 'aria-activedescendant',
  }
  
  initialState = {
    isExpanded: false,
    currentOptionIndex: null,
    selectedOptionElement: null,
  }
  
  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl)
    this.buttonElement = this.rootElement.querySelector(this.selectors.button)
    this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown)
    this.optionElements = this.dropdownElement.querySelectorAll(this.selectors.option)
    this.state = this.getProxyState({
      ...this.initialState,
      currentOptionIndex: this.originalControlElement.selectedIndex,
      selectedOptionElement: this.optionElements[this.originalControlElement.selectedIndex]
    })
    this.fixDropdownPosition()
    this.updateTabIndexes()
    this.bindEvents()
  }
  
  updateUI() {
    const {
      isExpanded,
      currentOptionIndex,
      selectedOptionElement,
      
    } = this.state
    
    const newSelectedOptionValue = selectedOptionElement.textContent.trim()
    
    const updateOriginalControl = () => {
      this.originalControlElement.value = newSelectedOptionValue
    }
    
    const updateButton = () => {
      this.buttonElement.textContent = newSelectedOptionValue
      this.buttonElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
      this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isExpanded)
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id
      )
    }
    
    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
    }
    
    const updateOptions = () => {
      this.optionElements.forEach((optionElement, index) => {
        const isCurrent = currentOptionIndex === index
        const isSelected = selectedOptionElement === optionElement
        
        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent)
        optionElement.classList.toggle(this.stateClasses.isSelected, isSelected)
        optionElement.setAttribute(this.stateAttributes.ariaSelected, isSelected)
      })
    }
    
    updateOriginalControl()
    updateButton()
    updateDropdown()
    updateOptions()
  }
  
  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth
    const halfViewportX = viewportWidth / 2
    const { width, x } = this.buttonElement.getBoundingClientRect()
    const buttonCenterX = x + width / 2
    const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX
    
    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isButtonOnTheLeftViewportSide
    )
    
    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isButtonOnTheLeftViewportSide
    )
  }
  
  updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1
    this.buttonElement.tabIndex = isMobileDevice ? -1 : 0
  }
  
  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches)
  }
  
  bindEvents() {
    MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange)
    this.buttonElement.addEventListener('click', () => { this.state.isExpanded = !this.state.isExpanded; this.updateUI() })
  }
}

class SelectCollection {
  constructor() {
    this.init()
  }
  
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Select(element)
    })
  }
}

export default SelectCollection