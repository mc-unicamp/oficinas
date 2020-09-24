/* Markdown DCC
  *************/
class DCCMarkdown extends DCCVisual {
   connectedCallback() {
      this._content = this.innerHTML;
      this.innerHTML = "<div id='presentation-dcc'>" + this._content + "</div>";
      this._presentation = this.querySelector("#presentation-dcc");
      super.connectedCallback();
   }

   /* Properties
      **********/
   static get observedAttributes() {
      return DCCVisual.observedAttributes();
   }

   editProperties() {
      delete this._presentation.style.cursor;
      this._presentation.removeEventListener("click", this.selectListener);
      // this._editor = new EditDCCText(this._presentation);
   }
}

(function() {
   customElements.define("dcc-markdown", DCCMarkdown);
})();