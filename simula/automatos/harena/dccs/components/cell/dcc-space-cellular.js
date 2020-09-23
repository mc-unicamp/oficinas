/**
 * Cellular Space for DCCs
 */

class DCCSpaceCellular extends DCCBase {
   constructor() {
      super();
      this.cellTypeRegister = this.cellTypeRegister.bind(this);
      this.ruleRegister = this.ruleRegister.bind(this);
      this.stateNext = this.stateNext.bind(this);
      this.notify = this.notify.bind(this);
      
      this._cellTypes = {};
      this._rules = {};
      this._wildcardRules = [];
      this._stateTypes = [];
   }

   connectedCallback() {
      this._stateStr = this.innerHTML.trim();

      for (let c of this._stateStr)
         if (![" ", "_", "\r", "\n"].includes(c) && !this._stateTypes.includes(c))
            this._stateTypes.push(c);

      this._buildInnerHTML();

      if (!this._state && this._checkAllTypes())
         this._createIndividuals();

      MessageBus.page.subscribe("dcc/cell-type/register", this.cellTypeRegister);
      MessageBus.page.subscribe("dcc/rule-cell/register", this.ruleRegister);
   }

   _buildInnerHTML() {
      this._stateLines = [];

      if (this._stateStr.length > 0) {
         this._stateLines = this._stateStr.split(/[\r\n]+/gm);
         for (let s in this._stateLines)
            this._stateLines[s] = this._stateLines[s].trim();
      }

      if (!this.rows)
         this.rows = (this._stateLines.length > 0) ? this._stateLines.length : 10;
      if (!this.cols)
         if (this._stateLines.length > 0) {
            let maior = this._stateLines[0].length;
            for (let s in this._stateLines)
               maior = (this._stateLines[s].length > maior) ? this._stateLines[s].length : maior;
            this.cols = maior;
         } else
            this.cols = 10;

      if (!this.cellWidth) this.cellWidth = DCCSpaceCellular.defaultCellDimensions.width;
      if (!this.cellHeight) this.cellHeight = DCCSpaceCellular.defaultCellDimensions.height;

      if (!this.backgroundColor) this.backgroundColor = "#ffffc8";

      this.innerHTML = DCCSpaceCellular.svgTemplate
                         .replace(/\[cell-width\]/g, this.cellWidth + "px")
                         .replace(/\[cell-height\]/g, this.cellHeight + "px")
                         .replace(/\[width\]/g, this.cols * this.cellWidth + "px")
                         .replace(/\[height\]/g, this.rows * this.cellHeight + "px")
                         .replace(/\[background-color\]/g, this.backgroundColor)
                         .replace(/\[grid\]/g, (this.grid) ? ";stroke-width:2;stroke:#646464" : "");
      this._cellGrid = this.querySelector("#cell-grid");
      this._cells = this.querySelector("#cells");
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/cell-type/register", this.cellTypeRegister);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["label", "cols", "rows", "cell-width", "cell-height", "background-color", "grid",
          "infinite"]);
   }

   get label() {
      return this.getAttribute("label");
   }
   
   set label(newValue) {
      this.setAttribute("label", newValue);
   }

   get cols() {
      return this.getAttribute("cols");
   }
   
   set cols(newValue) {
      this.setAttribute("cols", newValue);
   }

   get rows() {
      return this.getAttribute("rows");
   }
   
   set rows(newValue) {
      this.setAttribute("rows", newValue);
   }

   get cellWidth() {
      return this.getAttribute("cell-width");
   }
   
   set cellWidth(newValue) {
      this.setAttribute("cell-width", newValue);
   }

   get cellHeight() {
      return this.getAttribute("cell-height");
   }
   
   set cellHeight(newValue) {
      this.setAttribute("cell-height", newValue);
   }

   get backgroundColor() {
      return this.getAttribute("background-color");
   }
   
   set backgroundColor(newValue) {
      this.setAttribute("background-color", newValue);
   }

   get grid() {
      return this.hasAttribute("grid");
   }

   set grid(hasGrid) {
      if (hasGrid)
         this.setAttribute("grid", "");
      else
         this.removeAttribute("grid");
   }

   get infinite() {
      return this.hasAttribute("infinite");
   }

   set infinite(isInfinite) {
      if (hasGrid)
         this.setAttribute("grid", "");
      else
         this.removeAttribute("grid");
   }

   cellTypeRegister(topic, cellType) {
      cellType.space = this;
      this._cellTypes[cellType.type] = cellType;
      if (!this._rules[cellType.type])
         this._rules[cellType.type] = this._wildcardRules.slice();
      if (!this._state && this._checkAllTypes())
         this._createIndividuals();
   }

   _checkAllTypes() {
      let all = (this._stateTypes.length > 0) ? true : false;
      for (let s in this._stateTypes)
         if (!this._cellTypes[this._stateTypes[s]])
            all = false;
      return all;
   }

   _createIndividuals() {
      this._state = this._createEmptyState();
      if (this._stateLines.length > 0) {
         for (let r in this._stateLines) {
            for (let c = 0; c < this._stateLines[r].length; c++) {
               if (this._cellTypes[this._stateLines[r][c]]) {
                  this._state[r][c] =
                     this._cellTypes[this._stateLines[r][c]].createIndividual(parseInt(r)+1, c+1);
                  this._cells.appendChild(this._state[r][c].element);
               }
            }
         }
      }
   }

   _createEmptyState() {
      let state = [];
      for (let r = 0; r < this.rows; r++) {
         let row = [];
         for (let c = 0; c < this.cols; c++)
            row.push(null);
         state.push(row);
      }
      return state;
   }

   _changeControl() {
      let control = [];
      for (let row = 0; row < this._state.length; row++) {
         control[row] = [];
         for (let col = 0; col < this._state[row].length; col++)
            control[row][col] = false;
      }
      return control;
   }

   ruleRegister(topic, rule) {
      console.log("=== before rules");
      console.log(this._rules);
      if (rule.transition[0] == "?" || rule.transition[0] == "!") {
         this._wildcardRules.push(rule);
         for (let r in this._cellTypes) {
            if (!this._rules[r])
               this._rules[r] = this._wildcardRules.slice();
            this._rules[r].push(rule);
         }
      } else {
         if (!this._rules[rule.transition[0]])
            this._rules[rule.transition[0]] = this._wildcardRules.slice();
         this._rules[rule.transition[0]].push(rule);
      }
      console.log("=== rules");
      console.log(this._rules);
   }

   computeCoordinates(row, col) {
      return {
         x: (col-1) * this.cellWidth,
         y: (row-1) * this.cellHeight,
         width : this.cellWidth,
         height: this.cellHeight
      };
   }

   static computeDefaultCoordinates(row, col) {
      return {
         x: col *  DCCSpaceCellular.defaultCellDimensions.width,
         y: row * DCCSpaceCellular.defaultCellDimensions.height,
         width : DCCSpaceCellular.defaultCellDimensions.width,
         height: DCCSpaceCellular.defaultCellDimensions.height
      };
   }

   notify(topic, message) {
      if (message.role) {
         switch (message.role.toLowerCase()) {
            case "next": this.stateNext(); break;
         }
      }
   }

   stateNext() {
      let spaceState = {
         state: this._state,
         nrows: this._state.length,
         infinite: this.infinite,
         cells: this._cells,
         cellTypes: this._cellTypes,
         vtypes: Object.keys(this._cellTypes),
         changed: this._changeControl()
      };
      for (let r = 0; r < spaceState.nrows; r++) {
         let row = this._state[r];
         spaceState.ncols = row.length;
         for (let c = 0; c < spaceState.ncols; c++) {
            let cell = row[c];
            if (cell != null && !spaceState.changed[r][c] && this._rules[cell.dcc.type]) {
               let triggered = false;
               for (let m = 0; m < this._rules[cell.dcc.type].length && !triggered; m++)
                  triggered = this._rules[cell.dcc.type][m].computeRule(spaceState, r, c);
            }
         }
      }
   }
}

class DCCSpaceCellularEditor extends DCCSpaceCellular {
   constructor() {
      super();
      this._editType = "_";
      this.cellClicked = this.cellClicked.bind(this);
      this.rulesClear = this.rulesClear.bind(this);
      MessageBus.page.subscribe("dcc/rules/clear", this.rulesClear);
   }

   connectedCallback() {
      super.connectedCallback();
      this.activateEditor();
   }

   activateEditor() {
      this._activeEditor = true;
      this._cellGrid.addEventListener("click", this.cellClicked, false);
   }

   cellClicked(event) {
      const gc = this._cellGrid.getBoundingClientRect();
      const cell = this.computeCell(event.clientX - gc.x,
                                    event.clientY - gc.y);
      this.changeState(this._editType, cell.row, cell.col);
   }

   computeCell(x, y) {
      return {
         row: Math.floor(y / this.cellHeight) + 1,
         col: Math.floor(x / this.cellWidth) + 1
      };
   }

   changeState(type, row, col) {
      let r = row - 1;
      let c = col - 1;
      if (this._state[r][c] != null && this._state[r][c].dcc.type != type) {
         this._cells.removeChild(this._state[r][c].element);
         this._state[r][c] = null;
      }
      if ((this._state[r][c] == null || this._state[r][c].dcc.type != type) &&
          this._cellTypes[type]) {
         this._state[r][c] =
            this._cellTypes[type].createIndividual(row, col);
         this._cells.appendChild(this._state[r][c].element);
      }
   }

   serializeState() {
      let str = "";
      for (let r in this._state) {
         for (let c in this._state[r])
            str += (this._state[r][c] == null) ? "_" : this._state[r][c].dcc.type;
         str += "\n";
      }
      return str;
   }

   // <TODO> provisory
   resetState() {
      this._buildInnerHTML();
      this._createIndividuals();
      this.activateEditor();
   }

   // <TODO> provisory
   saveState() {
      this._stateStr = this.serializeState();
      localStorage.setItem(DCCSpaceCellular.storeId, this._stateStr);
   }

   // <TODO> provisory
   loadState() {
      this._stateStr = localStorage.getItem(DCCSpaceCellular.storeId);
      this.resetState();
   }

   rulesClear(topic, message) {
      this._rules = {};
      this._wildcardRules = [];
      MessageBus.page.publish(MessageBus.buildResponseTopic(topic, message), true);
   }

   // <TODO> provisory
   downloadState() {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
         new Blob([this.serializeState()], {type: "text/plain"})
      );
      a.setAttribute("download", "cenario.txt");

      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
   }

   notify(topic, message) {
      super.notify(topic, message);
      if (message.role) {
         switch (message.role.toLowerCase()) {
            case "type": let tLabel = MessageBus.extractLevel(topic, 2);
                         if (tLabel.toLowerCase() == "empty")
                            this._editType = "_";
                         else
                            for (let t in this._cellTypes)
                               if (this._cellTypes[t].label.toLowerCase() == tLabel.toLowerCase())
                                  this._editType = t;
                         break;
            case "reset": this.resetState(); break;
            case "save":  this.saveState(); break;
            case "load":  this.loadState(); break;
            case "download": this.downloadState(); break;
         }
      }
   }
}

(function() {
   DCCSpaceCellular.svgTemplate =
`<div width="[width]" height="[height]">
<svg width="[width]" height="[height]">
<def>
  <pattern id="grid" width="[cell-width]" height="[cell-height]" patternUnits="userSpaceOnUse">
    <rect width="[cell-width]" height="[cell-height]"
     style="fill:[background-color][grid]"/>
  </pattern>
</def>
<g id="cell-grid">
   <rect fill="url(#grid)" x="0" y="0" width="[width]" height="[height]"/>
   <g id="cells"/>
</g>
</svg>
</div>`;

   DCCSpaceCellular.defaultCellDimensions = {width: 20, height: 20};

   DCCSpaceCellular.storeId = "harena-dcc-cell-space-state";

   customElements.define("dcc-space-cellular", DCCSpaceCellular);
   customElements.define("dcc-space-cellular-editor", DCCSpaceCellularEditor);
})();