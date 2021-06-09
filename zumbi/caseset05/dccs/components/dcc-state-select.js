/* State Select DCC
 ********************/
class DCCStateSelect extends DCCVisual {
   constructor() {
     super();
     
     this._pendingRequests = 0;
     
     this._currentState = 0;
     this._stateVisible = false;
     
     // Without shadow - not working
     /*
     const text = this.innerHTML;
     this.innerHTML = DCCStateSelect.templateElements;
     this.querySelector("#presentation-text").innerHTML = text;
     this._presentation = this.querySelector("#presentation-dcc");
     this._presentationState = this.querySelector("#presentation-state");
     */
     
     this._showState = this._showState.bind(this);
     this._hideState = this._hideState.bind(this);
     this._changeState = this._changeState.bind(this);
     this.defineStates = this.defineStates.bind(this);
   }
   
   createdCallback() {
     this._renderInterface();
   }

   attributeChangedCallback(name, oldValue, newValue) {
     this._renderInterface();
   }
   
   async connectedCallback() {
      // const theme = await MessageBus.ext.request("control/_current_theme_name/get");

      DCCStateSelect.templateElements =
      "<style> @import '" +
         Basic.service.themeStyleResolver("dcc-state-select.css") +
      "' </style>" +
      `<span id="presentation-dcc">
         <span id="presentation-text"><slot></slot></span>
         <span id="presentation-state"></span>
      </span>`;

      let template = document.createElement("template");
      template.innerHTML = DCCStateSelect.templateElements;

      // Basic.service.replaceStyle(template, null, newValue, "dcc-state-select.css");
     
      this._shadow = this.attachShadow({mode: "open"});
      this._shadow.appendChild(template.content.cloneNode(true));
     
      this._presentation = this._shadow.querySelector("#presentation-dcc");
      this._presentationState = this._shadow.querySelector("#presentation-state");
     
      // <TODO> limited: considers only one group per page
      this.completeId = this.id; 
      if (!this.hasAttribute("states") && MessageBus.page.hasSubscriber("dcc/request/select-states")) {
         const variableMess = await MessageBus.page.request("dcc/select-variable/request", this.id, "dcc/select-variable/" + this.id);
         this.variable = variableMess.message;
         this.completeId = this.variable + "." + this.id;

         MessageBus.page.subscribe("dcc/select-states/" + this.id, this.defineStates);
         MessageBus.page.publish("dcc/request/select-states", this.id);
         this._pendingRequests++;
      }
      
      this._checkRender();

      MessageBus.ext.publish("var/" + this.completeId + "/subinput/ready",
                                    {sourceType: DCCStateSelect.elementTag,
                                     content: this.innerHTML});
      super.connectedCallback();
   }
   
   disconnectedCallback() {
      this._presentation.removeEventListener('mouseover', this._showState);
      this._presentation.removeEventListener('mouseout', this._hideState);
      this._presentation.removeEventListener('click', this._changeState);
   }

   // deactivates the authoring mode
   checkActivateAuthor() {
      /* nothing */
   }

   defineStates(topic, message) {
      MessageBus.page.unsubscribe("dcc/select-states/" + this.id, this.defineStates);
      this.states = message;
      this._pendingRequests--;
      this._checkRender();
   }
   
   /*
    * Property handling
    */
   
   // <TODO> remove "answer" and "player"?
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["variable", "states", "colors", "answer", "player"]);
   }

   get variable() {
     return this.getAttribute("variable");
   }

   set variable(newValue) {
     this.setAttribute("variable", newValue);
   }

   get states() {
     return this.getAttribute("states");
   }

   set states(newStates) {
     this.setAttribute("states", newStates);
   }

   get colors() {
     return this.getAttribute("colors");
   }

   set colors(newColors) {
     this.setAttribute("colors", newColors);
   }
   
   get answer() {
      return this.getAttribute("answer");
    }

   set answer(newValue) {
      this.setAttribute("answer", newValue);
   }
   
   get player() {
      return this.getAttribute("player");
    }

   set player(newValue) {
      this.setAttribute("player", newValue);
   }
   
   /* Rendering */

   async _checkRender() {
      if (this._pendingRequests >= 0 && this.states != null) {
         const statesArr = this.states.split(",");
         if (this.hasAttribute("answer") || this.author)
            this._currentState = statesArr.indexOf(this.answer);
         else if (this.hasAttribute("player")) {
            let value = await MessageBus.ext.request(
                  "var/" + this.player + "/get/sub", this.innerHTML);
            this._currentState = statesArr.indexOf(value.message);
         } else {
            this._presentation.addEventListener("mouseover", this._showState);
            this._presentation.addEventListener("mouseout", this._hideState);
            this._presentation.addEventListener("click", this._changeState);
         }

         this._renderInterface();
      }
   }
   
   _renderInterface() {
     if (this._presentation != null) {
       if (this._presentationState != null) {
          if (this._stateVisible && this.states != null) {
             const statesArr = this.states.split(",");
             this._presentationState.innerHTML = "[" + statesArr[this._currentState] + "]";
          } else
             this._presentationState.innerHTML = "";
       }
       this._presentation.className =
          DCCStateSelect.elementTag + "-template " +
          DCCStateSelect.elementTag + "-" + this._currentState + "-template";
     }
   }
   
   /* Event handling */
   
   _showState() {
     this._stateVisible = true;
     this._renderInterface();
   }
   
   _hideState() {
     this._stateVisible = false;
     this._renderInterface();
   }
   
   _changeState() {
     if (this.states != null) {
       const statesArr = this.states.split(",");
       this._currentState = (this._currentState + 1) % statesArr.length;
       MessageBus.ext.publish("var/" + this.completeId + "/state_changed",
             {sourceType: DCCInput.elementTag,
              state: statesArr[this._currentState]});
     }
     this._renderInterface();
   }
   
}

/* Group Select DCC
 ********************/
class DCCGroupSelect extends DCCBlock {
   constructor() {
     super();
     this.requestVariable = this.requestVariable.bind(this); 
     this.requestStates = this.requestStates.bind(this);
  }
   
   connectedCallback() {
      this._statement = (this.hasAttribute("statement"))
         ? this.statement : this.innerHTML;
      this.innerHTML = "";

      super.connectedCallback();

      MessageBus.page.subscribe("dcc/select-variable/request", this.requestVariable);
      MessageBus.page.subscribe("dcc/request/select-states", this.requestStates);
      
      MessageBus.ext.publish("var/" + this.variable + "/group_input/ready",
                                    DCCGroupSelect.elementTag);
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/select-variable/request", this.requestVariable);
      MessageBus.page.unsubscribe("dcc/request/select-states", this.requestStates);
   }
   
   
   requestStates(topic, message) {
      MessageBus.page.publish("dcc/select-states/" + message, this.states);
   }   
   
   requestVariable(topic, message) {
      MessageBus.page.publish("dcc/select-variable/" + message, this.variable);
   }
   
   /*
    * Property handling
    */

   static get observedAttributes() {
    return ["statement", "variable", "states", "labels", "colors"];
   }

   get statement() {
      return this.getAttribute("statement");
   }
   
   set statement(newValue) {
      this.setAttribute("statement", newValue);
   }
   
   get variable() {
      return this.getAttribute("variable");
    }

   set variable(newValue) {
      this.setAttribute("variable", newValue);
   }

   get states() {
     return this.getAttribute("states");
   }

    set states(newStates) {
     this.setAttribute("states", newStates);
   }

   get labels() {
     return this.getAttribute("labels");
   }

    set labels(newStates) {
     this.setAttribute("labels", newStates);
   }

   get colors() {
     return this.getAttribute("colors");
   }

    set colors(newColors) {
     this.setAttribute("colors", newColors);
   }

   async _renderInterface() {
      console.log("=== statement");
      console.log(this._statement);
      // === presentation setup (DCC Block)
      this._applyRender(this._statement, "innerHTML");
   }

   externalLocationType() {
      return "input";
   }
}

(async function() {

/*
DCCStateSelect.templateElements = 
`<style>
   @import "css/dcc-state-select.css"
</style>
<span id="presentation-dcc">
   <span id="presentation-text"><slot></slot></span>
   <span id="presentation-state"></span>
</span>`;
*/
  
DCCStateSelect.elementTag = "dcc-state-select";
customElements.define(DCCStateSelect.elementTag, DCCStateSelect);

DCCGroupSelect.elementTag = "dcc-group-select";
customElements.define(DCCGroupSelect.elementTag, DCCGroupSelect);

})();