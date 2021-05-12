/* Editor for DCC Images
  **********************/

class EditDCCImage extends EditDCC {
  constructor (obj, dcc, properties) {
    super(dcc, dcc.currentPresentation(), properties)
    this._componentEditor(obj)
  }

  async _componentEditor (obj) {
    // checks if the image is subordinated to another entity
    if (obj.image)
      obj.image.path = await this._imageUploadPanel()
    else
      obj.path = await this._imageUploadPanel()
    console.log('=== image properties')
    console.log(this._properties)
    this._properties.applyProperties(true)
    // MessageBus.ext.publish('properties/apply/details')
  }
}
