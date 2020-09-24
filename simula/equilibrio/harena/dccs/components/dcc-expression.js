/* Expression DCC
 ****************/
class DCCExpression extends DCCVisual {
   constructor() {
     super();
   }
   
   async connectedCallback() {
      // <TODO> provisory solution due to message ordering
      this._updated = false

      if (this.active) {
         this.variableUpdated = this.variableUpdated.bind(this);
         MessageBus.ext.subscribe(
            "var/" + this.expression + "/set", this.variableUpdated);
      }

      const result = await MessageBus.ext.request(
         "var/" + this.expression + "/get");

      // <TODO> provisory solution due to message ordering
      if (!this._updated)
        this.innerHTML = result.message;

      super.connectedCallback();
   }

   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["expression", "active"]);
   }

   get expression() {
      return this.getAttribute("expression");
   }
   
   set expression(newValue) {
      this.setAttribute("expression", newValue);
   }

   // defines if the displey is activelly updated
   get active() {
      return this.hasAttribute("active");
   }

   set active(isActive) {
      if (isActive) {
         this.setAttribute("active", "");
      } else {
         this.removeAttribute("active");
      }
   }

   variableUpdated(topic, message) {
      // <TODO> provisory solution due to message ordering
      this._updated = true;

      this.innerHTML = message;
   }
}

(function() {
   DCCExpression.elementTag = "dcc-expression";
   customElements.define(DCCExpression.elementTag, DCCExpression);
})();