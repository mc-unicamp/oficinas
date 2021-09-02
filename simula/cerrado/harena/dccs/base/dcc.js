/* DCC Factory
  ************/

class DCC {
  static webComponent(name, dccClass) {
    customElements.define(name, dccClass)
  }

  static component(name, bind, setup) {
    DCC.components[bind.toLowerCase() + "." + name.toLowerCase()] = setup;
  }

  static retrieve(name, bind) {
    return DCC.components[bind.toLowerCase() + "." + name.toLowerCase()];
  }

  // <FUTURE>
  /*
  static component(name, companion, content) {
    DCC.components[name] = class extends DCCVisual {
      constructor() {
        super()
        console.log('Element name: ')
        console.log(this.nodeName)
      }
    }

    customElements.define(name, DCC.components[name])
  }
  */
}

(function () {
  DCC.components = {}

  // defines if the environment will support DCC editing
  DCC.editable = false
})()
