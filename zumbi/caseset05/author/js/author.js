/*
 * Main Author Environment
 *
 * Main authoring environment, which presents the visual interface and
 * coordinates the authoring activities.
 */

class AuthorManager {
   constructor() {
      MessageBus.page = new MessageBus(false);

      Basic.service.host = this;
      
      this._knotGenerateCounter = 2;
      
      // Translator.instance = new Translator();
      Translator.instance.authoringRender = true;

      this._compiledCase = null;
      this._knots = null;
      
      this._navigator = new Navigator(Translator.instance);
      
      // this._currentThemeCSS = null;
      // this.currentThemeFamily = "minimal";
      this._themeSVG = true;
      // this._currentCaseId = null;
      this._knotSelected = null;
      this._htmlKnot = null;
      this._editor = null;

      // (1) render slide; (2) edit knot; (3) edit case
      this._renderState = 1;
      this._editingKnot = false;  // <TODO> unify with renderState
      
      this.controlEvent = this.controlEvent.bind(this);
      MessageBus.ext.subscribe("control/#", this.controlEvent);

      this._caseModified = false;

      window.onbeforeunload = function() {
         return (this._caseModified)
            ? "If you leave this page you will lose your unsaved changes." : null;
      }
   }
   
   /* <TODO>
      A commom code for shared functionalities between player and author
      ******/

   /*
   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;

      this._currentThemeCSS =
         Basic.service.replaceStyle(document, this._currentThemeCSS, newValue);
   }

   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }

   get currentCaseId() {
      return this._currentCaseId;
   }
   */

   /*
    *
    */

   async start() {
      let mode = window.location.search.substr(1);
      if (mode != null && mode.length > 0) {
         const md = mode.match(/mode=([\w-]+)/i);
         mode = (md == null) ? null : md[1];
      } else
         mode = null;
      if (mode != null && mode.toLowerCase() == "advanced")
         document.querySelector("#advanced-mode").style.display = "initial";

      // build singletons
      Panels.start();
      Properties.start(this);

      this._navigationPanel = document.querySelector("#navigation-panel");
      this._knotPanel = document.querySelector("#knot-panel");
      this._messageSpace = document.querySelector("#message-space");

      // this._userid = await Basic.service.signin();

      const authorState = Basic.service.authorStateRetrieve();
      this._userid = authorState.userid;

      if (authorState.template)
         this.caseNew(authorState.template);
      else
         this._caseLoad(authorState.caseId);

      // this.caseLoadSelect();
   }

   /*
    * Redirects control/<entity>/<operation> messages
    */
   controlEvent(topic, message) {
      if (MessageBus.matchFilter(topic, "control/knot/+/selected"))
         this.knotSelected(topic, message);
      else if (MessageBus.matchFilter(topic, "control/group/+/selected"))
         this.groupSelected(topic, message);
      else if (MessageBus.matchFilter(topic, "control/element/+/selected"))
         this.elementSelected(topic);
      else if (MessageBus.matchFilter(topic, "control/element/+/new"))
         this.elementNew(topic);
      else switch (topic) {
         case "control/case/new":  this.caseNew();
                                   break;
         case "control/case/load": this.caseLoadSelect();
                                   break;
         case "control/case/save": this.caseSave();
                                   break;
         case "control/case/markdown": this.caseMarkdown();
                                       break;
         case "control/case/play": this.casePlay();
                                   break;
         case "control/knot/new":  this.knotNew();
                                   break;
         case "control/knot/edit": this.knotEdit();
                                   break;
         case "control/knot/markdown": this.knotMarkdown();
                                       break;
         case "control/element/selected/down":
            this.elementSelectedMove("next");
            break;
         case "control/element/selected/up":
            this.elementSelectedMove("previous");
            break;
         case "control/element/selected/delete": this.elementSelectedDelete();
                                             break;
         case "control/config/edit": this.config();
                                     break;
         /*
         case "control/_current_theme_name/get":
            this.requestCurrentThemeFamily(topic, message);
            break;
         case "control/_current_case_id/get":
            this.requestCurrentCaseId(topic, message);
            break;
         */
         case "control/knot/update": this.knotUpdate(message);
                                     break;
      }
   }
   
   /*
    * ACTION: control-load (1)
    */
   async caseLoadSelect() {
      const saved = await this.saveChangedCase();

      const cases = await MessageBus.ext.request("data/case/*/list",
                                                 {filterBy: "user",
                                                  filter: this._userid});

      cases.message.sort(
            (a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

      const caseId = await DCCNoticeInput.displayNotice(
         "Select a case to load or start a new case.",
         "list", "Select", "New", cases.message);

      if (caseId == "New")
         this.caseNew();
      else
         this._caseLoad(caseId);

      /*
      const sticky = document.querySelector("#sticky-top");
      if (sticky != null)
         sticky.classList.add("sticky-top");
      */
   }
   
   async saveChangedCase() {
      let decision = "No";

      if (this._caseModified) {
         decision = await DCCNoticeInput.displayNotice(
            "There are unsaved modifications in the case. Do you want to save?",
            "message", "Yes", "No");
         if (decision == "Yes")
            await this.caseSave();
      }

      return decision;
   }

   /*
    * ACTION: control-new
    */
   async caseNew(template) {
      this._temporaryCase = true;
      
      // await this._themeSelect();
      // let template = await this._templateSelect("case");

      const templateMd =
         await MessageBus.ext.request(
            "data/template/" + template.replace("/", ".") + "/get");

      const caseId = await MessageBus.ext.request("data/case//new",
                                                  {format: "markdown",
                                                   name: "Untitled",
                                                   source: templateMd.message});
      this._caseLoad(caseId.message);
   }

   /*
    * ACTION: control-load (2)
    */
   async _caseLoad(caseId) {
      Basic.service.currentCaseId = caseId;
      const caseObj = await MessageBus.ext.request(
         "data/case/" + Basic.service.currentCaseId + "/get");

      this._currentCaseName = caseObj.message.name;
      await this._compile(caseObj.message.source);
      this._showCase();
   }
      
   async _compile(caseSource) {
      this._compiledCase =
         await Translator.instance.compileMarkdown(Basic.service.currentCaseId,
                                                   caseSource);

      console.log("=== compiled case");
      console.log(this._compiledCase);

      this._knots = this._compiledCase.knots;

      Basic.service.currentThemeFamily = this._compiledCase.theme;
      if (this._compiledCase.name)
         this._currentCaseName = this._compiledCase.name;

      console.log(this._compiledCase);
   }

   async _showCase() {
      await this._navigator.mountTreeCase(this, this._compiledCase.knots);
      
      const knotIds = Object.keys(this._knots);
      let k = 0;
      while (k < knotIds.length && !this._knots[knotIds[k]].render)
         k++;
      
      MessageBus.ext.publish("control/knot/" + knotIds[k] + "/selected");
   }
   
   /*
    * ACTION: control-save
    */
   async caseSave() {
      if (Basic.service.currentCaseId != null && this._compiledCase != null) {
         this._checkKnotModification(this._renderState);

         if (this._temporaryCase) {
            const caseName =
               await DCCNoticeInput.displayNotice("Inform a name for your case:",
                                                  "input");
            this._currentCaseName = caseName;
            this._temporaryCase = false;
         }

         let md =Translator.instance.assembleMarkdown(this._compiledCase);
         const status = await MessageBus.ext.request(
            "data/case/" + Basic.service.currentCaseId + "/set",
            {name: this._currentCaseName,
             format: "markdown",
             source: md});
         
         console.log("Case saved! Status: " + status.message);

         this._messageSpace.innerHTML = "Saved";
         setTimeout(this._clearMessage, 2000);
         let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 2000);
         });
         let result = await promise;
         this._messageSpace.innerHTML = "";
      }
   }

   /*
    * ACTION: control/case/edit
    */
   async caseMarkdown() {
      const nextState = (this._renderState != 3) ? 3 : 1;
      if (this._renderState != 3) {
         this._originalMd = Translator.instance.assembleMarkdown(this._compiledCase);
         this._presentEditor(this._originalMd);
      } else {
         this._checkKnotModification(nextState);
         this._renderState = nextState;
         this._renderKnot();
      }
      this._renderState = nextState;
   }

   _presentEditor(source) {
      this._knotPanel.innerHTML = "<div class='sty-editor'>" +
                                     "<textarea class='sty-editor' id='editor-space'></textarea>" +
                                  "</div>";
      this._editor = document.querySelector("#editor-space");
      this._editor.value = source;
      // this._editor = new Quill("#editor-space", {});
      /*
      this._editor.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
         console.log("=== clipboard:");
         console.log(node.data);
         return new Delta().insert(node.data);
      });
      */
      // this._editor.insertText(0, source);

   }

   /*
    * Check if the knot was modified to update it
    */
   _checkKnotModification(nextState) {
      // (1) render slide; (2) edit knot; (3) edit case
      let modified = false;
      if (this._renderState == 2) {
         if (this._editor != null) {
            const editorText = this._retrieveEditorText();
            if (this._knots[this._knotSelected]._source != editorText) {
               modified = true;
               this._knots[this._knotSelected]._source = editorText;
               Translator.instance.extractKnotAnnotations(this._knots[this._knotSelected]);
               Translator.instance.compileKnotMarkdown(this._knots, this._knotSelected);
            }
         }
      } else if (this._renderState == 3) {
         if (this._editor != null) {
            const editorText = this._retrieveEditorText();
            if (!this._originalMd || this._originalMd != editorText) {
               modified = true;
               if (nextState != 3)
                  delete this._originalMd;
               this._compile(editorText);
               if (nextState == 3)
                  this._renderState = 1;
               this._showCase();
            }
         }
      }

      if (!this._caseModified)
        this._caseModified = modified;
      return modified;
   }
   
   _retrieveEditorText() {
      return this._editor.value;
      /*
      const editorText = this._editor.getText();
      return editorText.substring(0, editorText.length - 1);
      */
   }

   async _templateSelect(scope) {
      const templateList = await MessageBus.ext.request("data/template/*/list",
                                                        {scope: scope});
      const template = await DCCNoticeInput.displayNotice(
         "Select a template for your knot.",
         "list", "Select", "Cancel", templateList.message);
      return template;
   }
   
   /*
    * ACTION: knot-selected
    */
   async knotSelected(topic, message) {
      if (this._miniPrevious)
         this._miniPrevious.classList.remove("sty-selected-knot");
      
      const knotid = MessageBus.extractLevel(topic, 3);

      const miniatureF = document.querySelector("#mini-" + knotid.replace(/\./g, "_"));
      let miniature = miniatureF.getElementsByTagName("div")[0];

      miniature.classList.add("sty-selected-knot");
      
      this._miniPrevious = miniature;
            
      if (knotid != null) {
         if (this._knots[knotid].categories &&
             this._knots[knotid].categories.indexOf("expansion") > -1) {
            this._knotSelected = knotid;
            this.knotNew();
         } else {
            this._checkKnotModification(this._renderState);
            this._knotSelected = knotid;
            this._htmlKnot = await Translator.instance.generateHTML(
                                     this._knots[this._knotSelected]);
            this._renderKnot();
            Properties.s.editKnotProperties(this._knots[this._knotSelected],
                                            this._knotSelected);
            this._collectEditableDCCs();
         }
      }
      delete this._elementSelected;
    }

    /*
     * ACTION: group-selected
     */
    async groupSelected(topic, message) {
      this.knotSelected(topic, message);
      const knotid = MessageBus.extractLevel(topic, 3);
      this._navigator.downTree(knotid);
    }

    /*
    * ACTION: control/knot/new
    */
    async knotNew() {
      let template = await this._templateSelect("knot");

      let markdown = await MessageBus.ext.request("data/template/" +
                           template.replace("/", ".") + "/get");
      
      while (this._knots["Knot_" + this._knotGenerateCounter])
         this._knotGenerateCounter++;
      const knotId = "Knot_" + this._knotGenerateCounter;
      const knotMd = "Knot " + this._knotGenerateCounter;
      this._knotGenerateCounter++;

      markdown = markdown.message.replace("_Knot_Name_", knotMd) + "\n";

      let newKnotSet = {};
      for (let k in this._knots) {
         if (k == this._knotSelected)
            newKnotSet[knotId] = {
               toCompile: true,
               _source: markdown
            };
         newKnotSet[k] = this._knots[k];
      }

      // <TODO> duplicated reference - improve it
      this._compiledCase.knots = newKnotSet;
      this._knots = newKnotSet;

      const md = Translator.instance.assembleMarkdown(this._compiledCase);
      this._compile(md);

      this._knotSelected = knotId;

      this._htmlKnot = await Translator.instance.generateHTML(this._knots[knotId]);
      await this._showCase();
      MessageBus.ext.publish("control/knot/" + this._knotSelected + "/selected");
    }

   _renderKnot() {
      if (this._renderState == 1)
         this._knotPanel.innerHTML = this._htmlKnot;
      else
         this._presentEditor(this._knots[this._knotSelected]._source);
   }

   _collectEditableDCCs() {
      let elements = this._knotPanel.querySelectorAll("*");
      this._editableDCCs = {};
      for (let e = 0; e < elements.length; e++)
         if (elements[e].tagName.toLowerCase().startsWith("dcc-")) // {
            this._editableDCCs[elements[e].id] = elements[e];
   }

   elementSelected(topic) {
      const dccId = MessageBus.extractLevel(topic, 3);

      if (this._previousEditedDCC) {
         if (this._previousBorderStyle) {
            if (this._previousBorderStyle instanceof Array) {
               for (let b in this._previousBorderStyle) {
                  this._previousEditedDCC[b].style.border =
                     this._previousBorderStyle[b];
               }
            } else
               this._previousEditedDCC.style.border =
                  this._previousBorderStyle;
            delete this._previousBorderStyle;
          } else
            this._previousEditedDCC.style.border = null;
      }

      let presentation = this._editableDCCs[dccId].presentation;
      if (presentation instanceof Array) {
         this._previousBorderStyle = [];
         for (let p in presentation) {
            if (presentation[p].style.border)
               this._previousBorderStyle.push(presentation[p].style.border);
            else
               this._previousBorderStyle.push("none");
            presentation[p].style.border = "5px solid #00ffff";
         }
      } else {
         if (presentation.style.border)
            this._previousBorderStyle = presentation.style.border;
         presentation.style.border = "5px solid #00ffff";
      }
      this._editableDCCs[dccId].editProperties();

      this._previousEditedDCC = presentation;

      const elSeq = parseInt(dccId.substring(3));
      let el = -1;
      for (el = 0; el < this._knots[this._knotSelected].content.length &&
                   this._knots[this._knotSelected].content[el].seq != elSeq; el++)
        /* nothing */;
      if (el != -1) {
         this._elementSelected = el;
         Properties.s.editElementProperties(
            this._knots[this._knotSelected].content[el]);
       }
   }

   elementNew(topic) {
      const elementType = MessageBus.extractLevel(topic, 3);
      let newElement = Translator.objTemplates[elementType];
      newElement.seq = this._knots[this._knotSelected].content[
         this._knots[this._knotSelected].content.length-1].seq + 1;
      this._knots[this._knotSelected].content.push(newElement);
      Translator.instance.updateElementMarkdown(newElement);
      MessageBus.ext.publish("control/knot/update");
   }

   elementSelectedMove(position) {
      if (this._elementSelected && this._elementSelected > 0) {
         let contentSel = this._knots[this._knotSelected].content;
         const elSel = this._elementSelected;

         // finding the next nonblank node
         let pos;
         if (position = "previous") {
            /*
            pos = (contentSel[elSel-1].type == "text" &&
               Basic.service.isBlank(contentSel[elSel-1].content)) ? elSel-2 : elSel-1;
            */
            pos = (contentSel[elSel-1].type == "linefeed") ? elSel-2 : elSel-1;
            /*
            if (pos > 0 && contentSel[pos-1] != "text")
               contentSel[pos]._source = "\n\n" + contentSel[pos]._source;
            */
         }
         else {
            /*
            pos = (contentSel[elSel+1].type == "text" &&
               Basic.service.isBlank(contentSel[elSel+1].content)) ? elSel+2 : elSel+1;
            */
            pos = (contentSel[elSel+1].type == "linefeed") ? elSel+2 : elSel+1;
            /*
            if (pos < contentSel.length-1 && contentSel[pos+1] != "text")
               contentSel[pos]._source += "\n\n";
            */
         }

         // exchanging sequence ids
         const elSeq = contentSel[elSel].seq;
         contentSel[elSel].seq = contentSel[pos].seq;
         contentSel[pos].seq = elSeq;

         // swapping nodes
         const element = contentSel[elSel];
         contentSel[elSel] = contentSel[pos];
         contentSel[pos] = element;

         this.knotUpdate();

         console.log(this._knots);
      }
   }

   elementSelectedDelete() {
      if (this._elementSelected && this._elementSelected > 0) {
         this._knots[this._knotSelected].content
            .splice(this._elementSelected, 1);
         this.knotUpdate();
      }
   }

   async knotUpdate() {
      if (this._knotSelected != null) {
         this._htmlKnot = await Translator.instance.generateHTML(
            this._knots[this._knotSelected]);
         this._renderKnot();
         this._collectEditableDCCs();
      }
   }

   knotRename(previousTitle, newTitle) {
      const last = this._knotSelected.lastIndexOf(".");
      const newIndex = this._knotSelected.substring(0, last) +
                       newTitle.replace(/ /g, "_");

      let newKnotSet = {};
      for (let k in this._knots) {
         if (k == this._knotSelected)
            newKnotSet[newIndex] = this._knots[k];
         else
            newKnotSet[k] = this._knots[k];
      }

      // <TODO> duplicated reference - improve it
      this._compiledCase.knots = newKnotSet;
      this._knots = newKnotSet;

      const md =Translator.instance.assembleMarkdown(this._compiledCase);
      this._compile(md);
      this._showCase();

      /*
      let mini =document.querySelector("#t_" + previousTitle.replace(/ /g, "_"));
      mini.setAttribute("id", "#t_" + newTitle.replace(/ /g, "_"));
      mini.removeChild(mini.firstChild);
      // let element = document.createElementNS("http://www.w3.org/2000/svg", "text");
      mini.appendChild(document.createTextNode(newTitle));
      */

      this._knotSelected = newIndex;
   }

   /*
    * ACTION: control-edit
    */
   async knotMarkdown() {
      if (this._knotSelected != null) {
         const nextState = (this._renderState != 2) ? 2 : 1;
         if (this._checkKnotModification(nextState))
            this._htmlKnot = await Translator.instance.generateHTML(
               this._knots[this._knotSelected]);
         this._renderState = nextState;
         this._renderKnot();
      }
   }

   /*
    * ACTION: control-play
    */
   async casePlay() {
      Translator.instance.newThemeSet();
      
      const htmlSet = Object.assign(
                         {"entry": {render: true},
                          "signin": {render: true},
                          "register": {render: true},
                          "report": {render: true}},
                         this._knots);
      const total = Object.keys(htmlSet).length;
      let processing = 0;
      for (let kn in htmlSet) {
         processing++;
         this._messageSpace.innerHTML = "Processed: " + processing + "/" + total;
         if (htmlSet[kn].render) {
            let finalHTML = "";
            if (processing > 4)
               finalHTML = await Translator.instance.generateHTMLBuffer(
                                                     this._knots[kn]);
               // finalHTML = await this._generateHTMLBuffer(kn);
            else 
               finalHTML = await Translator.instance.loadTheme(kn);
               // finalHTML = await this._loadTheme(this._currentThemeFamily, kn);
            finalHTML = (htmlSet[kn].categories && htmlSet[kn].categories.indexOf("note") >= 0)
               ? AuthorManager.jsonNote.replace("{knot}", finalHTML)
               : AuthorManager.jsonKnot.replace("{knot}", finalHTML);
            
            await MessageBus.ext.request("knot/" + kn + "/set",
                                                {caseId: Basic.service.currentCaseId,
                                                 format: "html",
                                                 source: finalHTML},
                                                "knot/" + kn + "/set/status");
         }
      }
      this._messageSpace.innerHTML = "Finalizing...";
      
      let caseJSON = Translator.instance.generateCompiledJSON(this._compiledCase);
      await MessageBus.ext.request("case/" + Basic.service.currentCaseId + "/set",
                                          {format: "json", source: caseJSON},
                                          "case/" + Basic.service.currentCaseId + "/set/status");
      
      this._messageSpace.innerHTML = "";
      
      Translator.instance.deleteThemeSet();
      window.open(dirPlay.message + "/html/index.html", "_blank");
   }
   
   /*
    * ACTION: config
    */
   async config() {
      this._themeSelect();
   }
   

   async _themeSelect() {
      const families = await MessageBus.ext.request("data/theme_family/*/list");
      Basic.service.currentThemeFamily = await DCCNoticeInput.displayNotice(
         "Select a theme to be applied.",
         "list", "Select", "Cancel", families.message);
      const themeObj = families.message.find(function(s){return s.id == this;},
                                             Basic.service.currentThemeFamily);
      this._themeSVG = themeObj.svg; 
      // this._themeSVG = families.message[Translator.instance.currentThemeFamily].svg;
   }
   
}

(function() {
   AuthorManager.jsonKnot = "(function() { PlayerManager.player.presentKnot(`{knot}`) })();";
   AuthorManager.jsonNote = "(function() { PlayerManager.player.presentNote(`{knot}`) })();";
   
   AuthorManager.author = new AuthorManager();
})();