/**
 * Transforms data from a form in a REST submission
 */

class DCCSubmit extends DCCButton {
  connectedCallback () {
    super.connectedCallback()
    if (this.hasAttribute('id')) {
      this.computeSubmit = this.computeSubmit.bind(this)
      MessageBus.page.provides(this.id, 'control/submit',
                               this.computeSubmit)
    }
  }

  async connectTo (trigger, id, topic) {
    super.connectTo(trigger, id, topic)
    if (trigger == 'schema') {
      const result = await this.request(trigger, null, id)
      if (result != null && result[id] != null)
        this._schema = result[id]
    }
  }

  async computeSubmit () {
    this._active = true
    await this._computeTrigger()
  }

  async notify (topic, message) {
    // super.notify(topic, message)
    if (message.role != null && message.role == 'submit') {
      await this.computeSubmit()
      MessageBus.ext.publish(
        MessageBus.buildResponseTopic(topic, message.body))
    }
  }

  async _computeTrigger () {
    if (this._active) {
      const message = { sourceType: this.nodeName.toLowerCase() }
      const topic = (this.hasAttribute('topic'))
        ? this.topic
        : (this.hasAttribute('variable'))
          ? 'var/' + this.varible + '/changed'
          : 'button/' + this.label + '/clicked'
      if (this.hasAttribute('message')) { message.value = this.message }
      let form = null
      if (this._schema != null) {
        const schema = Object.keys(this._schema)
        for (let s of schema) {
          let field = document.querySelector('#' + s)
          if (field != null)
            message[s] = field.value
        }
      } else {
        form = this.parentNode
        while (form != null && form.nodeName.toLowerCase() != 'form')
          form = form.parentNode
        message.value = {}
        if (form != null)
          for (let f of form) {
            if (f.type == 'radio' || f.type == 'checkbox') {
              if (f.checked)
                message.value[f.id] = f.value
            } else
              message.value[f.id] = f.value
          }
      }
      if (this._checkPre(message, form)) {
          if (this._connections != null) {
          const response = await this.multiRequest('submit', message)
          if (this._setup != null && this._setup.pos != null)
            this._setup.pos(response)
        } else
          MessageBus.ext.publish(topic, message)
      }
    }
  }

  _checkPre(message, form) {
    let result = true
    if (this._setup != null && this._setup.pre != null)
      result = this._setup.pre(message, form, this._schema)
    return result
  }
}

(function () {
  DCC.webComponent('dcc-submit', DCCSubmit)
})()
