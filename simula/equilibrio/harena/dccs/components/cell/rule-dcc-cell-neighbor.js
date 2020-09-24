/* DCC Rule Cell Neighbor
  ***********************/

class RuleDCCCellNeighbor extends RuleDCCCell {
   connectedCallback() {
      if (!this.neighbors) this.neighbors = this.innerHTML.replace(/[ \r\n]/g, "");
      this.innerHTML = "";
      this._ruleNeighbors = this.buildNeighborList(this.neighbors);

      if (!this.hasAttribute("probability")) this.probability = "100";
      this._decimalProbability = parseInt(this.probability) / 100;
      if (!this.hasAttribute("transition"))
         this.transition = "?_>_?";
      this._decomposeTransition(this.transition);
      MessageBus.page.publish("dcc/rule-cell/register", this);
   }

   buildNeighborList(map) {
      map = map.replace(/[ \r\n]/g, "");
      const size = Math.ceil(Math.sqrt(map.length));
      const shift = Math.floor((size-1)/2);
      let neighborList = [];
      for (let n = 0; n < map.length; n++)
         if (map[n] != "_")
            neighborList.push([Math.floor(n/size)-shift, n%size-shift]);
      return neighborList;
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return RuleDCCCell.observedAttributes.concat(
         ["neighbors", "probability", "transition"]);
   }

   get neighbors() {
      return this.getAttribute("neighbors");
   }
   
   set neighbors(newValue) {
      this.setAttribute("neighbors", newValue);
   }

   get ruleNeighbors() {
      return this._ruleNeighbors;
   }

   get probability() {
      return this.getAttribute("probability");
   }

   set probability(newValue) {
      this.setAttribute("probability", newValue);
      this._decimalProbability = parseInt(newValue) / 100;
   }

   get decimalProbability() {
      return this._decimalProbability;
   }

   get transition() {
      return this.getAttribute("transition");
   }

   set transition(newValue) {
      this.setAttribute("transition", newValue);
      this._decomposeTransition(newValue);
   }

   _decomposeTransition(transition) {
      this._oldSource = transition[0];
      this._oldTarget = transition[1];
      this._newSource = transition[3];
      this._newTarget = transition[4];

      // defines source->destination mapping between the evaluated cell pair
      this._transMap = [
         (transition[3] == "_") ? 0
            : ((transition[3] == transition[0])
               ? 1 : ((transition[3] == transition[1] && transition[3] != transition[4]) ? 2 : 0)),
         (transition[4] == "_") ? 0
            : ((transition[4] == transition[0] && transition[4] != transition[3])
               ? 1 : ((transition[4] == transition[1]) ? 2 : 0))
      ];
      this._maintainSource = this._transMap.includes(1);
      this._maintainTarget = this._transMap.includes(2);
   }

   notify(topic, message) {
      if (message.role) {
         switch (message.role.toLowerCase()) {
            case "probability": this.probability = message.body.value; break;
         }
      }
   }
}

class RuleDCCCellPair extends RuleDCCCellNeighbor {
   computeRule(spaceState, row, col) {
      let triggered = false;
      if (Math.random() <= this._decimalProbability) {
         let nb = this._ruleNeighbors.slice();
         while (nb.length > 0 && !triggered) {
            const neighbor = Math.floor(Math.random() * nb.length);
            let nr = row + nb[neighbor][0];
            let nc = col + nb[neighbor][1];
            nb.splice(neighbor, 1);
            if (spaceState.infinite) {
               nr = (nr < 0) ? spaceState.nrows - 1 : nr % spaceState.nrows;
               nc = (nc < 0) ? spaceState.ncols - 1 : nc % spaceState.ncols;
            }
            if (nr >= 0 && nr < spaceState.nrows &&
                nc >= 0 && nc < spaceState.ncols) 
               triggered = this._computeTransition(spaceState, row, col, nr, nc);
         }
      }
      return triggered;
   }

   // <NOTE> repeats the _computeTransition verification for performance reasons
   _checkTransition(spaceState, row, col, nr, nc) {
      const expectedTarget = (spaceState.state[nr][nc] == null)
         ? "_" : spaceState.state[nr][nc].dcc.type;
      return (expectedTarget == this._oldTarget ||
          ((this._oldTarget == "?" || this._oldTarget == "!") && expectedTarget != "_"));
   }

   _computeTransition(spaceState, row, col, nr, nc) {
      let triggered = false;
      let state = spaceState.state;
      const expectedTarget = (state[nr][nc] == null)
         ? "_" : state[nr][nc].dcc.type;
      if (expectedTarget == this._oldTarget ||
          ((this._oldTarget == "?" || this._oldTarget == "!") && expectedTarget != "_")) {
         triggered = true;

         // computes the new value of the target
         const valueTarget = (!"?!@".includes(this._newTarget)) ? this._newTarget
            : ((this._newTarget == "@")
               ? spaceState.vtypes[Math.floor(Math.random() * spaceState.vtypes.length)]
               : ((this._oldSource == this._newTarget) ? 
                  state[row][col].dcc.type : expectedTarget));
         const valueSource = (!"?!@".includes(this._newSource)) ? this._newSource
            : ((this._newSource == "@")
               ? spaceState.vtypes[Math.floor(Math.random() * spaceState.vtypes.length)]
               : ((this._oldSource == this._newSource)
                  ? state[row][col].dcc.type : expectedTarget));

         if (!this._maintainSource && state[row][col] != null &&
             (nr != row || nc != col)){
            spaceState.cells.removeChild(state[row][col].element);
            state[row][col] = null;
         }
         if (!this._maintainTarget && state[nr][nc] != null) {
            spaceState.cells.removeChild(state[nr][nc].element);
            state[nr][nc] = null;
         }

         const newState = state[nr][nc];

         switch (this._transMap[1]) {
            case 0:
               if (valueTarget != "_") {
                  state[nr][nc] =
                     spaceState.cellTypes[valueTarget].createIndividual(nr+1, nc+1);
                  spaceState.cells.appendChild(state[nr][nc].element);
               } else
                  state[nr][nc] = null;
               spaceState.changed[nr][nc] = true;
               break;
            case 1:
               state[nr][nc] = state[row][col];
               spaceState.cellTypes[valueTarget].repositionElement(
                  state[row][col].element, nc+1 , nr+1);
               spaceState.changed[nr][nc] = true;
               break;
         }

         if (nr != row || nc != col)
            switch (this._transMap[0]) {
               case 0:
                  if (valueSource != "_") {
                     state[row][col] =
                        spaceState.cellTypes[valueSource].createIndividual(row+1, col+1);
                     spaceState.cells.appendChild(state[row][col].element);
                  } else
                     state[row][col] = null;
                  spaceState.changed[row][col] = true;
                  break;
               case 2:
                  state[row][col] = newState;
                  spaceState.cellTypes[valueSource].repositionElement(
                     state[row][col].element, col+1 , row+1);
                  spaceState.changed[row][col] = true;
                  break;
            }
      }
      return triggered;
   }
}

class RuleDCCCellFlow extends RuleDCCCellPair {
   connectedCallback() {
      super.connectedCallback();
      if (!this.hasAttribute("flow"))
         this.flow = "-+";
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return RuleDCCCellPair.observedAttributes.concat(["flow"]);
   }

   get flow() {
      return this.getAttribute("flow");
   }
   
   set flow(newValue) {
      this.setAttribute("flow", newValue);
   }

   computeRule(spaceState, row, col) {
      let triggered = false;
      if (Math.random() <= this._decimalProbability) {
         // order neighbors by value
         let nb = [];
         for (let n of this._ruleNeighbors) {
            if (row + n[0] >= 0 && row + n[0] < spaceState.nrows &&
                col + n[1] >= 0 && col + n[1] < spaceState.ncols &&
                this._checkTransition(spaceState, row, col, row + n[0], col + n[1])) {
               const prp = this._retrieveValue(spaceState.state[row + n[0]][col + n[1]]);
               let value = (prp == null) ? 0 : parseInt(prp.value);
               let p;
               for (p = 0; p < nb.length && value > nb[p][2]; p++)
                  /* nothing */;
               nb.splice(p, 0, [row + n[0], col + n[1], value]);
            }
         }

         // randomize neighbors with the same value
         let last = 0;
         while (last < nb.length) {
            let first = last;
            do {
               last++;
            } while (last < nb.length && nb[last][2] == nb[first][2]);
            if (last > first+1) {
               let reorder = nb.slice(first, last-1);
               const size = reorder.length;
               for (let r = 0; r < size; r++) {
                  let ex = Math.floor(Math.random() * reorder.length);
                  nb[first+r] = reorder[ex];
                  reorder.splice(ex, 1);
               }
            }
         }

         if (this.flow == "-/" || this.flow == "=/") {
            const ps = this._retrieveValue(spaceState.state[row][col]);
            const vs = (ps == null) ? 0 : parseInt(ps.value);
            this._transferRate = (nb.length == 0) ? 0 : Math.floor(vs / nb.length);
         }

         let trig = false;
         for (let n = 0; n < nb.length; n++) {
            trig = this._computeTransition(spaceState, row, col,
                                           nb[n][0], nb[n][1]);
            if (trig)
               triggered = true;
         }
      }
      return triggered;
   }

   _retrieveValue(cell) {
      let val = null;
      if (cell != null) {
         if (cell.value != null) {
            cell.value = parseInt(cell.value);
            val = cell;
         } else if (cell.properties != null && cell.properties.value != null) {
            cell.properties.value = parseInt(cell.properties.value);
            val = cell.properties;
         }
      }
      return val;
   }

   _defineValue(cell, value) {
      let val = null;
      if (cell != null) {
         if (cell.properties && cell.properties.value) {
            cell.properties.value = parseInt(value);
            val = cell.properties;
         } else {
            cell.value = parseInt(value);
            val = cell;
         }
      }
      return val;
   }

   _removeValue(cell) {
      if (cell != null) {
         if (cell.properties && cell.properties.value)
            delete cell.properties.value;
         if (cell.value)
            delete cell.value;
      }
   }

   _computeTransition(spaceState, row, col, nr, nc) {
      let triggered = false;
      let state = spaceState.state;
      let preSource = (state[row][col] == null) ? null : state[row][col].dcc.type;
      let preTarget = (state[nr][nc] == null) ? null : state[nr][nc].dcc.type;
      let propSource = this._retrieveValue(state[row][col]);
      let vSource = (propSource == null) ? 0 : parseInt(propSource.value);
      let propTarget = this._retrieveValue(state[nr][nc]);
      let vTarget = (propTarget == null) ? 0 : parseInt(propTarget.value);
      switch (this.flow) {
         case "-+":
            if (vSource > 1 && vSource > vTarget && propTarget != null) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource.value--;
               propTarget.value++;
            }
            break;
         case "+-":
            if (propSource != null && vTarget > 0) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource.value++;
               propTarget.value--;
            }
            break;
         case "-1":
            if (vSource > 1 && vSource > vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource.value--;
               propTarget = this._defineValue(state[nr][nc], 1);
            }
            break;
         case "_=":
            if (vSource > 0 && vSource > vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propTarget = this._defineValue(state[nr][nc], vSource);
               if (this._transMap[1] != 1)
                  propSource = this._removeValue(state[row][col]);
            }
            break;
         case "_*":
            if (vSource > 0) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propTarget = this._defineValue(state[nr][nc], vSource);
               if (this._transMap[1] != 1)
                  propSource = this._removeValue(state[row][col]);
            }
            break;
         case "_-":
            if (vSource > 1 && vSource > vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propTarget = this._defineValue(state[nr][nc], vSource-1);
               if (this._transMap[1] != 1)
                  propSource = this._removeValue(state[row][col]);
            }
            break;
         case "_+":
            if (propSource != null && vSource+1 >= vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propTarget = this._defineValue(state[nr][nc], vSource+1);
               if (this._transMap[1] != 1)
                  propSource = this._removeValue(state[row][col]);
            }
            break;
         case "-/":
            if (this._transferRate > 0 && vSource - this._transferRate >= vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource.value -= this._transferRate;
               propTarget = this._defineValue(state[nr][nc], vTarget + this._transferRate);
            }
            break;
         case "==":
            if (vSource > 0 && vSource > vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource = this._defineValue(state[row][col], vSource);
               propTarget = this._defineValue(state[nr][nc], vSource);
            }
            break;
         case "=-":
            if (vSource > 1 && vSource > vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource = this._defineValue(state[row][col], vSource);
               propTarget = this._defineValue(state[nr][nc], vSource-1);
            }
            break;
         case "=+":
            if (propSource != null && vSource+1 >= vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource = this._defineValue(state[row][col], vSource);
               propTarget = this._defineValue(state[nr][nc], vSource+1);
            }
            break;
         case "=/":
            if (this._transferRate > 0 && vSource - this._transferRate >= vTarget) {
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
               propSource = this._defineValue(state[row][col], vSource);
               propTarget = this._defineValue(state[nr][nc], vTarget + this._transferRate);
            }
            break;
         case "0":
            if (vSource == 0)
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
            break;
         case "1":
            if (vSource == 1)
               triggered = super._computeTransition(spaceState, row, col, nr, nc);
            break;
      }
      if (triggered) {
         if (state[row][col] != null)
            state[row][col].dcc.updateElementState(
               state[row][col].element, propSource);
         if (state[nr][nc] != null)
            state[nr][nc].dcc.updateElementState(
               state[nr][nc].element, propTarget);
      }
      return triggered;
   }
}

(function() {
   customElements.define("rule-dcc-cell-pair", RuleDCCCellPair);
   customElements.define("rule-dcc-cell-flow", RuleDCCCellFlow);
})();