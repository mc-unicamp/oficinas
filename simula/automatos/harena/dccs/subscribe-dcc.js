/* DCC Subscriber
  ***************/

class SubscribeDCC extends HTMLElement {
   connectedCallback() {
      this.publishWithRole = this.publishWithRole.bind(this);
      if (this.hasAttribute("message")) {
         this._targetObj = (this.hasAttribute("target"))
            ? document.querySelector("#" + this.target) : this.parentNode;

         if (!this.hasAttribute("role"))
            MessageBus.ext.subscribe(this.message, this._targetObj.notify);
         else
            MessageBus.ext.subscribe(this.message, this.publishWithRole);
      }
   }

   publishWithRole(topic, message) {
      this._targetObj.notify(topic, {role: this.role, body: message});
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return ["target", "message", "role"];
   }

   get target() {
      return this.getAttribute("target");
   }
   
   set target(newValue) {
      this.setAttribute("target", newValue);
   }
   
   get message() {
      return this.getAttribute("message");
   }
   
   set message(newValue) {
      this.setAttribute("message", newValue);
   }

   get role() {
      return this.getAttribute("role");
   }
   
   set role(newValue) {
      this.setAttribute("role", newValue);
   }
}

(function() {
   customElements.define("subscribe-dcc", SubscribeDCC);
})();