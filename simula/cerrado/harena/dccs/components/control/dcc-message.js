/* Message DCC
  ************/
class DCCMessage extends DCCBase {
  connectedCallback () {
    super.connectedCallback()
    MessageBus.ext.publish(this.message)
  }

  /* Attribute Handling */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['message'])
  }

  get message () {
    return this.getAttribute('message')
  }

  set message (newValue) {
    this.setAttribute('message', newValue)
  }
}

(function () {
  DCC.webComponent('dcc-message', DCCMessage)
})()
