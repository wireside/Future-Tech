class BaseComponent {
  constructor() {
    if (this.constructor === BaseComponent) {
      throw new Error('Cannot create an instance of the abstract class BaseComponent')
    }
  }
  
  getProxyState(initialState) {
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop]
      },
      set: (target, prop, newValue) => {
        const oldValue = target[prop]
        
        target[prop] = newValue
        
        if (newValue !== oldValue) {
          this.updateUI()
        }
        
        return true
      },
    })
  }
  
  /**
   * Re-rendering UI in response to change in state
   */
  updateUI() {
    throw new Error('It is necessary to implement the updateUI method!')
  }
}

export default BaseComponent