/*
 * Main Author Environment
 *
 * Main authoring environment, which presents the visual interface and
 * coordinates the authoring activities.
 */

class AuthorCellManager {
   constructor() {
   	this.source = null;
   	this._playground = null;
   	this._editMode = true;
   	this._pĺaySpace = false;

   	MessageBus.page = new MessageBus(false);
      Basic.service.rootPath = "../../";
   }

   start() {
      this.switchEditor = this.switchEditor.bind(this);
      this.playSpace = this.playSpace.bind(this);
      this.stopSpace = this.stopSpace.bind(this);
      this.restartSpace = this.restartSpace.bind(this);
      this.scriptExpand = this.scriptExpand.bind(this);
      this.scriptRetract = this.scriptRetract.bind(this);
      this.cellsExpand = this.cellsExpand.bind(this);
      this.cellsRetract = this.cellsRetract.bind(this);

      MessageBus.ext.subscribe("control/editor/switch", this.switchEditor);
      MessageBus.ext.subscribe("control/space/play", this.playSpace);
      MessageBus.ext.subscribe("control/space/stop", this.stopSpace);
      MessageBus.ext.subscribe("control/space/restart", this.restartSpace);
      MessageBus.ext.subscribe("control/script/expand", this.scriptExpand);
      MessageBus.ext.subscribe("control/script/retract", this.scriptRetract);
      MessageBus.ext.subscribe("control/cells/expand", this.cellsExpand);
      MessageBus.ext.subscribe("control/cells/retract", this.cellsRetract);

      this._scriptActive = true;

      let parameters = window.location.search.substr(1);
      if (parameters != null && parameters.length > 0) {
         const sourceMatch = parameters.match(/source=([\w-\/]+)/i);
         if (sourceMatch != null) {
            this.source = sourceMatch[1];
            let caseScript = document.createElement("script");
            caseScript.src = "gallery/" + this.source + ".js";
            document.head.appendChild(caseScript);
         }

         const scriptMatch = parameters.match(/mode=([\w-]+)/i);
         if (scriptMatch != null && scriptMatch[1] == "no-script") {
            this._scriptActive = false;
            AuthorCellManager.stateVis["script-panel"][0] = 0;
         }
      }
      if (this._scriptActive) {
         document.querySelector("#action-panels").innerHTML =
            AuthorCellManager.scriptPanel;
         document.querySelector("#button-retract-script").hide();
         document.querySelector("#button-retract-cells").hide();
      } else
         document.querySelector("#action-panels").innerHTML =
            AuthorCellManager.noScriptPanel;
   }

   insertSource(name, types, blocks, source, buttonTypes) {
      if (this._scriptActive) {
         ScriptBlocksCell.create(types);

         document.querySelector("#xml-toolbox").innerHTML =
             `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">` +
             blocks +
             `</xml>`;

         this._playground = Blockly.inject("script-panel",
            {media: "../../lib/blockly-07762ff/media/",
             toolbox: document.getElementById("toolbox")});
      }

      document.querySelector("#source-name").innerHTML = name;
      document.querySelector("#render-panel").innerHTML = source;
      document.querySelector("#types-panel").innerHTML = buttonTypes;

      this._updateVisibility();
   }

   _updateVisibility() {
      for (let sv in AuthorCellManager.stateVis) {
         let s = document.querySelector("#" + sv);
         if (s != null) {
            const vis = 
              AuthorCellManager.stateVis[sv][(this._editMode) ? 0 : 1];
            s.style.display = ((vis == 0) ? "none" : "initial");
         }
      }
   }

   async switchEditor() {
      MessageBus.ext.publish("timer/stop");
      this._editMode = !this._editMode;
      this._updateVisibility();

      if (this._editMode) {
	      if (this._playTriggered) {
	         this._playTriggered = false;
	         let decision = await DCCNoticeInput.displayNotice(
	            "Você quer retornar ao cenário original ou editar esse novo cenário que você está vendo?",
	            "message", "Voltar ao Original", "Este Cenário");
	         if (decision == "Voltar ao Original")
	         	MessageBus.ext.publish("state/reset");
	      }
         MessageBus.ext.publish("space/edit");
	  } else {
        MessageBus.ext.publish("state/save");
        if (this._scriptActive) {
           await MessageBus.page.request("dcc/rules/clear");
           document.querySelector("#rules-panel").innerHTML =
              Blockly.JavaScript.workspaceToCode(this._playground);
        }
        MessageBus.ext.publish("space/view");
	  }
   }

   playSpace() {
      document.querySelector("#play-button").style.display = "none";
      document.querySelector("#stop-button").style.display = "initial";
      this._playTriggered = true;
      MessageBus.ext.publish("timer/start");
   }

   stopSpace() {
      document.querySelector("#play-button").style.display = "initial";
      document.querySelector("#stop-button").style.display = "none";
      MessageBus.ext.publish("timer/stop");
   }

   restartSpace() {
      MessageBus.ext.publish("timer/stop");
      MessageBus.ext.publish("state/reset");
   }

   scriptExpand() {
      document.querySelector("#render-panel").style.display = "none";
      document.querySelector("#types-panel").style.display = "none";
      document.querySelector("#composition-block").classList.remove("col-6");
      let sb = document.querySelector("#script-block");
      sb.classList.remove("col-6");
      sb.classList.add("col-12");
      document.querySelector("#button-retract-script").show();
      document.querySelector("#button-expand-script").hide();
      document.querySelector("#button-expand-cells").hide();
      this.resizeWorkspace();
   }

   cellsExpand() {
      document.querySelector("#script-block").classList.remove("col-6");
      let cb = document.querySelector("#composition-block");
      cb.classList.remove("col-6");
      cb.classList.add("col-12");
      document.querySelector("#button-retract-cells").show();
      document.querySelector("#button-expand-script").hide();
      document.querySelector("#button-expand-cells").hide();
      this.resizeWorkspace();
   }

   scriptRetract() {
      document.querySelector("#render-panel").style.display = "initial";
      document.querySelector("#types-panel").style.display = "initial";
      document.querySelector("#composition-block").classList.add("col-6");
      let sb = document.querySelector("#script-block");
      sb.classList.remove("col-12");
      sb.classList.add("col-6");
      document.querySelector("#button-retract-script").hide();
      document.querySelector("#button-expand-script").show();
      document.querySelector("#button-expand-cells").show();
      this.resizeWorkspace();
   }

   cellsRetract() {
      document.querySelector("#script-block").classList.add("col-6");
      let cb = document.querySelector("#composition-block");
      cb.classList.remove("col-12");
      cb.classList.add("col-6");
      document.querySelector("#button-retract-cells").hide();
      document.querySelector("#button-expand-script").show();
      document.querySelector("#button-expand-cells").show();
      this.resizeWorkspace();
   }

   resizeWorkspace() {
      let toolbox = document.getElementById("toolbox");
      let sp = document.querySelector("#script-panel");
      let x = 0;
      let y = 0;
      do {
         x += sp.offsetLeft;
         y += sp.offsetTop;
         sp = sp.offsetParent;
      } while (sp);
      toolbox.style.left = x + 'px';
      toolbox.style.top = y + 'px';
      toolbox.style.width = toolbox.offsetWidth + 'px';
      toolbox.style.height = toolbox.offsetHeight + 'px';
      Blockly.svgResize(this._playground);
   }

}

(function() {
AuthorCellManager.instance = new AuthorCellManager();

AuthorCellManager.stateVis = {
   "play-button":    [0, 1],
   "stop-button":    [0, 0],
   "restart-button": [0, 1],
   "next-button":    [0, 1],
   "types-panel":    [1, 0],
   "script-panel":   [1, 0],
   "editor-button":  [0, 1],
   "execute-button": [1, 0]
};

AuthorCellManager.scriptPanel =
`<div id="composition-block" class="d-flex col-6 flex-column align-items-stretch">
   <div>
      <div id="render-panel"></div>
      <div id="types-panel"></div>
   </div>
   <div id="rules-panel"></div>
</div>
<div id="script-block" class="d-flex col-6 flex-column align-items-stretch">
   <div class="sty-navigation-expansion">
       <dcc-trigger id="button-expand-script" action="control/script/expand" label="Expand" image="images/icon/icon-expansion-left.svg"></dcc-trigger>
       <dcc-trigger id="button-retract-script" action="control/script/retract" label="Retract" image="images/icon/icon-expansion-right.svg"></dcc-trigger>
   </div>
   <div class="sty-navigation-expansion">
       <dcc-trigger id="button-retract-cells" action="control/cells/retract" label="Expand" image="images/icon/icon-expansion-left.svg"></dcc-trigger>
       <dcc-trigger id="button-expand-cells" action="control/cells/expand" label="Retract" image="images/icon/icon-expansion-right.svg"></dcc-trigger>
   </div>
   <div class="h-100 w-100" style="padding-left:.800rem">
      <div class="h-100 w-100" id="script-panel"></div>
   </div>
</div>`;

AuthorCellManager.noScriptPanel =
`<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="render-panel"></div>
</div>
<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="types-panel" class="h-100 w-100"></div>
   <div id="script-panel"></div>
   <div id="rules-panel"></div>
</div>`;

})();