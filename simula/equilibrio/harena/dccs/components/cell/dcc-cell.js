/**
 * Cellular Space for DCCs
 */

class DCCCell extends DCCBase {
   constructor() {
      super();
      this._properties = {};
   }

   connectedCallback() {
      // Fetch all the children of that are not defined yet.
      let undefinedProps = this.querySelectorAll(':not(:defined)');

      let promises = [...undefinedProps].map(property => {
        return customElements.whenDefined(property.localName);
      });

      // Wait for all the properties are ready
      Promise.all(promises).then(() => {
         if (this.type)
            MessageBus.page.publish("dcc/cell-type/register", this);
      });
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["type", "label"]);
   }

   get type() {
      return this.getAttribute("type");
   }
   
   set type(newValue) {
      this.setAttribute("type", newValue);
   }

   get label() {
      return this.getAttribute("label");
   }
   
   set label(newValue) {
      this.setAttribute("label", newValue);
   }

   get space() {
      return (this._space) ? this._space : null;
   }
   
   set space(newValue) {
      this._space = newValue;
   }

   get properties() {
      return this._properties;
   }

   attachProperty(name, initial) {
      this._properties[name] = initial;
   }

   createSVGElement(type, row, col) {
      let coordinates;
      if (this.space != null)
         coordinates = this.space.computeCoordinates(row, col);
      else
         coordinates = DCCSpaceCellular.computeDefaultCoordinates(row, col);
      let element = document.createElementNS("http://www.w3.org/2000/svg", type);
      element.setAttribute("x", coordinates.x);
      element.setAttribute("y", coordinates.y);
      element.setAttribute("width", coordinates.width);
      element.setAttribute("height", coordinates.height);
      return element;
   }

   repositionElement(element, col, row) {
      let coordinates;
      if (this.space != null)
         coordinates = this.space.computeCoordinates(row, col);
      else
         coordinates = DCCSpaceCellular.computeDefaultCoordinates(col, row);
      element.setAttribute("x", coordinates.x);
      element.setAttribute("y", coordinates.y);
   }

   updateElementState(element, properties) {
      /* generic method to be refined in descendents */
   }
}

class DCCCellLight {
   constructor(dcc, element) {
      this.dcc = dcc;
      this.element = element;
      if (dcc.properties != null) {
         const props = Object.keys(dcc.properties);
         if (props.length !== 0) {
            if (props.length == 1 && dcc.properties.value)
               this.value = dcc.properties.value;
            else
               this.properties = dcc.properties;
         }
      }
   }
}

(function() {
   customElements.define("dcc-cell", DCCCell);
})();