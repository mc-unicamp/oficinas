/**
 * Panel Manager
 *
 * Manages the panels.
 */

class Panels {
   static start() {
      Panels.s = new Panels();
   }

   constructor() {
      this._knotPanelSize = 75;
      this._propertiesVisible = false;

      this._navigationBlock = document.querySelector("#navigation-block");
      this._knotPanel = document.querySelector("#knot-panel");
      this._knotMain = document.querySelector("#knot-main");
      this._propertiesPanel = document.querySelector("#properties-panel");
      this._buttonExpandNav = document.querySelector("#button-expand-nav");
      this._buttonRetracNav = document.querySelector("#button-retract-nav");
   }

   setupHiddenNavigator() {
      // this._navigationBlock.style.flex = "20%";
      this._navigationBlock.classList.remove("w-25");
      this._navigationBlock.style.display = "none";
      // this._knotPanel.style.flex = "80%";
      this._knotMain.classList.remove("w-" + this._knotPanelSize);
      this._knotPanelSize += 25;
      this._knotMain.classList.add("w-" + this._knotPanelSize);
      this._buttonExpandNav.style.display = "initial";
      this._buttonRetracNav.style.display = "none";
   }

   setupVisibleNavigator() {
      // this._navigationBlock.style.flex = "20%";
      // this._knotPanel.style.flex = "80%";
      this._knotMain.classList.remove("w-" + this._knotPanelSize);
      this._knotPanelSize -= 25;
      this._knotMain.classList.add("w-" + this._knotPanelSize);
      this._navigationBlock.classList.add("w-25");
      this._navigationBlock.style.display = "initial";
      this._buttonExpandNav.style.display = "initial";
      this._buttonRetracNav.style.display = "initial";
   }

   setupRegularNavigator() {
      this._buttonExpandProp.style.display = "initial";
      if (this._propertiesVisible)
         this.setupPropertiesExpand();
      this._knotMain.classList.add("w-" + this._knotPanelSize);
      this._navigationBlock.classList.remove("w-100");
      this._navigationBlock.classList.add("w-25");
      this._navigationBlock.style.display = "initial";
      this._buttonExpandNav.style.display = "initial";
      this._buttonRetracNav.style.display = "initial";
   }

   setupWideNavigator() {
      if (this._propertiesVisible) {
         this.setupPropertiesRetract();
         this._propertiesVisible = true;
      }
      this._knotMain.classList.remove("w-" + this._knotPanelSize);
      // this._navigationBlock.style.flex = "80%";
      // this._knotPanel.style.flex = "20%";
      this._navigationBlock.classList.remove("w-25");
      this._navigationBlock.classList.add("w-100");
      this._buttonExpandNav.style.display = "none";
      this._buttonRetracNav.style.display = "initial";
      this._buttonExpandProp.style.display = "none";
   }

   setupPropertiesRetract() {
      this._propertiesVisible = false;
      this._buttonRetractProp.style.display = "none";
      this._buttonExpandProp.style.display = "initial";
      this._elementsBlock.style.display = "none";
      this._elementsMain.classList.remove("w-25");
      this._knotMain.classList.remove("w-" + this._knotPanelSize);
      this._knotPanelSize += 25;
      this._knotMain.classList.add("w-" + this._knotPanelSize);
   }

   setupPropertiesExpand() {
      this._propertiesVisible = true;
      this._buttonRetractProp.style.display = "initial";
      this._buttonExpandProp.style.display = "none";
      this._elementsBlock.style.display = "initial";
      this._knotMain.classList.remove("w-" + this._knotPanelSize);
      this._knotPanelSize -= 25;
      this._knotMain.classList.add("w-" + this._knotPanelSize);
      this._elementsMain.classList.add("w-25");
   }

   setupProperties() {
      this._navigationBlock.style.flex = "10%";
      this._knotPanel.style.flex = "60%";
      this._propertiesPanel.style.display = "initial";
      // this._propertiesPanel.style.flex = "30%";
   }
}