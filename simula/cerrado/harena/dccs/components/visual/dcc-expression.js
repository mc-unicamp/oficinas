/* Expression DCC
 ****************/
class DCCExpression extends DCCVisual {
  constructor () {
    super()
  }

  async connectedCallback () {
    // <TODO> provisory solution due to message ordering
    // this._updated = false

    // <TODO> provisory - replace by a stronger expression representation
    /*
    this._variable = this.expression
    if (this._variable.indexOf('[') > 0) {
      this._index = parseInt(
        this._variable.substring(this._variable.indexOf('[') + 1,
        this._variable.indexOf(']')))
      this._variable = this._variable.substring(0, this._variable.indexOf('['))
    }
    */

    /*
    const compiled = DCCCompute.compileStatementSet(this.expression)
    console.log('=== compiled expression')
    for (const c of compiled) {
      console.log(c[1])
      console.log(DCCCompute.computeCompiled(c[1]))
    }
    */
    // for (const c of compiled) { console.log('=== result: ' + DCCCompute.computeCompiled(c[1])) }

    // <TODO> provisory - overlaps with htracker.js and state.js
    //                    also monitors all messages
    if (this.active) {
      this.stateChanged = this.stateChanged.bind(this)
      MessageBus.ext.subscribe('var/+/state_changed', this.stateChanged)
      this._stateValues = {}
    }

    this._compiled = null
    if (this.hasAttribute('expression')) {
      this._compiled =
        DCCCompute.compileStatementSet(this.expression.toLowerCase())

      if (this._compiled != null) {
        if (this.active) {
          this.variableUpdated = this.variableUpdated.bind(this)
          const variables = DCCCompute.filterVariables(this._compiled, false)
          // MessageBus.ext.subscribe(
          //   'var/' + this._variable + '/set', this.variableUpdated)
          MessageBus.ext.subscribe('var/*/set', this.variableUpdated)
          for (let v of variables)
            MessageBus.ext.subscribe(
              'var/' + v + '/set', this.variableUpdated)
        }
      }
    }

    if (this._compiled != null)
      await this._showResult()

    this._setPresentation(this)
    this._presentationIsReady()

    super.connectedCallback()
  }

  async _showResult () {
    let result = await DCCCompute.computeExpression(this._compiled)
    // let result = await MessageBus.ext.request('var/' + this._variable + '/get')
    if (result == null) {
      result = ''
    } else {
      // if (this._index == null) {
        // <TODO> provisory unfold
        if (typeof result === 'object') {
          let values = []
          if (Array.isArray(result)) {
            values = result
          } else {
            for (const v in result) {
              // <TODO> I don't remember the role of '+'
              // if (result.message[v].state == '+') { values.push(result.message[v].content) }
              values.push(v + ': ' + result[v])
            }
          }
          result = this._valuesToHTML(values)
        }
      // } else { result = result.message[this._index - 1] }
    }

    // <TODO> provisory solution due to message ordering
    // console.log('=== updating')
    // console.log(this._updated)
    // console.log(result)
    this.innerHTML = result
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['expression', 'active'])
  }

  get expression () {
    return this.getAttribute('expression')
  }

  set expression (newValue) {
    this.setAttribute('expression', newValue)
  }

  // defines if the display is activelly updated
  get active () {
    return this.hasAttribute('active')
  }

  set active (isActive) {
    if (isActive) {
      this.setAttribute('active', '')
    } else {
      this.removeAttribute('active')
    }
  }

  async variableUpdated (topic, message) {
    await this._showResult()
    // <TODO> provisory solution due to message ordering
    // this._updated = true
    /*
    if (this._index == null) {
      this.innerHTML = message.body
    } else {
      this.innerHTML = message[this._index - 1]
    }
    */
  }

  stateChanged (topic, message) {
    const id = MessageBus.extractLevel(topic, 2)

    if (id.startsWith(this._variable)) {
      const subid = id.substring(this._variable.length + 1)

      if (message.state == '+') { this._stateValues[subid] = message.value } else
      if (this._stateValues[subid] != null) { delete this._stateValues[subid] }

      this.innerHTML = this._valuesToHTML(this._stateValues)
    }
  }

  _valuesToHTML (values) {
    let html = '<ul>'
    for (const v in values) { html += '<li>' + values[v] + '</li>' }
    html += '</ul>'
    return html
  }
}

(function () {
  DCCExpression.elementTag = 'dcc-expression'
  customElements.define(DCCExpression.elementTag, DCCExpression)
})()
