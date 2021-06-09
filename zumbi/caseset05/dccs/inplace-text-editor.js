/* Editor for DCC Texts
  *********************/

/* Extension of the Quill Editor */

let Inline = Quill.import('blots/inline');

class MetadataBlot extends Inline {
   static create(value) {
      console.log(value);
      let node = super.create();
      node.setAttribute("value", value);
      if (value.style)
         node.classList.add(value.style);
      else if (EditDCCText.metadataStyle[value.type])
         node.classList.add(EditDCCText.metadataStyle[value.type]);
      //  node.style.backgroundColor = value.color;
      return node;
   }

   static formats(node) {
      return node.getAttribute("value");
   }
}
MetadataBlot.blotName = "metadata";
MetadataBlot.tagName = "span";
Quill.register(MetadataBlot);

class EditDCCText {
   constructor(element) {
     this._handleHighlighter = this._handleHighlighter.bind(this);
     this._handleAnnotation = this._handleAnnotation.bind(this);
     this._handleHlSelect = this._handleHlSelect.bind(this);
     this._handleConfirm = this._handleConfirm.bind(this);
     this._handleCancel = this._handleCancel.bind(this);
     this._editElement = element;
     this._toolbarControls = EditDCCText.toolbarTemplate +
                             EditDCCText.toolbarTemplateHighlighter +
                             EditDCCText.toolbarTemplateConfirm;
     this._buildEditor(false);
   }

   _buildEditor(selectOptions) {
      this._container = document;
      if (window.parent && window.parent.document) {
         const cont = window.parent.document.querySelector("#inplace-editor-wrapper");
         if (cont != null)
            this._container = cont;
      }
      this._containerRect = this._container.getBoundingClientRect();
      this._elementRect = this._editElement.getBoundingClientRect();

      this._editorToolbar = this._buildToolbarPanel();
      this._container.appendChild(this._editorToolbar);

      this._editor = this._buildEditorPanel();
      this._container.appendChild(this._editor);

      this._buildQuillEditor(selectOptions);

      if (selectOptions)
         this._formatSelectOptions();
   }

   _buildToolbarPanel() {
      let editorToolbar = document.createElement("div");
      editorToolbar.classList.add("inplace-editor-floating");
      editorToolbar.innerHTML = this._toolbarControls;

      editorToolbar.style.left = this._transformRelativeX(
         this._elementRect.left - this._containerRect.left);
      editorToolbar.style.bottom = this._transformRelativeY(
         this._containerRect.height - (this._elementRect.top - this._containerRect.top));
      return editorToolbar;
   }

   _buildEditorPanel() {
      let editor = document.createElement("div");
      editor.style.position = "absolute";
      editor.style.left = this._transformRelativeX(
         this._elementRect.left - this._containerRect.left);
      editor.style.top = this._transformRelativeY(
         this._elementRect.top - this._containerRect.top);
      editor.style.width = this._transformRelativeX(this._elementRect.width);
      editor.style.height = this._transformRelativeY(this._elementRect.height);
      editor.style.fontSize =
         window.getComputedStyle(this._editElement, null).getPropertyValue("font-size");
      editor.innerHTML =
         EditDCCText.editorTemplate
            .replace("[width]", this._transformViewportX(this._elementRect.width))
            .replace("[height]", this._transformViewportY(this._elementRect.height))
            .replace("[content]", this._editElement.innerHTML);
      return editor;
   }

   // builds a Quill editor
   _buildQuillEditor(selectOptions) {
      let inplaceContent = this._editor.querySelector("#inplace-content");

      this._quill = new Quill(inplaceContent, 
         {theme: "snow",
          modules: {
             toolbar: {
               container: this._editorToolbar,
               handlers: {
                  "highlighter" : this._handleHighlighter,
                  "annotation"  : this._handleAnnotation,
                  "hl-select"   : this._handleHlSelect,
                  "confirm"     : this._handleConfirm,
                  "cancel"      : this._handleCancel
               }
             }
          }
         });
      this._editor.classList.add("inplace-editor");

      // toolbar customization
      document.querySelector(".ql-annotation").innerHTML =
         EditDCCText.buttonAnnotationSVG;
      if (!selectOptions)
         document.querySelector(".ql-highlighter").innerHTML =
            EditDCCText.buttonHighlightSVG;
      // document.querySelector(".ql-hl-select").style.display = "none";
      document.querySelector(".ql-confirm").innerHTML =
         EditDCCText.buttonConfirmSVG;
      document.querySelector(".ql-cancel").innerHTML =
         EditDCCText.buttonCancelSVG;
   }

   _removeEditor() {
      this._container.removeChild(this._editorToolbar);
      this._container.removeChild(this._editor);
   }

   _buildAnnotationPanel() {
      let editorAnnotation = document.createElement("div");
      editorAnnotation.classList.add("inplace-editor-floating");
      editorAnnotation.innerHTML = EditDCCText.annotationTemplate;

      const toolbarRect = this._editorToolbar.getBoundingClientRect();
      editorAnnotation.style.left = this._transformRelativeX(
         this._elementRect.left - this._containerRect.left);
      editorAnnotation.style.bottom = this._transformRelativeY(
         this._containerRect.height - (this._elementRect.top - this._containerRect.top));

      this._buttonAnConfirm = editorAnnotation.querySelector("#an-confirm");
      this._buttonAnCancel  = editorAnnotation.querySelector("#an-cancel");
      this._anContent = editorAnnotation.querySelector("#an-content");

      return editorAnnotation;
   }

   async _loadSelectOptions() {
      let context =
         await Context.instance.loadContext("http://purl.org/versum/evidence/");
      this._highlightOptions = {};
      for (let c in context.states)
         this._highlightOptions[context.states[c]["@id"]] =
            {label: c,
             style: context.states[c].style};

      this._toolbarControls = EditDCCText.toolbarTemplate +
                              "<select class='ql-hl-select'>" +
                              EditDCCText.toolbarTemplateConfirm;
      for (let op in this._highlightOptions) {
         this._toolbarControls +=
            "<option value='" + op + "'>" +
            this._highlightOptions[op].label + "</option>";
      }
      this._toolbarControls += "</select>";
      this._removeEditor();
      this._buildEditor(true);
   }

   _formatSelectOptions() {
      // transforms the highlight select options in HTML
      const selectOptions =
         document.querySelectorAll(".ql-hl-select .ql-picker-item");
      const selectItems = Array.prototype.slice.call(selectOptions);
      selectItems.forEach(item => item.textContent = item.dataset.label);

      this._hlSelect = document.querySelector(
         ".ql-hl-select .ql-picker-label");
      this._hlSelectHTML = this._hlSelect.innerHTML;
      this._hlSelect.innerHTML =
         "<span style='color:lightgray'>diagnostics</span>" +
         this._hlSelectHTML;
   }

   /*
    * Relative positions defined in percent are automatically adjusted with resize
    */

   _transformRelativeX(x) {
      return (x * 100 / this._containerRect.width) + "%";
   }

   _transformRelativeY(y) {
      return (y * 100 / this._containerRect.height) + "%";
   }

   /*
    * Positions transformed to the viewport size
    */

   _transformViewportX(x) {
      return (x * Basic.referenceViewport.width / this._containerRect.width);
   }

   _transformViewportY(y) {
      return (y * Basic.referenceViewport.height / this._containerRect.height);
   }

   _handleHlSelect(hlSelect) {
      this._hlSelect.innerHTML = this._highlightOptions[hlSelect].label +
                                 this._hlSelectHTML;
      const range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: {type:  "option",
                    label: this._highlightOptions[hlSelect].label,
                    style: this._highlightOptions[hlSelect].style}
      });
   }

   async _handleAnnotation() {
      const range = this._quill.getSelection();

      this._editorAnnotation = this._buildAnnotationPanel();
      this._container.appendChild(this._editorAnnotation);

      let promise = new Promise((resolve, reject) => {
         const callback = function(button) { resolve(button); };
         this._buttonAnConfirm.onclick = function(e) {
            callback("confirm");
         };
         this._buttonAnCancel.onclick = function(e) {
            callback("cancel");
         };
      });
      let buttonClicked = await promise;
      this._container.removeChild(this._editorAnnotation);

      if (buttonClicked == "confirm")
         this._quill.formatText(range.index, range.length, {
            metadata: {type: "annotation",
                       content: this._anContent.value}
         });
   }

   _handleHighlighter() {
      const range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: {type: "select"}
      });
      this._loadSelectOptions();
      // document.querySelector(".ql-hl-select").style.display = "initial";
   }

   _handleConfirm() {
   }

   _handleCancel() {
      this._removeEditor();
   }
}

(function() {
/* icons from Font Awesome, license: https://fontawesome.com/license */
// comment-alt https://fontawesome.com/icons/comment-alt?style=regular
EditDCCText.buttonAnnotationSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z">
</path></svg>`;

// highlighter https://fontawesome.com/icons/highlighter?style=solid
EditDCCText.buttonHighlightSVG =
`<svg viewBox="0 0 544 512">
<path fill="currentColor" d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z">
</path></svg>`;

// check-square https://fontawesome.com/icons/check-square?style=regular
EditDCCText.buttonConfirmSVG =
`<svg viewBox="0 0 448 512">
<path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z">
</path></svg>`;

// window-close https://fontawesome.com/icons/window-close?style=regular
EditDCCText.buttonCancelSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z">
</path></svg>`;

EditDCCText.toolbarTemplate =
`<button class="ql-bold"></button>
<button class="ql-italic"></button>
<button class="ql-annotation"></button>`;

EditDCCText.toolbarTemplateHighlighter =
`<button class="ql-highlighter"></button>`;

EditDCCText.toolbarTemplateConfirm =
`<button class="ql-confirm"></button>
<button class="ql-cancel"></button>`;

EditDCCText.editorTemplate =
`<svg viewBox="0 0 [width] [height]">
   <foreignObject width="100%" height="100%">
      <div id="inplace-content">[content]</div>
   </foreignObject>
</svg>`;

EditDCCText.annotationTemplate =
`<div class="annotation-bar">Annotation
    <div class="annotation-buttons">` +
`      <div id="an-confirm" style="width:24px">` +
          EditDCCText.buttonConfirmSVG + `</div>` +
`      <div id="an-cancel" style="width:28px">` +
          EditDCCText.buttonCancelSVG + `</div>` +
`   </div>
</div>
<textarea id="an-content" rows="3" cols="20"></textarea>`;

EditDCCText.metadataStyle = {
   annotation: "dcc-text-annotation",
   select: "dcc-state-select-area"
};

})();