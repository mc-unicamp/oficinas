/* Annotation DCC
  ***************/
class DCCAnnotation extends DCCVisual {
   connectedCallback() {
      let template = document.createElement("template");
      template.innerHTML =
         "<style> @import '" +
            Basic.service.themeStyleResolver("dcc-annotation.css") +
         "' </style>" +
         "<span class='dcc-text-annotation'><slot></slot></span>";
      let shadow = this.attachShadow({mode: "open"});
      shadow.appendChild(template.content.cloneNode(true));
      super.connectedCallback();
   }

   /* Attribute Handling */
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["annotation"]);
   }

   get annotation() {
      return this.getAttribute("annotation");
   }
   
   set label(newValue) {
      this.setAttribute("label", newValue);
   }
}

(function() {
   DCCAnnotation.elementTag = "dcc-annotation";

   customElements.define(DCCAnnotation.elementTag, DCCAnnotation);
})();