/**
 * Translator of Case Notebooks
 * 
 * Translates case notebook narratives (extension of markdown) to object representations and further to HTML.
 */
class Translator {
   
   constructor() {
      this.authoringRender = false;

      this._markdownTranslator = new showdown.Converter();
      
      this._annotationMdToObj = this._annotationMdToObj.bind(this);
   }

   /*
    * Properties
    */

   get authoringRender() {
      return this._authoringRender;
   }
   
   set authoringRender(newValue) {
      this._authoringRender = newValue;
   }

   get authorAttr() {
      return (this.authoringRender) ? " author" : "";
   }

   /*
    * Proxy of Markdown functions
    */
   htmlToMarkdown(html) {
      return this._markdownTranslator.makeMarkdown(html);
   }

   /*
    * Compiles a markdown text to an object representation
    */
   async compileMarkdown(caseId, markdown) {
      let compiledCase = {
         id: caseId,
         knots: {},
         layers: {}
      }

      const layerBlocks = this._indexLayers(markdown, compiledCase);
      this._extractCaseMetadata(compiledCase);

      if (this._themeSettings)
         delete this._themeSettings;
      if (compiledCase.theme) {
         const themeSt = await MessageBus.int.request(
            "data/theme_family/" + compiledCase.theme + "/settings");
         if (themeSt != null)
            this._themeSettings = themeSt.message;
      }

      this._indexKnots(layerBlocks[0], compiledCase);
      
      for (let kn in compiledCase.knots) {
         this._extractKnotAnnotations(compiledCase.knots[kn]);
         this._compileKnotMarkdown(compiledCase.knots, kn);
      }

      this._extractCaseMetadata(compiledCase);

      this._replicateImages(compiledCase);

      return compiledCase;
   }

   /*
    * Index all layers
    */
   _indexLayers(markdown, compiledCase) {
      let layerBlocks = markdown.split(Translator.marksLayerTitle);

      for (var lb = 1; lb < layerBlocks.length; lb += 2) {
         let layer = {
            _source: layerBlocks[lb + 1]
         };
         this._compileUnityMarkdown(layer);
         this._compileMerge(layer);
         compiledCase.layers[layerBlocks[lb].trim()] = layer;
      }

      return layerBlocks;
   }

   _extractCaseMetadata(compiledCase) {
      if (compiledCase.layers.Data) {
         const content = compiledCase.layers.Data.content;
         for (let c in content)
            if (content[c].type == "field")
               switch (content[c].field) {
                  case "theme": compiledCase.theme = content[c].value;
                                // this.currentThemeFamily = content[c].value;
                                break;
                  case "title": compiledCase.name = content[c].value;
                                break;
               }
      }
   }

   /*
    * Index all knots to guide references
    */
   _indexKnots(markdown, compiledCase) {
      let mark = markdown;
      if (!Translator.marksKnotTitle.test(markdown))
         mark = "# Knot\n" + markdown;
      
      let knotCtx = [];
      let knotBlocks = mark.split(Translator.marksKnotTitle);
      for (var kb = 1; kb < knotBlocks.length; kb += 2) {
         let transObj =
            this._knotMdToObj(knotBlocks[kb].match(Translator.element.knot.mark));
         transObj.render = true;
         let label = transObj.title;
         if (transObj.level == 1)
            knotCtx[0] = {label: label, obj: transObj};
         else {
            let upper = -1;
            for (let l = transObj.level-2; l >=0 && upper == -1; l--)
               if (knotCtx[l] != null)
                  upper = l;
            
            if (upper != -1) {
               label = knotCtx[upper].label + "." + label;
               knotCtx[upper].obj.render = false;
            }
            knotCtx[transObj.level-1] = {label: label, obj: transObj};
         }
         let knotId = label.replace(/ /g, "_");
         if (kb == 1)
            compiledCase.start = knotId;
         else if (transObj.categories && transObj.categories.indexOf("start") >= 0)
            compiledCase.start = knotId;
         if (compiledCase.knots[knotId]) {
            if (!compiledCase._error)
               compiledCase._error = [];
            compiledCase._error.push("Duplicate knots title: " + label);
         } else {
            transObj._source = knotBlocks[kb] + knotBlocks[kb+1];
            compiledCase.knots[knotId] = transObj;
         }
      }
   }
   
   /*
    * Extract annotations of a single node
    */
   _extractKnotAnnotations(knot) {
      const mdAnnToObj = {
         "context-open" : this._contextOpenMdToObj,
         "context-close": this._contextCloseMdToObj,
         annotation: this._annotationMdToObj
      };
      
      knot.annotations = [];
      let currentSet = knot.annotations;
      // let maintainContext = false;

      let mdfocus = knot._source;
      
      // let newSource = "";
      let matchStart;
      do {
         // look for the next nearest expression match
         matchStart = -1;
         let selected = "";
         for (let mk in Translator.marksAnnotation) {
            let pos = mdfocus.search(Translator.marksAnnotation[mk]);
            if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
               selected = mk;
               matchStart = pos;
            }
         }
         
         if (matchStart > -1) {
            // translate the expression to an object
            let matchSize = mdfocus.match(Translator.marksAnnotation[selected])[0].length;
            let toTranslate = mdfocus.substr(matchStart, matchSize);
            let transObj = mdAnnToObj[selected](
                  Translator.marksAnnotation[selected].exec(toTranslate));
            
            // hierarchical annotation building inside contexts
            switch (selected) {
               case "context-open":
                  currentSet.push(transObj);
                  currentSet = [];
                  transObj.annotations = currentSet;
                  break;
               case "context-close":
                  currentSet = knot.annotations;
                  break;
               case "annotation":
                  currentSet.push(transObj);
                  break;
            }
            
            if (matchStart + matchSize >= mdfocus.length)
               matchStart = -1;
            else
               mdfocus = mdfocus.substring(matchStart + matchSize);
         }
      } while (matchStart > -1);
   }
   
   /*
    * Compiles a single knot to an object representation
    */
   _compileKnotMarkdown(knotSet, knotId) {
      let knot = knotSet[knotId];
      
      if (knot.categories)
         delete knot.categories;
      
      this._compileUnityMarkdown(knot);

      this._compileContext(knotSet, knotId);

      this._compileMerge(knot);

      // this._compileCompose(compiledKnot);
      
      // delete knot._preparedSource;
   }

   /*
    * Compiles a single unity (layer, knot or free) to an object representation
    *   - free compilation has test purposes in the Translator Playground
    */
   _compileUnityMarkdown(unity) {
      unity.content = [];
      let mdfocus = unity._source;
      
      this._objSequence = 0;

      let matchStart;
      do {
         // look for the next nearest expression match
         matchStart = -1;
         let selected = "";
         for (let mk in Translator.element) {
            // if (!((mk == "annotation" || mk == "select") &&
            //        this.authoringRender)) {
            let pos = mdfocus.search(Translator.element[mk].mark);
            if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
               selected = mk;
               matchStart = pos;
            }
            // }
         }

         if (matchStart > -1) {
            // add a segment that does not match to any expression as type="text"
            if (matchStart > 0) {
               const submark = mdfocus.substring(0, matchStart);
               unity.content.push(this._initializeObject(
                  this._textMdToObj(submark, true), submark));
            }
            
            // translate the expression to an object
            let matchSize = mdfocus.match(Translator.element[selected].mark)[0].length;
            let toTranslate = mdfocus.substr(matchStart, matchSize);
            let transObj = this._initializeObject( 
               this._mdToObj(selected,
                  Translator.element[selected].mark.exec(toTranslate)), toTranslate);

            // attach to a knot array (if it is a knot) or an array inside a knot
            if (selected == "knot") {
               unity._sourceHead = toTranslate;
               if (transObj.categories) {
                  unity.categories = transObj.categories;
                  if (this._themeSettings &&
                      this._themeSettings[unity.categories[0]])
                     this._categorySettings =
                        this._themeSettings[unity.categories[0]];
                  else if (this._categorySettings)
                     delete this._categorySettings;
               }
            } else
               unity.content.push(transObj);
            
            if (matchStart + matchSize >= mdfocus.length) {
               matchStart = -1;
               mdfocus = "";
            } else
               mdfocus = mdfocus.substring(matchStart + matchSize);
         }
      } while (matchStart > -1);
      if (mdfocus.length > 0)
         unity.content.push(
            this._initializeObject(this._textMdToObj(mdfocus), mdfocus));
   }

   /*
   _compileText(textMd, compiledKnot) {
      if (/^\t| [\t ]/.test(textMd)) {
         let textLines = textMd.split(/\f|\r?\n/);
         let subordinatedMd = textLines[0];
         let line = 1;
         for (; line < textLines.length &&
                /^\t| [\t ]/.test(textLines[line]); line++)
            subordinatedMd += "\n" + textLines[line];
         compiledKnot.push(this._initializeObject(
            this._textMdToObj(subordinatedMd, true), subordinatedMd));
         if (line < textLines.length) {
            console.log("inserindo linha");
            compiledKnot.push(this._initializeObject(
               this._linefeedMdToObj(["\n\n"]), "\n\n"));
            let freeMd = textLines[line];
            line++;
            for (; line < textLines.length; line++)
               freeMd += "\n" + textLines[line];
            compiledKnot.push(this._initializeObject(
               this._textMdToObj(freeMd, false), freeMd));
         }
      } else
         compiledKnot.push(this._initializeObject(
            this._textMdToObj(textMd, false), textMd));
   }
   */

   /*
    * Gives context to links and variables
    */ 
   _compileContext(knotSet, knotId) {
      let compiled = knotSet[knotId].content;
      for (let c in compiled) {
         if (compiled[c].type == "input" &&
             compiled[c].variable.indexOf(".") == -1)
            compiled[c].variable = knotId + "." + compiled[c].variable;
            // <TODO> can be interesting this link in the future
            // compiled[c].variable = this._findContext(knotSet, knotId, compiled[c].variable);
         else if (compiled[c].type == "context-open" &&
                  compiled[c].input.indexOf(".") == -1)
            compiled[c].input = knotId + "." + compiled[c].input;
             // <TODO> can be interesting this link in the future
            // compiled[c].input = this._findContext(knotSet, knotId, compiled[c].input);
         else if (compiled[c].type == "option" ||
                  compiled[c].type == "divert")
            compiled[c].contextTarget =
               this._findContext(knotSet, knotId, compiled[c].target);
         /*
         {
            let target = compiled[c].target.replace(/ /g, "_");
            let prefix = knotId;
            let lastDot = prefix.lastIndexOf(".");
            while (lastDot > -1) {
               prefix = prefix.substring(0, lastDot);
               if (knotSet[prefix + "." + target])
                  target = prefix + "." + target;
               lastDot = prefix.lastIndexOf(".");
            }
            compiled[c].contextTarget = target;
         }*/
      }
   }

   _findContext(knotSet, knotId, originalTarget) {
      let target = originalTarget.replace(/ /g, "_");
      let prefix = knotId + ".";
      let lastDot = prefix.lastIndexOf(".");
      while (lastDot > -1) {
         prefix = prefix.substring(0, lastDot);
         if (knotSet[prefix + "." + target])
            target = prefix + "." + target;
         lastDot = prefix.lastIndexOf(".");
      }
      return target;
   }

   /*
    * Merges text / subordinate fields and
    * adjusts the interpretation of line feeds
   */
   _compileMerge(unity) {
      let compiled = unity.content;
      for (let c = 0; c < compiled.length; c++) {
         // aggregates text blocks 
         if (compiled[c].type == "linefeed") {
            if (c > 0 && compiled[c-1].type == "text" &&
                c < compiled.length-1 && compiled[c+1].type == "text") {
               compiled[c-1].content += compiled[c].content +
                                            compiled[c+1].content;
               compiled[c-1]._source += compiled[c]._source +
                                            compiled[c+1]._source;
               compiled.splice(c, 2);
               c--;
            } else if (c == 0 || compiled[c-1].type != "text" &&
                       Translator.element[compiled[c-1].type].line !== undefined &&
                       Translator.element[compiled[c-1].type].line) {
               if (compiled[c].content.length > 1) {
                  compiled[c].content = compiled[c].content.substring(1);
                  compiled[c]._source = compiled[c]._source.substring(1);
               } else {
                  compiled.splice(c, 1);
                  c--;
               }
            }
         } else if (c > 0 && compiled[c].subordinate) {
            // computes subordinate elements
            let merge = false;
            if (compiled[c].type == "field" &&
                Translator.element[compiled[c-1].type].subfield !== undefined &&
                Translator.element[compiled[c-1].type].subfield) {
               if (compiled[c].field.indexOf("answers") > -1) {
                  if (!compiled[c-1].answers)
                     compiled[c-1].answers = {};
                  let answerType = compiled[c].field.replace("answers", "").trim();
                  if (answerType.length == 0)
                     answerType = "untyped";
                  compiled[c-1].answers[answerType] = {answers: compiled[c].value};
                  if (compiled[c].target)
                     compiled[c-1].answers[answerType].target = compiled[c].target;
               } else {
                  let fieldName = compiled[c].field;
                  if (fieldName == "type")
                     fieldName = "subtype";
                  compiled[c-1][fieldName] = compiled[c].value;
               }
               merge = true;
            } else if (compiled[c].type == "image" &&
                       Translator.element[compiled[c-1].type].subimage !== undefined &&
                       Translator.element[compiled[c-1].type].subimage) {
               compiled[c-1].image = {
                  alternative: compiled[c].alternative,
                  path:  compiled[c].path };
               if (compiled[c].title)
                  compiled[c-1].image.title = compiled[c].title;
               merge = true;
            } else if (compiled[c].type == "text" &&
                       Translator.element[compiled[c-1].type].subtext !== undefined) {
               if (compiled[c-1][Translator.element[compiled[c-1].type].subtext] == null)
                  compiled[c-1][Translator.element[compiled[c-1].type].subtext] =
                     compiled[c].content;
               else
                  compiled[c-1][Translator.element[compiled[c-1].type].subtext] += "\n" +
                     compiled[c].content;
               merge = true;
            }
            if (merge) {
               compiled[c-1]._source += "\n" + compiled[c]._source;
               compiled.splice(c, 1);
               c--;
            }
         } else if (c == 0 && compiled[c].subordinate &&
                    compiled[c].type == "image") {
            // manages elements subordinated to the knot
            unity.background = {
               alternative: compiled[c].alternative,
               path:  compiled[c].path };
            if (compiled[c].title)
               unity.background.title = compiled[c].title;
            compiled[c].render = false;
         }
         if (c >= 0)
            compiled[c].seq = c + 1;
      }

      // second cycle - aggregate annotations and selects in authoring mode
      if (this.authoringRender) {
         let tblock;
         let tblockSeq;
         for (let c = 0; c < compiled.length; c++) {
            if (compiled[c].type == "select" ||
                compiled[c].type == "annotation" ||
                compiled[c].type == "text") {
               if (c == 0 || compiled[c-1].type != "text-block") {
                  tblockSeq = 1;
                  compiled[c].seq = 1;
                  tblock = this._initializeObject(
                     { type: "text-block",
                       content: [compiled[c]]
                     }, compiled[c]._source);
                  compiled[c] = tblock;
               } else {
                  tblockSeq++;
                  compiled[c].seq = tblockSeq;
                  tblock.content.push(compiled[c]);
                  tblock._source += compiled[c]._source;
                  compiled.splice(c, 1);
                  c--;
               }
            }
            if (c >= 0)
               compiled[c].seq = c + 1;
         }
      }
   }

   /*
    * Joins inline elements in a composition
    */
   /*
   _compileCompose(compiledKnot) {

   }
   */

   /*
    * Replicates background and entity images
    */
   _replicateImages(compiledCase) {
      let lastBackground = null;
      let entityImage = {};
      let knots = compiledCase.knots;
      for (let k in knots) {
         if (knots[k].background)
            lastBackground = knots[k].background;
         else if (lastBackground != null)
            knots[k].background = lastBackground;
         for (let c in knots[k].content) {
            if (knots[k].content[c].type == "entity") {
               if (knots[k].content[c].image)
                  entityImage[knots[k].content[c].entity] =
                     knots[k].content[c].image;
               else if (entityImage[knots[k].content[c].entity])
                  knots[k].content[c].image =
                     entityImage[knots[k].content[c].entity];
            }
         }
      }
   }

   _mdToObj(mdType, match) {
      let obj;
      switch(mdType) {
         case "knot"   : obj = this._knotMdToObj(match); break;
         case "image"  : obj = this._imageMdToObj(match); break;
         case "option" : obj = this._optionMdToObj(match); break;
         case "field"  : obj = this._fieldMdToObj(match); break;
         case "divert" : obj = this._divertMdToObj(match); break;
         case "entity" : obj = this._entityMdToObj(match); break;
         case "mention": obj = this._mentionMdToObj(match); break;
         // case "talk-open" : obj = this._talkopenMdToObj(match); break;
         // case "talk-close": obj = this._talkcloseMdToObj(match); break;
         case "input"    : obj = this._inputMdToObj(match); break;
         case "output"   : obj = this._outputMdToObj(match); break;
         case "compute"  : obj = this._computeMdToObj(match); break;
         // <TODO> provisory: annotation recognition is duplicated to support code generation
         case "annotation"  : obj = this._annotationMdToObj(match); break;
         case "context-open"  : obj = this._selctxopenMdToObj(match); break;
         case "context-close" : obj = this._selctxcloseMdToObj(match); break;
         case "select"  : obj = this._selectMdToObj(match); break;
         case "linefeed": obj = this._linefeedMdToObj(match); break;
         // case "text": obj = this._textMdToObj(match); break;
      };
      return obj;
   }

   /*
    * Produce a sequential stamp to uniquely identify each recognized object
    */
   _initializeObject(obj, submark) {
      obj._source = submark;
      obj._modified = false;
      this._objSequence++;
      obj.seq = this._objSequence;
      return obj;
   }

   /*
    *
    */
   async generateHTML(knot) {
      this.newThemeSet();
      let finalHTML = await this.generateHTMLBuffer(knot);
      this.deleteThemeSet();
      return finalHTML;
   }

   newThemeSet() {
      this._themeSet = {};
   }

   deleteThemeSet() {
      // <TODO> there is some synchronization problem - it is deleting before finishing
      // delete this._themeSet;
   }
   
   async generateHTMLBuffer(knot) {
      let themes = (knot.categories)
                   ? knot.categories : ["knot"];
      for (let tp in themes)
         if (!this._themeSet[themes[tp]]) {
            const templ = await
                    this.loadTheme(themes[tp]);
            if (templ != "")
               this._themeSet[themes[tp]] = templ;
            else {
               if (!this._themeSet["knot"])
                  this._themeSet["knot"] = await
                     this._loadTheme("knot");
               this._themeSet[themes[tp]] = this._themeSet["knot"];
            }
         }
      let finalHTML = await this.generateKnotHTML(knot);
      const backPath = (knot.background !== undefined)
         ? Basic.service.imageResolver(knot.background.path) : "";
      const backAlt = (knot.background !== undefined) ? knot.background.alternative : "";
      for (let tp = themes.length-1; tp >= 0; tp--)
         finalHTML = this._themeSet[themes[tp]].replace(/{knot}/igm, finalHTML)
                                               .replace(/{background-path}/igm, backPath)
                                               .replace(/{background-alternative}/igm, backAlt);
      return finalHTML;
   }

   async loadTheme(themeName) {
      const themeObj = await MessageBus.ext.request(
            "data/theme/" + Basic.service.currentThemeFamily +
            "." + themeName + "/get");
      return themeObj.message;
   }


   /*
    * Generate HTML in a single knot
    */
   generateKnotHTML(knotObj) {
      let preDoc = "";
      let html = "";
      if (knotObj != null && knotObj.content != null) {
         // produces a pretext with object slots to process markdown
         for (let kc in knotObj.content)
            preDoc += (knotObj.content[kc].type == "text" ||
                       knotObj.content[kc].type == "field" ||
                       knotObj.content[kc].type == "context-open" ||
                       knotObj.content[kc].type == "context-close") 
               ? this.objToHTML(knotObj.content[kc])
               : "@@" + knotObj.content[kc].seq + "@@";

         // converts to HTML
         html = this._markdownTranslator.makeHtml(preDoc);

         // inserts Markdown DCCs in authoring mode
         html = html.replace(/<p><dcc-markdown id='dcc(\d+)'( author)?><\/p>/igm,
                             "<dcc-markdown id='dcc$1'$2>")
                    .replace(/<p><\/dcc-markdown><\/p>/igm, "</dcc-markdown>");

         // replaces the marks
         let current = 0;
         let next = html.indexOf("@@");
         while (next != -1) {
            let end = html.indexOf("@@", next+1);
            let seq = parseInt(html.substring(next+2, end));
            while (knotObj.content[current].seq < seq)
               current++;
            if (knotObj.content[current].seq != seq)
               console.log("Error in finding seq.");
            else
               html = html.substring(0, next) +
                      this.objToHTML(knotObj.content[current]) +
                      html.substring(end+2);
            next = html.indexOf("@@");
         }
         
         html = html.replace(Translator.contextHTML.open,
                             this._contextSelectHTMLAdjust);
         html = html.replace(Translator.contextHTML.close,
                             this._contextSelectHTMLAdjust);
      }
      return html;
   }

   objToHTML(obj) {
      let html;
      if (obj.render !== undefined && !obj.render)
         html = "";
      else
         switch(obj.type) {
            case "text"   : html = this._textObjToHTML(obj); break;
            case "text-block": html = this._textBlockObjToHTML(obj); break;
            case "image"  : html = this._imageObjToHTML(obj); break;
            case "option" : html = this._optionObjToHTML(obj); break;
            case "field"  : html = this._fieldObjToHTML(obj); break;
            case "divert" : html = this._divertObjToHTML(obj); break;
            case "entity" : html = this._entityObjToHTML(obj); break;
            case "mention": html = this._mentionObjToHTML(obj); break;
            // case "talk-open" : html = this._talkopenObjToHTML(obj); break;
            // case "talk-close": html = this._talkcloseObjToHTML(obj); break;
            case "input"   : html = this._inputObjToHTML(obj); break;
            case "output"  : html = this._outputObjToHTML(obj); break;
            case "compute" : html = this._computeObjToHTML(obj); break;
            case "context-open"  : // html = this._selctxopenObjToHTML(obj); break;
            case "context-close" : html = ""; break; // html = this._selctxcloseObjToHTML(obj); 
            case "select"     : html = this._selectObjToHTML(obj); break;
            case "annotation" : html = this._annotationObjToHTML(obj); break;
            case "linefeed"   : html = this._linefeedObjToHTML(obj); break;
         }
      return html;
   }
   
   generateCompiledJSON(compiledCase) {
      return "(function() { DCCPlayerServer.playerObj =" +
             JSON.stringify(compiledCase) + "})();"; 
   }
   
   /*
    * Put together all source fragments
    */
   assembleMarkdown(compiledCase) {
      let md = "";
      /*
      for (let kn in compiledCase.knots)
         md += compiledCase.knots[kn]._source;
      */
      for (let kn in compiledCase.knots) {
         if (compiledCase.knots[kn].toCompile)
            md += compiledCase.knots[kn]._source +
                  ((compiledCase.knots[kn].type != "text" &&
                    Translator.element[compiledCase.knots[kn].type] !== undefined &&
                    Translator.element[compiledCase.knots[kn].type].line !== undefined &&
                    Translator.element[compiledCase.knots[kn].type].line) ? "\n" : "");
         else {
            md += compiledCase.knots[kn]._sourceHead + "\n";
            for (let ct in compiledCase.knots[kn].content) {
               md += compiledCase.knots[kn].content[ct]._source +
                     ((compiledCase.knots[kn].content[ct].type != "text" &&
                       Translator.element[compiledCase.knots[kn].content[ct].type] !== undefined &&
                       Translator.element[compiledCase.knots[kn].content[ct].type].line !== undefined &&
                       Translator.element[compiledCase.knots[kn].content[ct].type].line) ? "\n" : "");
            }
         }
      }
      
      for (let l in compiledCase.layers)
         md += Translator.markdownTemplates.layer.replace("[title]", l) +
               compiledCase.layers[l]._source;
      return md;
   }

   /*
    * Updates the markdown of an element according to its object representation
    */
   updateElementMarkdown(element) {
      // switch instead array to avoid binds
      switch (element.type) {
         case "knot": element._sourceHead = this._knotObjToMd(element);
                      element._sorce = element._sourceHead;
                      break;
         case "text": element._source = this._textObjToMd(element);
                      break;
         case "image": element._source = this._imageObjToMd(element);
                       break;
         case "option": element._source = this._optionObjToMd(element);
                        break;
         case "entity": element._source = this._entityObjToMd(element);
                        break;
      }
      // element._source += "\n\n";
   }
   
   /*
    * Adjusts the HTML generated to avoid trapping the constext select tag in a paragraph
    */
   _contextSelectHTMLAdjust(matchStr, insideP) {
      return insideP;
   }
   
   /*
    * Knot Md to Obj
    */
   _knotMdToObj(matchArray) {
      let knot = {
         type: "knot"
      };
      
      if (matchArray[2] != null)
         knot.title = matchArray[2].trim();
      else
         knot.title = matchArray[4].trim();
      
      if (matchArray[3] != null)
         knot.categories = matchArray[3].split(",");
      else if (matchArray[5] != null)
         knot.categories = matchArray[5].split(",");
      if (knot.categories)
         for (let c in knot.categories)
            knot.categories[c] = knot.categories[c].trim();
      
      // moves special categories to the beggining of the list
      if (knot.categories != null) {
         for (let sc in Translator.specialCategories) {
            let cat = knot.categories.indexOf(Translator.specialCategories[sc]);
            if (cat >= 0) {
               let category = knot.categories[cat];
               knot.categories.splice(cat, 1);
               knot.categories.unshift(category);
            }
         }
      }
      
      if (matchArray[1] != null)
         knot.level = matchArray[1].trim().length;
      else
         if (matchArray[6][0] == "=")
            knot.level = 1;
         else
            knot.level = 2;
         
      return knot;
   }
   
   /*
    * Knot Obj to Md
    */
   _knotObjToMd(obj) {
      return Translator.markdownTemplates.knot
                .replace("[level]", "#".repeat(obj.level))
                .replace("[title]", obj.title)
                .replace("[categories]",
                   (obj.categories)
                      ? " (" + obj.categories.join(",") + ")" : ""); 
   }
   
   /*
    * Text Raw to Obj
    */
   _textMdToObj(markdown) {
      return {
         type: "text",
         subordinate: /^\t| [\t ]/.test(markdown),
         content: markdown
      };
   }

   /*
    * Text Obj to HTML
    */
   _textObjToHTML(obj) {
      // return this._markdownTranslator.makeHtml(obj.content);
      /*
      let result = obj.content;
      if (this.authoringRender)
         result = Translator.htmlTemplatesEditable.text
                    .replace("[seq]", obj.seq)
                    .replace("[author]", this.authorAttr)
                    .replace("[content]", obj.content);
      return result;
      */
      return obj.content;
   }

   _textObjToMd(obj) {
      return obj.content;
   }

   /*
    * Text Block Obj to HTML
    */
    _textBlockObjToHTML(obj) {
      let html = Translator.htmlTemplates.textBlock
                .replace("[seq]", obj.seq)
                .replace("[content]", this.generateKnotHTML(obj));
      return html;
   }

   /*
    * Line feed Md to Obj
    */
   _linefeedMdToObj(matchArray) {
      return {
         type: "linefeed",
         content: matchArray[0]
      };
   }

   /*
    * Line feed Obj to HTML
    */
   _linefeedObjToHTML(obj) {
      return ""; // obj.content.replace(/[\f\n\r]/im, "<br>");
   }

   /*
    * Image Md to Obj
    */
   _imageMdToObj(matchArray) {
      let image = {
         type: "image",
         subordinate:
            (matchArray[1][0] === "\t" || matchArray[1].length > 1) ? true : false,
         alternative:  matchArray[2].trim(),
         path: matchArray[3].trim()
      };
      if (matchArray[4] != null)
         image.title = matchArray[3].trim();
      return image;
   }
   
   /*
    * Image Obj to HTML
    */
   _imageObjToHTML(obj, authorRender) {
      const aRender = (authorRender)
         ? authorRender : this.authoringRender;
      let result;
      if (aRender)
         result = Translator.htmlTemplatesEditable.image
            .replace("[seq]", obj.seq)
            .replace("[author]", this.authorAttr)
            .replace("[path]", obj.path)
            .replace("[alternative]", obj.alternative)
            .replace("[title]", (obj.title)
               ? " title='" + obj.title + "'" : "");
      else
         result = Translator.htmlTemplates.image
            .replace("[path]", Basic.service.imageResolver(obj.path))
            .replace("[alt]", (obj.title)
               ? " alt='" + obj.title + "'" : "");
      return result;
   }

   _imageObjToMd(obj) {
      return Translator.markdownTemplates.image
                .replace("{alternative}", obj.alternative)
                .replace("{path}", obj.path)
                .replace("{title}",
                   (obj.title) ? '"' + obj.title + '"' : "");
   }

   /*
    * Context Open Md to Obj
    */
   _contextOpenMdToObj(matchArray) {
      let context = {
         type: "context",
         context: matchArray[1].trim()
      };
      
      if (matchArray[2] != null) {
         context.evaluation = matchArray[2].trim();
         context.options = matchArray[3];
      }
     
      return context;
   }

   /*
    * Context Close Md to Obj
    */
   _contextCloseMdToObj(matchArray) {
   }   
   
   /*
    * Annotation Md to Obj
    */
   _annotationMdToObj(matchArray) {
      let annotation = {
         type: "annotation",
         natural: this._annotationInsideMdToObj(
                     Translator.marksAnnotationInside.exec(matchArray[1].trim()))
      };
      
      if (matchArray[2] != null)
         annotation.formal = this._annotationInsideMdToObj(
            Translator.marksAnnotationInside.exec(matchArray[2].trim()));
      
      if (matchArray[3] != null)
         annotation.value = matchArray[3].trim();
     
      return annotation;
   }
   
   /*
    * Annotation Inside Md to Obj
    */
   _annotationInsideMdToObj(matchArray) {
      let inside = {
         complete: matchArray[0]
      };
      
      if (matchArray[1] != null)
         inside.expression = matchArray[1].trim(); 
      if (matchArray[2] != null)
         inside.specification = matchArray[2].trim(); 
      if (matchArray[3] != null)
         inside.rate = matchArray[3].trim(); 
      
      return inside;
   }

   /*
    * Annotation Obj to HTML
    */
   _annotationObjToHTML(obj) {
      return obj.natural.complete;
   }   
   
   /*
    * Option Md to Obj
    */
   _optionMdToObj(matchArray) {
      let option = {
         type: "option",
         subtype: matchArray[1].trim()
      };
      
      if (matchArray[2] != null)
         option.label = matchArray[2].trim();
      if (matchArray[3] != null)
         option.rule = matchArray[3].trim();
      if (matchArray[4] != null)
         option.target = matchArray[4].trim();
      if (matchArray[5] != null)
         option.value = matchArray[5].trim();
      
      return option;
   }

   /*
    * Option Obj to HTML
    */
   _optionObjToHTML(obj) {
      // const display = (obj.label != null) ? obj.label : obj.target;
      const location = (obj.rule != null) ? " location='" + obj.rule + "'" : "";
      
      const optionalImage = "";
      // <TODO> Temporary
      /*
      const optionalImage = (obj.rule == null) ?
         " image='images/" + display.toLowerCase().replace(/ /igm, "-") + ".svg'" : 
         "";
      */

      let label;
      if (obj.label)
         label = obj.label;
      else {
         label = obj.target;
         const lastDot = label.lastIndexOf(".");
         if (lastDot > -1)
            label = label.substr(lastDot + 1);
      }
     
      return Translator.htmlTemplates.option
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[subtype]", obj.subtype)
         .replace("[target]", obj.contextTarget)
         .replace("[display]", label)
         .replace("[value]",
            (obj.value == null) ? "" : " value='" + obj.value + "'")
         .replace("[image]", optionalImage)
         .replace("[location]", location);
   }
   
   _optionObjToMd(obj) {
      return Translator.markdownTemplates.option
                .replace("{label}", obj.label + " ")
                .replace("{rule}", (obj.rule) ? "(" + obj.rule + ") " : "")
                .replace("{target}", obj.target);
   }
   
   /*
    * Field Md to Obj
    */
   _fieldMdToObj(matchArray) {
      let field = {
         type: "field",
         presentation: matchArray[0],
         subordinate:
            (matchArray[1][0] === "\t" || matchArray[1].length > 1) ? true : false,
         field: matchArray[2].trim(),
         value: matchArray[3].trim()
      };
      let fset = false;
      for (let fs in Translator.fieldSet)
         if (field.field.indexOf(Translator.fieldSet[fs]) > -1)
            fset = true;
      if (fset) {
         field.value = field.value.split(",");
         for (let fv in field.value)
            field.value[fv] = field.value[fv].trim();
      }
      if (matchArray[4] != null)
         field.target = matchArray[4].trim();
      return field;
   }

   /*
    * Field Obj to HTML
    */
   _fieldObjToHTML(obj) {
      return obj.presentation;
   }

   /*
    * Divert Md to Obj
    */
   _divertMdToObj(matchArray) {
      const label  = (matchArray[1]) ? matchArray[1].trim() : matchArray[2].trim();
      const target = (matchArray[3]) ? matchArray[3].trim() : matchArray[4].trim();
      return {
         type: "divert",
         label: label,
         target: target
      };
   }

   /*
    * Divert Obj to HTML
    */
   _divertObjToHTML(obj) {
      return Translator.htmlTemplates.divert.replace("[seq]", obj.seq)
                                            .replace("[author]", this.authorAttr)
                                            .replace("[target]", obj.target)
                                            .replace("[display]", obj.label);
   }

   /*
    * Entity Md to Obj
    */
   _entityMdToObj(matchArray) {
      let entity = {
         type: "entity",
         entity: (matchArray[1] != null) ? matchArray[1].trim()
                                         : matchArray[2].trim()
      };
      if (matchArray[3] != null)
         entity.speech = matchArray[3].trim();

      return entity;
   }

   /*
    * Entity Obj to HTML
    */
   _entityObjToHTML(obj) {
      let path = "",
          alternative = "",
          title = "";
      if (obj.image) {
         path = " image='" + Basic.service.imageResolver(obj.image.path) + "'";
         alternative = " alternative='" + obj.image.alternative + "'";
         if (obj.image.title)
            title = " title='" + obj.image.title + "'";
      }
      return Translator.htmlTemplates.entity
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[entity]", obj.entity)
         .replace("[speech]", (obj.speech) ? obj.speech : "")
         .replace("[image]", path)
         .replace("[alternative]", alternative)
         .replace("[title]", title);
   }
   

   _entityObjToMd(obj) {
      let entity = Translator.markdownTemplates.entity
                .replace("{entity}", obj.entity);
      if (obj.speech)
         entity += "\n  " + obj.speech;
      if (obj.image)
         entity += "\n  " + this._imageObjToMd(obj.image);

      return entity;
   }

   /*
    * Mention Md to Obj
    */
   _mentionMdToObj(matchArray) {
      return {
         type: "mention",
         entity: (matchArray[1] != null) ? matchArray[1].trim()
                                         : matchArray[2].trim()
      };
   }

   /*
    * Mention Obj to HTML
    */
   _mentionObjToHTML(obj) {
      return Translator.htmlTemplates.mention
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[entity]", obj.entity);
   }

   /*
    * Talk Open Md to Obj
    */
   /*
   _talkopenMdToObj(matchArray) {
      let result = {
         type: "talk-open",
         character: matchArray[1].trim()
      };
      if (matchArray[2] != null) {
         result.image = {
            alternative:  matchArray[2].trim(),
            path: matchArray[3].trim()
         };
         if (matchArray[4] != null)
            result.image.title = matchArray[4].trim();
      }
      return result;
   }
   */   

   /*
    * Talk Open Obj to HTML
    */
   /*
   _talkopenObjToHTML(obj) {
      return Translator.htmlTemplates["talk-open"]
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[character]", obj.character)
         .replace("[image]",
            (obj.image) ? " image='" + obj.image.path + "' alt='" : "")
         .replace("[alt]",
            (obj.image && obj.image.title)
               ? " alt='" + obj.title + "'" : "");
   }
   */  
   
   /*
    * Talk Close Md to Obj
    */
   /*
   _talkcloseMdToObj(matchArray) {
      return {
         type: "talk-close"
      };
   }
   */   

   /*
    * Talk Close Obj to HTML
    */
   /*
   _talkcloseObjToHTML(obj) {
      return Translator.htmlTemplates["talk-close"];
   }
   */
   
   /*
    * Input Md to Obj
    */
   _inputMdToObj(matchArray) {
      return {
         type: "input",
         variable: matchArray[1].trim().replace(/ /igm, "_")
      };
   }
   
   /*
    * Input Obj to HTML
    */
   _inputObjToHTML(obj) {
      let input = "";
      const statement = (obj.text) ? obj.text : "";

      if (obj.subtype == "group select") {
         // <TODO> weak strategy -- improve
         // indicates how related selects will behave
         this._inputSelectShow = null;
         if (obj.show)
            if (obj.show == "answer")
               this._inputSelectShow = "#answer";
            else
               this._inputSelectShow = obj.variable;

         const states = (obj.states) ? " states='" + obj.states + "'" : "";
         const labels = (obj.labels) ? " labels='" + obj.labels + "'" : "";
         input = Translator.htmlTemplates["input-group-select"]
                                         .replace("[seq]", obj.seq)
                                         .replace("[author]", this.authorAttr)
                                         .replace("[variable]", obj.variable)
                                         .replace("[states]", states)
                                         .replace("[labels]", labels)
                                         .replace("[statement]", statement);
      } else {
         const rows = (obj.rows) ? " rows='" + obj.rows + "'" : "";
         const vocabularies = (obj.vocabularies)
            ? " vocabularies='" + obj.vocabularies + "'" : "";
         input = Translator.htmlTemplates.input.replace("[seq]", obj.seq)
                                           .replace("[author]", this.authorAttr)
                                           .replace("[variable]", obj.variable)
                                           .replace("[rows]", rows)
                                           .replace("[vocabularies]", vocabularies)
                                           .replace("[statement]", statement);
      }

      return input;
   }

   /*
    * Output Md to Obj
    */
   _outputMdToObj(matchArray) {
      let output = {
         type: "output",
         variable: matchArray[1].trim().replace(/ /igm, "_")
      };
      if (matchArray[2] != null)
         output.variant = matchArray[2].trim();
      return output;
   }

   /*
    * Output Obj to HTML
    */
   _outputObjToHTML(obj) {
      const variant = (obj.variant != null) ? obj.variant : "";

      return Translator.htmlTemplates.output
                .replace("[seq]", obj.seq)
                .replace("[author]", this.authorAttr)
                .replace("[variable]", obj.variable)
                .replace("[variant]", variant);
   }

   /*
    * Compute Md to Obj
    */
   _computeMdToObj(matchArray) {
      let sentence = {
         type: "compute",
         operator: matchArray[2],
         value: matchArray[3].trim()
      };
      
      if (matchArray[1] != null)
         sentence.variable = matchArray[1].trim();
      
      return sentence;
   }
   
   /*
    * Compute Obj to HTML
    */
   _computeObjToHTML(obj) {
      const variable = (obj.variable != null)
               ? obj.variable : Translator.defaultVariable;

      const sentence = variable + obj.operator + obj.value;

      return Translator.htmlTemplates.compute
                .replace("[sentence]", sentence);
   }

   /*
    * Select Context Open Md to Obj
    */
   _selctxopenMdToObj(matchArray) {
      let context = {
         type: "context-open"
      };

      if (matchArray[1] != null)
         context.context = matchArray[1].trim();
      if (matchArray[2] != null)
         context.input = matchArray[2].trim().replace(/ /igm, "_");
      
      // <TODO> weak strategy -- improve
      // this._currentInputContext = context.context;

      return context;
   }
   
   /*
    * Select Context Open Obj to HTML
    */
   _selctxopenObjToHTML(obj) {
      let input = (obj.input != null) ? " input='" + obj.input + "'" : "";
      // let states = (obj.options != null) ? " states='" + obj.options + "'" : "";
      // let colors = (obj.colors != null) ? " colors='" + obj.colors + "'" : "";

      return Translator.htmlTemplates.selctxopen.replace("[seq]", obj.seq)
                                                .replace("[author]", this.authorAttr)
                                                .replace("[context]", obj.context)
                                                .replace("[input]", input);
                                                /*
                                                .replace("[states]", states)
                                                .replace("[colors]", colors);
                                                */
   }

   /*
    * Select Context Close Md to Obj
    */
   _selctxcloseMdToObj(matchArray) {
      return {
         type: "context-close"
      };
   }
   
   /*
    * Select Context Close Obj to HTML
    */
   _selctxcloseObjToHTML(obj) {
      return Translator.htmlTemplates.selctxclose;
   }

   /*
    * Select Md to Obj
    */
   _selectMdToObj(matchArray) {
      let select = {
         type: "select",
         expression: matchArray[1].trim()
      };
      if (matchArray[3] != null)
         select.value = matchArray[3].trim();

      // <TODO> weak strategy -- improve
      /*
      if (this._currentInputContext) {
         if (this._lastSelectContext == "answer")
            select.present = "answer";
         else if (this._lastSelectContext == "player")
            select.present = this._lastSelectEvaluation;
      }
      */
      return select;
   }
   
   /*
    * Select Obj to HTML
    */
   _selectObjToHTML(obj, authorRender) {
      const aRender = (authorRender)
         ? authorRender : this.authoringRender;
      let answer="";
      if (this._inputSelectShow || aRender) {
         if (this._inputSelectShow == "#answer" || this.authoringRender)
            answer = " answer='" + obj.value + "'";
         else
            answer = " player='" + this._inputSelectShow + "'";
      }

      // let result = obj.expression;
      // if (!this.authoringRender)
      // let result = Translator.htmlTemplates.select
      return Translator.htmlTemplates.select
                       .replace("[seq]", obj.seq)
                       .replace("[author]", this.authorAttr)
                       .replace("[expression]", obj.expression)
                       .replace("[answer]", answer);

      // return result;
   }

}

(function() {
   Translator.marksLayerTitle = /^[ \t]*\_{2,}((?:.(?!\_{2,}))*.)(?:\_{2,})?[ \t]*$/igm;
   Translator.marksKnotTitle = /((?:^[ \t]*(?:#+)[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*#*[ \t]*$)|(?:^[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*[\f\n\r][\n\r]?(?:==+|--+)$))/igm;

   Translator.marksAnnotation = {
     "context-open" : /\{\{([\w \t\+\-\*\."=\:%]+)?(?:\/([\w \t\.]+)\/)?[\f\n\r]/im,
     "context-close": /\}\}/im,
     annotation: /\{([^\(\{\}\/]+)\}(?:\(([^\)]+)\))?(?:\/([^\/]+)\/)?/im
   };
   
   Translator.marksAnnotationInside = /([\w \t\+\-\*"]+)(?:[=\:]([\w \t%]*)(?:\/([\w \t%]*))?)?/im;

   Translator.element = {
      knot: {
         mark: /(?:^[ \t]*(#+)[ \t]*([^\( \t\n\r\f][^\(\n\r\f]*)(?:\((\w[\w \t,]*)\))?[ \t]*#*[ \t]*$)|(?:^[ \t]*([^\( \t\n\r\f][^\(\n\r\f]*)(?:\((\w[\w \t,]*)\))?[ \t]*[\f\n\r][\n\r]?(==+|--+)$)/im,
         line: true,
         subfield: true,
         subimage: true },
      image: {
         mark: /([ \t]*)!\[([\w \t]*)\]\(([\w:.\/\?&#\-~]+)[ \t]*(?:"([\w ]*)")?\)/im,
         inline: true },
      field: {
         mark: /^([ \t]*)(?:[\+\*])[ \t]*([\w.\/\?&#\-][\w.\/\?&#\- \t]*):[ \t]*([^&>\n\r\f]+)(?:-(?:(?:&gt;)|>)[ \t]*([^\(\n\r\f]+))?$/im,
         line: true,
         subimage: true,
         subtext:  "value" },
      option: {
         mark: /^[ \t]*([\+\*])[ \t]*([^\(&> \t][^\(&>\n\r\f]*)?(?:\(([\w \t-]+)\)[ \t]*)?(?:-(?:(?:&gt;)|>)[ \t]*([^\(\n\r\f]+)(?:\(([^\)\n\r\f]+)\))?)$/im,
         line: true },
      divert: {
         mark: /(?:(\w+)|"([^"]+)")(?:[ \t])*-(?:(?:&gt;)|>)[ \t]*(?:(\w[\w.]*)|"([^"]*)")/im,
         inline: true },
      entity: {
         mark: /@(?:(\w[\w \t]*)|"([\w \t]*)")(?:$|:[ \t]*([^\n\r\f]+))/im,
         line: true,
         subfield: true,
         subimage: true,
         subtext:  "speech" },
      mention: {
         mark: /@(?:(\w+)|"([\w \t]*)")/im,
         inline: true },
      input: {
         mark: /^\?[ \t]+([\w \t.]+)$/im,
         line: true,
         subfield: true,
         subimage: true,
         subtext:  "text" },
      "output": {
         mark: /\^([\w \t\.]+)(?:\(([\w \t]+)\))?\^/im,
         inline: true },
      compute: {
         mark: /~[ \t]*(\w+)?[ \t]*([+\-*/=])[ \t]*(\d+(?:\.\d+)?)$/im,
         line: true },
      "context-open": {
         mark: Translator.marksAnnotation["context-open"],
         line: true },
      "context-close": {
         mark: Translator.marksAnnotation["context-close"] },
      select: {
         mark: /\{([^\(\{\}\/]+)\}(?:\(([^\)]+)\))?(?:\/([^\/]+)\/)/im,
         inline: true },
      annotation: {
         mark: /\{([^\(\{\}\/]+)\}(?:\(([^\)]+)\))?/im,
         inline: true },
      linefeed: {
         mark: /[\f\n\r]+/im,
         inline: true }
      /*
      text: {
         mark: /([ \t]*)([^\f\n\r]+)$/im,
         line: true }
      */
   };

   Translator.fieldSet = ["vocabularies", "answers", "states", "labels"];

   Translator.inputSubtype = ["short", "text", "group select"];
   
   // Translator.specialCategories = ["start", "note"];
   
   Translator.contextHTML = {
      open:  /<p>(<dcc-group-select(?:[\w \t\+\-\*"'=\%\/,\.]*)?>)<\/p>/igm,
      close: /<p>(<\/dcc-group-select>)<\/p>/igm
   };

   Translator.defaultVariable = "points";

   Translator.instance = new Translator();
})();