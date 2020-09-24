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

   selectListener(event) {
      MessageBus.ext.publish("control/element/" + this.id + "/selected");
   }

   get presentation() {
      return (this._presentation) ? this._presentation : null;
   }

   _storePresentation(presentation) {
      this._presentation = presentation;
   }
}

class DCCMultiVisual extends DCCVisual {
   constructor() {
      super();
      this._presentationSet = [];
   }

   _storePresentation(presentation, role) {
      super._storePresentation(presentation);
      if (presentation != null) {
         if (role)
            presentation.subRole = role;
         this._presentationSet.push(presentation);
      }
   }

   checkActivateAuthor() {
      if (this.author) {
         for (let pr in this._presentationSet) {
            if (this._presentationSet[pr].style.cursor != "pointer") {
               this._presentationSet[pr].style.cursor = "pointer";
               this._presentationSet[pr].dccid = this.id;
               this._presentationSet[pr].addEventListener("click",
                  function() {
                     if (this.subRole)
                        MessageBus.ext.publish("control/element/" + this.dccid + "/selected", this.subRole);
                     else
                        MessageBus.ext.publish("control/element/" + this.dccid + "/selected");
                  }
               );
            }
         }
      }
   }
}