/* Editor for DCC Plain Texts
  ***************************/

class EditDCCPlain {
  constructor (obj, dcc, htmlProp, field, properties) {
    if (field != null) {
      /*
      this.handleConfirm = this.handleConfirm.bind(this)
      MessageBus.ext.subscribe('control/element/+/selected', this.handleConfirm)
      */
      this._objProperties = obj
      this._editElement = dcc.currentPresentation()
      this._objField = field
      this._properties = properties
      this._originalEdit = this._editElement.innerHTML
      this._editElement.contentEditable = true
      this._editElement.focus()
    }
  }

  async handleConfirm () {
    this._editElement.contentEditable = false
    this._objProperties[this._objField] =
           this._editElement.innerHTML.trim().replace(/<br>$/i, '')
    await this._properties.applyProperties(false)
    // MessageBus.ext.request('properties/apply/short')
  }

  // <FUTURE>?
  /*
  handleCancel () {
    this._editElement.contentEditable = false
    this._editElement.innerHTML = this._originalEdit
    MessageBus.ext.request('properties/cancel/short')
  }
  */

  /*
  async _componentEditor (htmlProp) {
    if (this._objField != null) {
      this._originalEdit = this._editElement.innerHTML
      this._editElement.contentEditable = true
    }
    if (this._objField != null) {
      this._editElement.contentEditable = false
      if (ep.clicked == 'confirm') {
        this._objProperties[this._objField] =
               this._editElement.innerHTML.trim().replace(/<br>$/i, '')
      } else { this._editElement.innerHTML = this._originalEdit }
    }
    this._handleEditorAction(ep.clicked)
  }
  */
}
