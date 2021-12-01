/* DCC Connector
  **************/

class ConnectDCC extends HTMLElement {
  connectedCallback () {
    if (this.hasAttribute('trigger') &&
        this.hasAttribute('to') && this.hasAttribute('topic')) {
      this._fromObj = (this.hasAttribute('from'))
        ? document.querySelector('#' + this.from) : this.parentNode
      this._fromObj.connectTo(this.trigger, this.to, this.topic)
    }
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return ['from', 'trigger', 'to', 'topic']
  }

  get from () {
    return this.getAttribute('from')
  }

  set from (newValue) {
    this.setAttribute('from', newValue)
  }

  get trigger () {
    return this.getAttribute('trigger')
  }

  set trigger (newValue) {
    this.setAttribute('trigger', newValue)
  }

  get to () {
    return this.getAttribute('to')
  }

  set to (newValue) {
    this.setAttribute('to', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }
}

(function () {
  customElements.define('connect-dcc', ConnectDCC)
})()
