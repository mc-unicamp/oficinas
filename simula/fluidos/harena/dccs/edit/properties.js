/**
 * Properties Editor
 *
 * Edits properties according to the type.
 */

class Properties {
   constructor() {
      // this._author = author;

      /*
      this._panelDetails = document.querySelector("#properties-panel");
      this._panelDetailsButtons = document.querySelector("#properties-buttons");
      */

      this.applyPropertiesDetails = this.applyPropertiesDetails.bind(this);
      MessageBus.ext.subscribe("properties/apply/details",
         this.applyPropertiesDetails);
      this.applyPropertiesShort = this.applyPropertiesShort.bind(this);
      MessageBus.ext.subscribe("properties/apply/short",
         this.applyPropertiesShort);
   }

   attachPanelDetails(panel) {
      this._panelDetails = panel;
   }

   editKnotProperties(obj, knotId, presentation, extra) {
      this._knotOriginalTitle = obj.title;
      const editp = this.editProperties(obj);
      this._editor = new EditDCCProperties(null, presentation,
         editp.htmls + extra);
   }

   editElementProperties(knots, knotid, el, dcc, role) {
      this._knots = knots;
      const knotContent = knots[knotid].content;
      const element = dcc.currentPresentation();
      let obj = knotContent[el];
      if (this._knotOriginalTitle)
         delete this._knotOriginalTitle;
      const editp = this.editProperties(obj, role);
      // <TODO> Provisory
      const svg = ["jacinto", "simple-svg"].
         includes(Basic.service.currentThemeFamily);
      console.log("=== todos");
      console.log(knotContent);
      console.log(el);
      console.log(dcc);

      if (editp.inlineProperty != null) {
         switch (editp.inlineProfile.type) {
            case "void":
               this._editor = new EditDCCPlain(obj, dcc, editp.htmls);
               break;
            case "text":
               this._editor = new EditDCCText(knotContent, el, dcc, svg);
               break;
            case "shortStr":
               this._editor = new EditDCCPlain(obj, dcc, editp.htmls,
                                               editp.inlineProperty);
               break;
            case "image":
               this._editor = new EditDCCImage(obj, dcc, editp.htmls);
               break;
         }
      } else
         this._editor = new EditDCCProperties(obj, dcc, editp.htmls);
      /*
      switch (obj.type) {
         case "text": 
         case "text-block":
            this._editor = new EditDCCText(knotContent, el, element, svg);
            break;
         case "entity": 
            if (role)
               switch (role) {
                  case "text":
                  case "entity": this._editor = 
                                    new EditDCCText(knotContent, el, element, svg);
                                 break;
                  case "image":  this._editor = new EditDCCImage(obj, element);
                                 break;
               }
            else
               this._editor = new EditDCCText(knotContent, el, element, svg);
            break;
         case "option":
            if (obj.image)
               this._editor = new EditDCCImage(obj, element);
            else
               this._editor = new EditDCCPlain(obj, "label", dcc, htmlProp);
            break;
      }
      */
   }

   /*
    * Structure of the editable object
    */
   editProperties(obj, role) {
      this._objProperties = obj;

      const profile = this._typeProfile(obj);
      let seq = 1;
      let htmlD = "";
      let htmlS = "";
      let inlineProperty = null;
      let inlineProfile = null;
      for (let p in profile) {
         if (profile[p].visual == "inline" &&
             (role == null || profile[p].role == role)) {
            inlineProperty = p;
            inlineProfile = profile[p];
         }
         if (profile[p].type != "void") {
            if (!profile[p].composite) {
               let html = this._editSingleProperty(
                  profile[p], ((obj[p]) ? obj[p] : ""), seq);
               htmlD += html.details;
               if (profile[p].visual == "panel")
                  htmlS += html.short;
               seq++;
            } else {
               for (let s in profile[p].composite) {
                  if (profile[p].composite[s].visual == "inline" &&
                      (role == null || profile[p].composite[s].role == role)) {
                     inlineProperty = p;
                     inlineProfile = profile[p].composite[s];
                  }
                  let html = this._editSingleProperty(
                     profile[p].composite[s],
                     ((obj[p] && obj[p][s]) ? obj[p][s] : ""), seq);
                  htmlD += html.details;
                  if (profile[p].visual == "panel")
                     htmlS += html.short;
                  seq++;
               }
            }
         }
      }
      this._panelDetails.innerHTML = htmlD;
      // this._panelDetailsButtons.style.display = "flex";
      return {inlineProperty: inlineProperty,
              inlineProfile:  inlineProfile,
              htmls: htmlS};
   }

   _typeProfile(obj) {
      let profile = Properties.elProfiles[obj.type];
      if (Properties.hasSubtypes.includes(obj.type)) {
         profile = profile[
            (obj.subtype) ? obj.subtype : Properties.defaultSubtype[obj.type]];
      }
      return profile;
   }

   _editSingleProperty(property, value, seq) {
      if (property.type == "shortStrArray" && value.length > 0)
         value = value.join(",");
      else if (property.type == "variable")
         value = (value.includes("."))
                  ? value.substring(value.lastIndexOf(".")+1) : value;
      else if (property.type == "select" &&
                 typeof property.options === "string") {
         switch (property.options) {
            case "selectVocabulary":
               property.options = Context.instance.listSelectVocabularies();
               property.options.unshift(["", ""]);
               break;
            case "selectKnot":
               property.options = [];
               const knotList = Object.keys(this._knots);
               for (let k = 0; k < knotList.length; k++) {
                  if (k == knotList.length-1 ||
                      !knotList[k+1].startsWith(knotList[k]))
                  property.options.push([knotList[k], knotList[k]]);
               }
               break;
         }
      }
      let fields = null;
      if (property.type != "select")
         fields = Properties.fieldTypes[property.type]
                            .replace(/\[label\]/igm, property.label)
                            .replace(/\[value\]/igm, value);
      else {
         fields = Properties.fieldTypes.selectOpen
                            .replace(/\[label\]/igm, property.label);
         let hasSelection = false;
         for (let o in property.options) {
            const opvalue = (typeof property.options[o] === "string")
                            ? property.options[o] : property.options[o][0];
            const oplabel = (typeof property.options[o] === "string")
                            ? property.options[o] : property.options[o][1];
            const selected = (value == opvalue) ? " selected" : "";
            if (value == opvalue)
               hasSelection = true;
            fields += Properties.fieldTypes.selectOption
                                .replace(/\[opvalue\]/igm, opvalue)
                                .replace(/\[oplabel\]/igm, oplabel)
                                .replace(/\[selected\]/igm, selected);
         }
         if (!hasSelection)
            fields += Properties.fieldTypes.selectOption
                                .replace(/\[opvalue\]/igm, value)
                                .replace(/\[oplabel\]/igm, value)
                                .replace(/\[selected\]/igm, " selected");
         fields += Properties.fieldTypes.selectClose;
      }

      return {details: fields.replace(/\[n\]/igm, seq + "_d"),
              short:   fields.replace(/\[n\]/igm, seq + "_s")};
   }

   /*
   clearProperties() {
      this._panelDetails.innerHTML = "";
      this._panelDetailsButtons.style.display = "none";
   }
   */

   async applyPropertiesDetails(topic, message) {
      this._applyProperties(topic, message, true);
   }

   async applyPropertiesShort(topic, message) {
      this._applyProperties(topic, message, false);
   }

   async _applyProperties(topic, message, details) {
      const sufix = (details) ? "_d" : "_s";
      const panel = (details)
         ? this._panelDetails : this._editor.editorExtended;
      if (this._objProperties) {
         const profile = this._typeProfile(this._objProperties);
         let seq = 1;
         for (let p in profile) {
            if (profile[p].type != "void") {
               if (!profile[p].composite) {
                  if (details || profile[p].visual == "panel") {
                     const objProperty =
                        await this._applySingleProperty(profile[p], seq, panel, sufix);
                     if (objProperty != null)
                        this._objProperties[p] = objProperty;
                  }
                  seq++;
               } else {
                  for (let s in profile[p].composite) {
                     if (details || profile[p].visual == "panel") {
                        const objProperty = await this._applySingleProperty(
                           profile[p].composite[s], seq, panel, sufix);
                        if (objProperty != null &&
                            (typeof objProperty != "string" ||
                              objProperty.trim().length > 0)) {
                           if (!this._objProperties[p])
                              this._objProperties[p] = {};
                           this._objProperties[p][s] = objProperty;
                        }
                     }
                     seq++;
                  }
               }
            }
         }

         Translator.instance.updateElementMarkdown(this._objProperties);

         if (this._knotOriginalTitle &&
             this._knotOriginalTitle != this._objProperties.title) {
            MessageBus.ext.publish("control/knot/rename",
                                   this._objProperties.title);
            delete this._knotOriginalTitle;
         }

         delete this._objProperties;
         MessageBus.ext.publish("control/knot/update");
         if (!details)
            MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message));
     }
   }

   async _applySingleProperty(property, seq, panel, sufix) {
      let objProperty = null;
      let field =
         panel.querySelector("#pfield" + seq + sufix);
      switch (property.type) {
         case "shortStr" :
         case "text":
            const value = field.value.trim();
            if (value.length > 0)
               objProperty = value;
            break;
         case "shortStrArray" :
            const catStr = field.value.trim();
            if (catStr.length > 0) {
               let categories = catStr.split(",");
               for (let c in categories)
                  categories[c] = categories[c].trim();
               objProperty = categories;
            }
            break;
         case "select":
            objProperty = field.value;
            break;
         case "image":
            // uploads the image
            if (field.files[0]) {
               const asset = await
                  MessageBus.ext.request("data/asset//new",
                       {file: field.files[0],
                        caseid: Basic.service.currentCaseId});
               objProperty = asset.message;
            }
            break;
      }
      return objProperty;
   }
}

(function() {

Properties.elProfiles = {
knot: {
   title: {type: "shortStr",
           label: "Title",
           visual: "panel"},
   categories: {type: "shortStrArray",
                label: "Categories"},
   level: {type: "shortStr",
           label: "Level"}
},
text: {
   content: {type: "text",
             label: "Text",
             visual: "inline"}
},
"text-block": {
   content: {type: "text",
             label: "Text",
             visual: "inline"}
},
image: {
   alternative: {type: "shortStr",
                 label: "Label"},
   path: {type:  "image",
          label: "Image",
          visual: "inline"}
},
option: {
   label: {type: "shortStr",
           label: "Label",
           visual: "inline"},
   target: {type:  "select",
            options: "selectKnot",
            label: "Target",
            visual: "panel"}
},
entity: {
   entity: {type: "shortStr",
            label: "Entity",
            visual: "inline",
            role: "entity"},
   image: {
      composite: {
         alternative: {type: "shortStr",
                       label: "Alternative"},
         path: {type:  "image",
                label: "Image",
                visual: "inline",
                role: "image"}
      }
   },
   text: {type: "text",
          label: "Text",
          visual: "inline",
          role: "text"}
},
input: {
   short: {
      /*
      subtype: {type: "select",
                options: Translator.inputSubtype,
                label: "Type",
                visual: "panel"},
      */
      input:  {type: "void",
               visual: "inline",
               role: "input"},
      text:    {type: "shortStr",
                label: "Statement",
                visual: "inline",
                role: "text"},
      variable: {type: "variable",
                 label: "Variable",
                 visual: "panel"},
      vocabularies: {type: "select",
                     options: "selectVocabulary",
                     label: "Vocabularies",
                     visual: "panel"}
   },
   slider: {
      slider:  {type: "void",
                visual: "inline",
                role: "slider"},
      text:    {type: "shortStr",
                label: "Statement",
                visual: "inline",
                role: "text"},
      variable: {type: "variable",
                 label: "Variable",
                 visual: "panel"},
      min: {type: "shortStr",
            label: "Min",
            visual: "panel"},
      max: {type: "shortStr",
            label: "Max",
            visual: "panel"},
      value: {type: "shortStr",
              label: "Value",
              visual: "panel"},
      index: {type: "shortStr",
              label: "Index",
              visual: "panel"}
   }
}
};

Properties.fieldTypes = {
shortStr:
`<div class="styp-field-row">
   <label class="styp-field-label">[label]</label>
   <input type="text" id="pfield[n]" class="styp-field-value" size="10" value="[value]">
</div>`,
variable:
`<div class="styp-field-row">
   <label class="styp-field-label">[label]</label>
   <input type="text" id="pfield[n]" class="styp-field-value" size="10" value="[value]">
</div>`,
text:
`<div class="styp-field-row">
   <label class="styp-field-label">[label]</label>
   <textarea style="height:100%" id="pfield[n]" class="styp-field-value" size="10">[value]</textarea>
</div>`,
shortStrArray:
`<div class="styp-field-row">
   <label for="pfield[n]" class="styp-field-label">[label]</label>
   <textarea style="height:100%" id="pfield[n]" class="styp-field-value" size="10">[value]</textarea>
</div>`,
image:
`<div class="styd-notice styd-border-notice">
   <label class="styp-field-label std-border" for="pfield[n]">[label]</label>
   <input type="file" id="pfield[n]" name="pfield[n]" class="styd-selector styp-field-value"
          accept="image/png, image/jpeg, image/svg">
</div>`,
selectOpen:
`<div class="styp-field-row">
   <div class="styp-field-label">[label]</div>
   <select id="pfield[n]" class="styp-field-value">`,
selectOption:
`    <option value="[opvalue]"[selected]>[oplabel]</option>`,
selectClose:
`  </select>
</div>`
};

// <TODO> xstyle is provisory due to xstyle scope problems
/*
Properties.buttonApply =
`<div class="control-button">
   <dcc-trigger xstyle="in" action="properties/apply" label="Apply" image="icons/icon-check.svg">
   </dcc-trigger>
</div>`;
*/

Properties.hasSubtypes = ["input"];
Properties.defaultSubtype = {input: "short"};

Properties.s = new Properties();

})();