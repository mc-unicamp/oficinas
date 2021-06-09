/**
 * Entity DCC
 * 
 * xstyle = out -> in the outer space it first looks for the specific name and then for the generic "character" name
 */
class DCCEntity extends DCCBlock {
   constructor() {
      super();
      this._renderInterface = this._renderInterface.bind(this);
   }
   
   async connectedCallback() {
      this._speech = (this.hasAttribute("speech")) ? this.speech : this.innerHTML;
      this.innerHTML = "";

      super.connectedCallback();

      /*
      if (MessageBus.page.hasSubscriber("dcc/request/entity-sequence")) {
         let sequencem = await MessageBus.page.request("dcc/request/entity-sequence");
         this.sequence = sequencem.message;
      }
      
      if (!this.hasAttribute("xstyle") && MessageBus.page.hasSubscriber("dcc/request/xstyle")) {
         let stylem = await MessageBus.page.request("dcc/request/xstyle");
         this.xstyle = stylem.message;
      }

      if (document.readyState === "complete")
         this._renderInterface();
      else
         window.addEventListener("load", this._renderInterface);
      */
   }

   checkActivateAuthor() {
      if (this.author && this._presentationEntity) {
         for (let pr in this._presentationEntity) {
            this._presentationEntity[pr].style.cursor = "pointer";
            this._presentationEntity[pr].dccid = this.id;
            this._presentationEntity[pr].addEventListener("click",
               function(){
                  MessageBus.ext.publish("control/element/" + this.dccid + "/selected");
               }
            );
         }
      }
   }

   get presentation() {
      return (this._presentationEntity) ? this._presentationEntity : null;
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["sequence", "character", "speech", "xstyle"]);
   }

   get sequence() {
      return this.getAttribute("sequence");
   }
   
   set sequence(newValue) {
      this.setAttribute("sequence", newValue);
   }
   
   get entity() {
      return this.getAttribute("entity");
   }
   
   set entity(newValue) {
      this.setAttribute("entity", newValue);
   }
   
   get speech() {
      return this.getAttribute("speech");
   }
   
   set speech(newValue) {
      this.setAttribute("speech", newValue);
   }
   
   get xstyle() {
      return this.getAttribute("xstyle");
   }
   
   set xstyle(newValue) {
      this.setAttribute("xstyle", newValue);
   }
  
   /* Rendering */
   
   async _renderInterface() {
      this._presentationEntity = [];
      if (this.hasAttribute("xstyle") && this.xstyle.startsWith("out")) {
         await this._applyRender(this.entity,
                                 (this.xstyle == "out-image") ? "title" : "innerHTML",
                                 "");
         if (this._presentation != null) {
            this._presentationEntity.push(this._presentation);
            this._presentation = null;
         }
         /*
         let entity = this._injectEntityElement("#entity-entity");
         if (entity != null)
            entity.innerHTML = this.entity;
         */
            
         if (this.image) {
            await this._applyRender(this.image, "image", "-image");
            if (this._presentation != null) {
               this._presentationEntity.push(this._presentation);
               this._presentation = null;
            }
         }
         // <TODO> works for SVG but not for HTML
         /*
         let image = this._injectEntityElement("#entity-image");
         if (image != null)
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href",
                  "images/" + this.entity.replace(/ /igm, "_").toLowerCase() + ".png");
         */
         
         if (this._speech) {
            await this._applyRender(this._speech,
                                    (this.xstyle == "out-image") ? "title" : "innerHTML",
                                    "-text");
            if (this._presentation != null)
               this._presentationEntity.push(this._presentation);
         }
         /*
         this._presentation = this._injectEntityElement("#entity-speech");
         if (this._presentation != null)
            this._presentation.innerHTML = (this._speech) ? this._speech : "";
         */
      } else {
         let html = (this.hasAttribute("image"))
            ? DCCEntity.templateElements.image.replace("[image]", this.image) : "";
         html = html.replace("[alternative]",
            (this.hasAttribute("title")) ? " alt='" + this.title + "'" : "");
         html += DCCEntity.templateElements.text
            .replace("[entity]", this.entity)
            .replace("[speech]", ((this._speech) ? this._speech : ""));
         await this._applyRender(html, "innerHTML");
         if (this._presentation != null)
            this._presentationEntity.push(this._presentation);
         /*
         let charImg = "images/" + this.entity.toLowerCase()
                        .replace(/ /igm, "_") + ".png";
         let template = document.createElement("template");
         
         // const speech = (this.hasAttribute("speech")) ? this.speech : "";
         template.innerHTML = DCCEntity.templateElements
            .replace("[image]",charImg)
            .replace("[entity]", this.entity)
            .replace("[speech]", ((this._speech) ? this._speech : ""));
         this._shadow = this.attachShadow({mode: "open"});
         this._shadow.appendChild(template.content.cloneNode(true));
         this._presentation = this._shadow.querySelector("#presentation-dcc");
         */
      }

      this.checkActivateAuthor();
   }
   
   /*
   _injectEntityElement(prefix) {
      const charLabel = this.entity.replace(/ /igm, "_").toLowerCase();
      
      // search sequence: by name, by number, generic
      let target = document.querySelector(prefix + "-" + charLabel);
      if (target == null && this.hasAttribute("sequence"))
         target = document.querySelector(prefix + "-" + this.sequence);
      if (target == null)
         target = document.querySelector(prefix);
      
      return target;
   }
   */

   /* Rendering */

   elementTag() {
      return DCCEntity.elementTag;
   }

   externalLocationType() {
      return "entity";
   }
}

/*
 * <TODO> Its task was absorbed by dcc-styler.
 */
/*
class DCCDialog extends DCCBase {
   constructor() {
      super();
      this._sequence = 0;
      this.requestSequence = this.requestSequence.bind(this);
   }

   connectedCallback() {
      MessageBus.page.subscribe("dcc/request/entity-sequence", this.requestSequence);
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/request/entity-sequence", this.requestSequence);
   }

   requestSequence(topic, message) {
      this._sequence++;
      // MessageBus.page.publish("dcc/entity-sequence/" + message, this._sequence);
      MessageBus.page.publish(MessageBus.buildResponseTopic(topic, message),
                              this._sequence);
   }
}
*/

(function() {
   DCCEntity.templateStyle = 
      `<style>
           @media (orientation: landscape) {
             .dcc-entity-style {
               display: flex;
               flex-direction: row;
             }
           }
           
           @media (orientation: portrait) {
             .dcc-entity-style {
               display: flex;
               flex-direction: column;
             }
           }
          .dcc-speech {
             flex-basis: 100%;
          }
      </style>
      <div id="presentation-dcc" class="dcc-entity-style"></div>
      </div>`;
         
   DCCEntity.templateElements = {
      image: "<div><img id='dcc-entity-image' src='[image]'[alternative] width='100px'></div>",
      text:  "<div><div id='dcc-entity-text' class='dcc-speech'>[speech]</div></div>"
   };
   
   // DCCDialog.editableCode = false;
   // customElements.define("dcc-dialog", DCCDialog);
   // DCCEntity.editableCode = false;

   DCCEntity.elementTag = "dcc-entity";
   customElements.define(DCCEntity.elementTag, DCCEntity);
})();