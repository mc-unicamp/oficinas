/* Include DCC
  ************/

class DCCInclude extends DCCBase {
  connectedCallback () {
    this._includeHTML = this._includeHTML.bind(this)
    super.connectedCallback()
    if (this.hasAttribute('src')) {
      this._xhr = new XMLHttpRequest()
      this._xhr.onload = this._includeHTML
      this._xhr.open("GET", this.src)
      this._xhr.responseType = "document"
      this._xhr.send()
    }
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['src'])
  }

  get src () {
    return this.getAttribute('src')
  }

  set src (newValue) {
    this.setAttribute('src', newValue)
  }

  _includeHTML () {
    for (let node of this._xhr.responseXML.body.childNodes) {
      this.appendChild(node)
    }    
  }
}

(function () {
  customElements.define('dcc-include', DCCInclude)
})()
