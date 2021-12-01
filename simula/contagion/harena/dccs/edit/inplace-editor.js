/**
 * DCC Editors common functions
 */

class EditDCC {
  constructor (dcc, presentation, properties) {
    this._closed = false
    this._editDCC = dcc
    this._editElement = presentation
    this._properties = properties
    this._editorExtended = null
    this._editorWrapper = this._fetchEditorWrapper()
    this._editorContainer = this._fetchEditorContainer()
    this._containerRect = this._editorWrapper.getBoundingClientRect()
    if (dcc != null) {
      this._elementWrapper = this._fetchElementWrapper()
      this._elementWrapperRect = this._elementWrapper.getBoundingClientRect()
      this._elementRect = this._editElement.getBoundingClientRect()
    }
  }

  get editorExtended () {
    return this._editorExtended
  }

  async _buildEditor (htmlProp) {
    const ep = await this._extendedPanel(
      EditDCC.propertiesTemplate.replace('[properties]', htmlProp),
      'properties')
    return ep
  }

  async handleConfirm () {
    await this._handleEditorAction('confirm')
  }

  async handleCancel () {
    await this._handleEditorAction('cancel')
  }

  async _handleEditorAction (action) {
    if (action === 'confirm') {
      await this._properties.applyProperties(false)
      // await MessageBus.ext.request('properties/apply/short')
    } else {
      await this._properties.closeProperties(false)
    }
      //await MessageBus.ext.request('properties/cancel/short')}
    // else if (this._editDCC != null) { this._editDCC.reactivateAuthor() }
    this.closeEditor()
  }

  closeEditor () {
    if (!this._closed) {
      this._removeExtendedPanel()
      this._closed = true
    }
  }

  // fetches the editor container
  _fetchEditorWrapper () {
    let container = document
    if (window.parent && window.parent.document) {
      const cont = window.parent.document.querySelector(
        '#inplace-editor-wrapper')
      if (cont != null) { container = cont }
    }
    return container
  }

  // fetches the editor container
  _fetchEditorContainer () {
    if (!document.querySelector('.editor-container')) {
      this._editorContainer = document.createElement('div')
      this._editorContainer.classList.add('editor-container')
      this._editorWrapper.appendChild(this._editorContainer)
    }else {
      this._editorContainer = document.querySelector('.editor-container')
    }
    return this._editorContainer
  }

  // fetches the element wrapper
  _fetchElementWrapper () {
    // looks for a knot-wrapper or equivalent
    let elWrapper = this._editElement
    if (this._editElement != null &&
          this._editDCC.xstyle && this._editDCC.xstyle != 'out' &&
          this._editDCC.xstyle != 'out-image') {
      let ew = elWrapper.parentNode
      while (ew != null && (!ew.id || !ew.id.endsWith('-wrapper'))) { ew = ew.parentNode }
      // otherwise, finds the element outside dccs
      if (ew != null && ew.id && ew.id.endsWith('-wrapper') &&
             ew.id != 'inplace-editor-wrapper') { elWrapper = ew } else if (elWrapper.parentNode != null &&
                  elWrapper.parentNode.nodeType == 1) {
        elWrapper = elWrapper.parentNode
        while (elWrapper.nodeName.toLowerCase().startsWith('dcc-') &&
                   elWrapper.parentNode != null &&
                   elWrapper.parentNode.nodeType == 1) { elWrapper = elWrapper.parentNode }
      }
    }
    return elWrapper
  }

  _buildToolbarPanel (html) {
    this._editorToolbar = document.createElement('div')
    this._editorToolbar.classList.add('inplace-editor-floating')
    this._editorToolbar.innerHTML = html

    // this._editorToolbar.style.left = this._transformRelativeX(
    //   this._elementWrapperRect.left - this._containerRect.left)
    // this._editorToolbar.style.bottom = this._transformRelativeY(
    //   this._containerRect.height -
    //         (this._elementWrapperRect.top - this._containerRect.top))
    this._fetchEditorContainer().appendChild(this._editorToolbar)
  }

  _removeToolbarPanel () {
    this._editorWrapper.removeChild(this._editorToolbar)
  }

  /*
    * Relative positions defined in percent are automatically adjusted with resize
    */

  _transformRelativeX (x) {
    return (x * 100 / this._containerRect.width) + '%'
  }

  _transformRelativeY (y) {
    return (y * 100 / this._containerRect.height) + '%'
  }

  /*
    * Positions transformed to the viewport size
    */

  _transformViewportX (x) {
    return (x * Basic.referenceViewport.width / this._containerRect.width)
  }

  _transformViewportY (y) {
    return (y * Basic.referenceViewport.height / this._containerRect.height)
  }

  async _extendedPanel (html, modality) {
    this._editorExtended =
         this._buildExtendedPanel(html, modality)

    this._fetchEditorContainer().appendChild(this._editorExtended)
    this._editDCC.parentNode.insertBefore(
      this._fetchEditorContainer(), this._editDCC.nextSibling)
    this._editDCC._presentation.focus()

    const promise = new Promise((resolve, reject) => {
      const callback = function (button) { resolve(button) }
      if (this._extendedSub.confirm) {
        this._extendedSub.confirm.onclick = function (e) {
          callback('confirm')
        }
      } else if (this._extendedSub.image) {
        this._extendedSub.image.onchange = function (e) {
          callback('confirm')
        }
      }
      this._extendedSub.cancel.onclick = function (e) {
        callback('cancel')
      }
    })
    const buttonClicked = await promise
    return {
      clicked: buttonClicked,
      content: this._extendedSub.content
    }
  }

  _removeExtendedPanel () {
    if (this._editorExtended != null) {
      this._editorContainer.removeChild(this._editorExtended)
      this._editorExtended = null
    }
  }

  _buildExtendedPanel (html, modality) {
    const panelExtended = document.createElement('div')
    panelExtended.classList.add('inplace-editor-floating')
    panelExtended.innerHTML = html

    this._extendedSub = {
      cancel: panelExtended.querySelector('#ext-cancel'),
      content: panelExtended.querySelector('#ext-content')
    }
    if (modality === 'image') {
      this._extendedSub.image = panelExtended.querySelector('#ext-content')
    } else { this._extendedSub.confirm = panelExtended.querySelector('#ext-confirm') }
    return panelExtended
  }

  async _imageUploadPanel () {
    const ep = await this._extendedPanel(
      EditDCC.imageBrowseTemplate, 'image')
    let path = null
    if (ep.clicked === 'confirm' && ep.content.files[0]) {
      const asset = await
      MessageBus.ext.request('data/asset//new',
        {
          file: ep.content.files[0],
          caseid: Basic.service.currentCaseId
        })
      path = asset.message
    }
    this._removeExtendedPanel()
    return path
  }
}

class EditDCCProperties extends EditDCC {
  constructor (dcc, presentation, htmlProp, properties) {
    super(dcc, presentation, properties)
    this._componentEditor(htmlProp)
  }

  async _componentEditor (htmlProp) {
    const ep = await this._buildEditor(htmlProp)
    this._handleEditorAction(ep.clicked)
  }
}

(function () {
/* icons from Font Awesome, license: https://fontawesome.com/license */

  // check-square https://fontawesome.com/icons/check-square?style=regular
  EditDCC.buttonConfirmSVG =
`<svg viewBox="0 0 448 512">
<path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z">
</path></svg>`

  // window-close https://fontawesome.com/icons/window-close?style=regular
  EditDCC.buttonCancelSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z">
</path></svg>`

  EditDCC.propertiesTemplate =
`<div class="annotation-bar">Properties
   <div class="annotation-buttons">
      <div id="ext-confirm" style="width:24px">` +
          EditDCC.buttonConfirmSVG + '</div>' +
'      <div id="ext-cancel" style="width:28px">' +
          EditDCC.buttonCancelSVG + '</div>' +
`   </div>
</div>
<div class="styp-properties-panel">[properties]</div>`

  EditDCC.imageBrowseTemplate =
`<div class="annotation-bar">Select Image
   <div class="annotation-buttons">
      <div id="ext-cancel" style="width:28px">` +
          EditDCC.buttonCancelSVG + '</div>' +
`   </div>
</div>
<input type="file" id="ext-content" name="ext-content"
       accept="image/png, image/jpeg, image/svg">`
})()
