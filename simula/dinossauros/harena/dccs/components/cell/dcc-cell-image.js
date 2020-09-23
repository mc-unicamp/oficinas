/**
 * Static Cell Image
 */

class DCCCellImage extends DCCCell {
   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["image"]);
   }

   get image() {
      return this.getAttribute("image");
   }
   
   set image(newValue) {
      this.setAttribute("image", newValue);
   }

   createIndividual(row, col) {
      let element = this.createSVGElement("image", row, col);
      element.setAttribute("href", this.image);
      return new DCCCellLight(this, element);
   }
}

(function() {
   customElements.define("dcc-cell-image", DCCCellImage);
})();