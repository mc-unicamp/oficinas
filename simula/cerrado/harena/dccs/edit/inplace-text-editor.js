/* Editor for DCC Texts
  *********************/

function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class EditDCCText extends EditDCC {
  constructor (knotContent, el, dcc, svg, floating, properties, field) {
    super(dcc, (dcc != null) ? dcc.currentPresentation() : null, properties)
    this._knotContent = knotContent
    this._element = el
    this._objField = field
    // this._editDCC = dcc
    this._textChanged = false
    this.handleConfirm = this.handleConfirm.bind(this)
    MessageBus.int.subscribe('control/editor/edit/confirm', this.handleConfirm)
    this.handleCancel = this.handleCancel.bind(this)
    MessageBus.int.subscribe('control/editor/edit/cancel', this.handleCancel)

    let presentation = null
    if (floating) {
      const template = document.createElement('template')
      template.innerHTML = EditDCCText.templateFloating
        .replace('[content]',
                 Translator.instance.generateKnotHTML([knotContent[el]], false))
      // this._shadow = this.attachShadow({ mode: 'open' })
      // embeds all clone to enable deleting it
      this._editorInstance = document.createElement('div')
      this._editorInstance.appendChild(template.content.cloneNode(true))
      this._editorWrapper.appendChild(this._editorInstance)
      /*
      this._editorContainer.appendChild(template.content.cloneNode(true))
      this._editorInstance =
        this._editorContainer.querySelector('#presentation-inline-modal')
      */
      presentation = this._editorInstance.querySelector('#presentation-inline-editor')
      this._toolbarContainer =
        this._editorInstance.querySelector('#presentation-inline-toolbar')
    } else {
      presentation = dcc.currentPresentation()
      this._toolbarContainer = document.querySelector('#toolbar-editor')
    }

    this._buildEditor(presentation)
  }

  _buildEditor (presentation) {
    DecoupledEditor.create(presentation,
      {
        extraPlugins: [_harenaCustomUploadAdapterPlugin],
        mediaEmbed: {
          extraProviders: [
             {
               name: 'googleProvider',
               url: /(^https:\/\/drive.google.com[\w/]*\/[^/]+\/)[^/]*/,
               html: match => '<iframe src="' + match[1] + 'preview" width="560" height="315"></iframe>'
             },
             {
               name: 'harenaProvider',
               url: /(^https?:\/\/(?:localhost|0\.0\.0\.0|(?:dev\.)?jacinto\.harena\.org)(?::10020)?\/.*)/,
               html: match => '<video controls><source src="' + match[1] + '"></video>'
             }
           ]
        },
        harena: {
          confirm: 'control/editor/edit/confirm',
          cancel:  'control/editor/edit/cancel'
        }
      } )
      .then( editor => {
        // const toolbarContainer = document.querySelector('#toolbar-editor')
        this._toolbarContainer.appendChild( editor.ui.view.toolbar.element );

        window.editor = editor;
        this._editor = editor;
        /*
        editor.editing.view.document.on( 'change:isFocused', ( evt, data, isFocused ) => {
          // console.log( `View document is focused: ${ isFocused }.` );
          if (!isFocused && this._textChanged) {
            this._textChanged = false
            this._updateTranslated()
          }
        } );
        */
        editor.model.document.on( 'change:data', () => {
          this._textChanged = true
        } );
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );
  }

  async _updateTranslated () {
    const mdTranslate = this._translateMarkdown(this._editor.getData())

    if (this._objField != null) {
      this._knotContent[this._element][this._objField] = mdTranslate
        .replace(/[\n\r]+$/igm, '').trim()
      await this._properties.applyProperties(false)
    } else {
      const objSet = this._translateObject(mdTranslate,
        this._knotContent[this._element].blockquote)

      // removes extra linefeeds
      if (objSet[objSet.length - 1].type == 'linefeed') { objSet.pop() }

      // redefines the sequence according to the new elements
      const seq = this._knotContent[this._element].seq
      const shift = objSet.length - 1
      for (let s = this._element + 1; s < this._knotContent.length; s++)
        { this._knotContent[s].seq += shift }

      // removes the previous element and insert the new one
      this._knotContent.splice(this._element, 1)
      for (let o = 0; o < objSet.length; o++) {
        objSet[o].seq = seq + o
        this._knotContent.splice(this._element + o, 0, objSet[o])
      }
    }
  }

  async _closeEditor() {
    MessageBus.int.unsubscribe('control/editor/edit/confirm', this.handleConfirm)
    MessageBus.int.unsubscribe('control/editor/edit/cancel', this.handleCancel)
    if (this._editorInstance)
      this._editorWrapper.removeChild(this._editorInstance)
    this._removeToolbarPanel()
    if (this._objField == null)
      await this._properties.closeProperties()
    // MessageBus.ext.publish('control/knot/update')
  }

  async handleConfirm() {
    this._updateTranslated()
    await this._closeEditor()
  }

  async handleCancel() {
    await this._closeEditor()
  }

  _removeToolbarPanel() {
    document.querySelector('#toolbar-editor').innerHTML = ''
  }

  _translateMarkdown (editContent) {
    let content = ''

    console.log('=== edit content')
    console.log(editContent)

    let htmlTranslate = editContent
      .replace(/<img([^>]*)title="([^"]*)"([^>]*)><figcaption>([^<]*)<\/figcaption>/igm,
               '<img$1title="$4"$3>')
      .replace(/<img([^>]*)><figcaption>([^<]*)<\/figcaption>/igm,
               '<img$1 title="$2">')
      .replace(/<figure class="image[^>]*style="width:([^;]*);">[^<]*<img([^>]*)><\/figure>/igm,
               '<figure><img$2 width="$1" height="$1"></figure>')
      .replace(/<figure class="image[^>]*>[^<]*<img([^>]*)><\/figure>/igm, '<img$1>')
      .replace(/<figure class="media"><oembed url="([^"]+)"><\/oembed><\/figure>/igm,
               '<video><source src="$1"></video>')
      .replace(/<figure[^>]*>/igm, '')
      .replace(/<\/figure[^>]*>/igm, '')

    if (htmlTranslate.includes('</table>')) {
      let tables = htmlTranslate.split('</table>')
      for (let tb in tables) {
        if (tb < tables.length - 1 && !tables[tb].includes('</thead>')) {
          tables[tb] = tables[tb].replace(/<tbody[^>]*>/im, '<thead>')
          const frp = tables[tb].indexOf('</tr>')
          tables[tb] = tables[tb].substring(0, frp).replace(/<td/igm, '<th')
                                                   .replace(/<\/td>/igm, '</th>') +
                       '</tr></thead>' + tables[tb].substring(frp + 5)
        }
      }
      htmlTranslate = tables.join('</table>')
    }

    let mt = new showdown.Converter()
    mt.setFlavor('github')
    let mdTranslate = mt.makeMarkdown(htmlTranslate)

    mdTranslate = mdTranslate
      .replace(/!\[null\]\(([^")]+)"([^"]+)"\)/igm, '![$2]($1"$2")')

    // removing extra lines
    mdTranslate = mdTranslate
      .replace(/[ \t\n\r\f]*(\!\[[^\]]*\]\([^)]*\))[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .replace(/[ \t\n\r\f]*(<video><source src="[^"]+"><\/video>)[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .trim()

    // changing bullets from - to +
    mdTranslate = mdTranslate
      .replace(/^-[ \t]/igm, '* ')

    mdTranslate = mdTranslate.replace(/<br>/igm, '\n')

    console.log('=== markdown translate')
    console.log(htmlTranslate)

    return mdTranslate
  }

  _translateObject (mdTranslate, blockquote) {
    const unity = { _source: mdTranslate }
    Translator.instance._compileUnityMarkdown(unity)
    Translator.instance._compileMerge(unity)
    if (blockquote != null) {
      for (const c of unity.content) {
        c.blockquote = true
        if (c.type == 'text-block') {
          for (const tb of c.content) { tb.blockquote = true }
        }
        Translator.instance.updateElementMarkdown(c)
      }
    }
    return unity.content
  }
}

(function () {
EditDCCText.templateFloating =
`<style>
  .dsty-border-editor {
     border-radius: 1px;
     box-shadow: 0px 0px 0px 20px rgba(0,0,0,0.5);
     margin: 15px;
  }
  .dsty-border {
     border: 1px solid black;
     border-radius: 5px;
     margin: 5px;
  }
  .dsty-editor {
     position: absolute;
     margin: auto;
     top: 0;
     right: 0;
     bottom: 0;
     left: 0;
     z-index: 100;
     width: 600px;
     height: 400px;
     overflow: hidden;
     display: flex;
     background: white;
     flex-direction: column;
  }
 </style>
 <div class="dsty-editor dsty-border-editor">
   <div id="presentation-inline-toolbar"></div>
   <div id="presentation-inline-editor">[content]</div>
 </div>`
})()
