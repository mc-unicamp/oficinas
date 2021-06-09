/**
 * Base for all visual components
 */

class DCCVisual extends DCCBase {
   static get observedAttributes() {
      return DCCBase.observedAttributes;
   }

   connectedCallback() {
      this.checkActivateAuthor();
   }

   checkActivateAuthor() {
      if (this.author && this._presentation) {
         this._presentation.style.cursor = "pointer";
         this._presentation.dccid = this.id;
         this.selectListener = this.selectListener.bind(this);
         this._presentation.addEventListener("click", this.selectListener);
      }
   }

   selectListener() {
      MessageBus.ext.publish("control/element/" + this.id + "/selected");
   }

   get presentation() {
      return (this._presentation) ? this._presentation : null;
   }
}