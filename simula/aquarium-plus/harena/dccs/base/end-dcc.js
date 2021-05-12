class EndDCC  extends HTMLElement {
  connectedCallback() {
    if (this._triggered == null) {
      let parent = this.parentNode
      while (parent != null && !parent.nodeName.toLowerCase().startsWith('dcc-'))
        parent = parent.parentNode
      if (parent != null)
        parent.endReached()
    }
    this._triggered = true
  }
}

(function () {
  EndDCC.elementTag = 'end-dcc'
  DCC.webComponent(EndDCC.elementTag, EndDCC)
})()