/* Dynamic HTML DCC
  *****************/

class DCCDHTML extends DCCBase {
  constructor() {
    super()
    this.recordUpdate = this.recordUpdate.bind(this)
  }

  async connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('autoupdate')) {
      let record = await MessageBus.ext.request('var/*/get')
      record = (record == null || record.message == null) ? {} : record.message
      this.recordUpdate('var/*/get', record)
      this.fieldUpdate = this.fieldUpdate.bind(this)
      MessageBus.ext.subscribe('var/+/set', this.fieldUpdate)
    }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['autoupdate'])
  }

  get autoupdate () {
    return this.getAttribute('autoupdate')
  }

  set autoupdate (newValue) {
    this.setAttribute('autoupdate', newValue)
  }

  endReached() {
    this._originalHTML = this.innerHTML.replace(
      /<end-dcc[^>]*>[^<]*<\/end-dcc>/igm, '')
    this._renderHTML()
  }

  _renderHTML () {
    let html = this._originalHTML
    if (html != null) {
      if (this._record != null) {
        if (typeof this._record === 'object')
          html = this._replaceEach(html, this._record)
        else
          html = this._originalHTML.replace(/\{\{[ \t]*value[ \t]*\}\}/igm, this._record)
      }
      this.innerHTML = html.replace(/\{\{[^}]*\}\}/igm, '')
    }
  }

  _replaceEach (html, record) {
    const eachBlocks = html.split(
      /\{\{[ \t]*@foreach[ \t]+([^ \t]+)[ \t]+([^ \t}]+)[ \t]*\}\}/im)
    let part = 0
    html = ''
    while (part < eachBlocks.length) {
      let phtml = this._replaceFields(eachBlocks[part], '', record)
      html += phtml
      part++
      if (part < eachBlocks.length) {
        let field = eachBlocks[part]
        let item = eachBlocks[part+1]
        const vhtml = eachBlocks[part+2].split(/\{\{[ \t]*@endfor[ \t]*\}\}/im)
        let phtml = vhtml[0]
        const it = (field == '.') ? record : record[field]
        for (let i of it) {
          let shtml = phtml
          shtml = this._replaceFields(shtml, '', record)
          shtml = this._replaceFields(
            shtml, (field == '.') ? item : item + '.' + field, i)
          html += shtml
        }
        if (vhtml.length > 0)
          html += this._replaceFields(vhtml[1], '', record)
        part += 3
      }
    }
    return html
  }

  _replaceFields (html, prefix, record) {
    if (prefix != '') prefix += '.'
    for (let r in record) {
      let pr = prefix + r
      if (record[r] != null && typeof record[r] === 'object')
        html = this._replaceFields(html, pr, record[r])
      else {
        if (typeof record[r] === 'number') record[r] = record[r].toString()
        const content = (record[r] == null) ? '' :
                          record[r].replace(/&/gm, '&amp;')
                                   .replace(/"/gm, '&quot;')
                                   .replace(/'/gm, '&#39;')
                                   .replace(/</gm, '&lt;')
                                   .replace(/>/gm, '&gt;')
        html = html.replace(
          new RegExp('\{\{[ \\t]*' + pr + '[ \\t]*\}\}', 'igm'), content)

        let condExp = '\{\{[ \\t]*([^?\}]+)[ \\t]*\\?[ \\t]*' + pr +
                      '[ \\t]*:[ \\t]*([^\}]+)[ \\t]*\}\}(?:="")?'
        let conditions = html.match(new RegExp(condExp, 'igm'))
        if (conditions != null)
          for (let c of conditions) {
            let inside = c.match(new RegExp(condExp, 'im'))
            html = html.replace(
              new RegExp('\{\{[ \\t]*' + inside[1] + '[ \\t]*\\?[ \\t]*' + pr +
                         '[ \\t]*:[ \\t]*' + inside[2] + '[ \\t]*\}\}(?:="")?',
                         'igm'),
              ((inside[2] == '' + content) ? inside[1] : '')
            )
          }
      }
    }
    return html
  }

  notify (topic, message) {
    if (message.role != null) {
      switch (message.role) {
        case 'update': this.recordUpdate(topic, message)
                       break
      }
    }
  }

  recordUpdate (topic, message) {
    this._record = this._extractValue(message)
    this._updateRender()
  }

  fieldUpdate (topic, message) {
    const id = MessageBus.extractLevel(topic, 2)
    const value = this._extractValue(message)
    if (id == '*')
      this._record = value
    else
      this._record[id] = value
    this._updateRender()
  }

  _extractValue (message) {
     return ((message.body)
      ? ((message.body.value) ? message.body.value : message.body)
      : ((message.value) ? message.value : message))
  }

  _updateRender () {
    this._renderHTML()
    MessageBus.int.publish('web/dhtml/record/updated', DCCDHTML.elementTag)
    MessageBus.int.publish('control/dhtml/updated')
  }

  async connectionReady (id, topic) {
    super.connectionReady (id, topic)
    if (topic == 'data/record/retrieve' || topic == 'service/request/get') {
      const response = await this.request('retrieve', null, id)
      this.recordUpdate(topic, response)
    }
    MessageBus.int.publish('control/dhtml/ready')
  }
}

(function () {
  DCCDHTML.elementTag = 'dcc-dhtml'
  DCC.webComponent(DCCDHTML.elementTag, DCCDHTML)
})()
