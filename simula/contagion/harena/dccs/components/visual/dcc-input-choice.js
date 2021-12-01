/**
 * Input Choice and Option DCCs
 ******************************/

/**
 * Input Option DCC
 ******************/

class DCCInputOption extends DCCInput {
  constructor () {
    super()
    this.inputChanged = this.inputChanged.bind(this)
  }

  connectedCallback () {
    this._parent = (this.hasAttribute('parent'))
      ? document.querySelector('#' + this.parent)
      : (this.parentNode != null && this.parentNode.elementTag != null &&
            this.parentNode.elementTag() == DCCInputChoice.elementTag)
        ? this.parentNode : null

    super.connectedCallback()
    this.innerHTML = ''

    if (!this.hasAttribute('value')) { this.value = this._statement.trim() }

    // <TODO> align with dcc-state-select
    if (this._parent == null && this.hasAttribute('variable')) {
      MessageBus.int.publish('var/' + this.variable + '/input/ready',
        {
          sourceType: DCCInputOption.elementTag,
          content: this.value
        })
    }
  }

  disconnectedCallback () {
    if (parent == null) { this._presentation.removeEventListener('change', this.inputChanged) }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['parent', 'exclusive', 'checked', 'target', 'value', 'compute'])
  }

  get parent () {
    return this.getAttribute('parent')
  }

  set parent (newValue) {
    this.setAttribute('parent', newValue)
  }

  get exclusive () {
    return this.hasAttribute('exclusive')
  }

  set exclusive (isExclusive) {
    if (isExclusive) { this.setAttribute('exclusive', '') } else { this.removeAttribute('exclusive') }
  }

  get checked () {
    return this.hasAttribute('checked')
  }

  set checked (isExclusive) {
    if (isExclusive) { this.setAttribute('checked', '') } else { this.removeAttribute('checked') }
  }

  get target () {
    return this.getAttribute('target')
  }

  set target (newValue) {
    this.setAttribute('target', newValue)
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
  }

  get compute () {
    return this.getAttribute('compute')
  }

  set compute (newValue) {
    this.setAttribute('compute', newValue)
  }

  /* Event handling */

  inputChanged () {
    this.changed = true
    MessageBus.ext.publish('var/' + this.variable + '/changed',
      {
        sourceType: DCCInputOption.elementTag,
        value: this.value
      })
  }

  /* Rendering */

  elementTag () {
    return DCCInputOption.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  async _renderInterface () {
    if (this._parent == null) {
      // === pre presentation setup
      // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
      const statement =
            (this.hasAttribute('xstyle') && this.xstyle.startsWith('out'))
              ? '' : this._statement

      const html = (this.target)
        ? "<dcc-button id='[id]' xstyle='theme' topic='[target]' label='[statement]' divert='round' message='[value]' variable='[variable]'></dcc-button>"
          .replace('[id]', varid + nop)
          .replace('[target]', this.target)
          .replace('[statement]', child._statement)
          .replace('[value]', child.value)
          .replace('[variable]', this.variable)
        : "<input id='presentation-dcc' type='[exclusive]' name='[variable]' value='[value]'[checked]>[statement]</input>"
          .replace('[exclusive]', (this.hasAttribute('exclusive') ? 'radio' : 'checkbox'))
          .replace('[variable]', this.variable)
          .replace('[value]', this.value)
          .replace('[statement]', statement)
          .replace('[checked]', this.hasAttribute('checked') ? ' checked' : '')

      // === presentation setup (DCC Block)
      let presentation = await this._applyRender(html, 'innerHTML', 'input')

      // === post presentation setup
      presentation.addEventListener('change', this.inputChanged)

      this._presentationIsReady()
    }
  }
}

/**
 * Input Choice DCC
 ******************/

class DCCInputChoice extends DCCInput {
  constructor () {
    super()
    this._options = []
    this.inputChanged = this.inputChanged.bind(this)
  }

  async connectedCallback () {
    super.connectedCallback()

    // <TODO> To avoid recursivity -- improve
    if (!this.hasAttribute('statement')) { this._statement = null }
  }

  disconnectedCallback () {
    if (this._options != null) {
      for (const o of this._options) { o.removeEventListener('change', this.inputChanged) }
    }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['exclusive', 'shuffle', 'reveal', 'target'])
  }

  get exclusive () {
    return this.hasAttribute('exclusive')
  }

  set exclusive (isExclusive) {
    if (isExclusive) { this.setAttribute('exclusive', '') } else { this.removeAttribute('exclusive') }
  }

  get shuffle () {
    return this.hasAttribute('shuffle')
  }

  set shuffle (isShuffle) {
    if (isShuffle) { this.setAttribute('shuffle', '') } else { this.removeAttribute('shuffle') }
  }

  get reveal () {
    return this.getAttribute('reveal')
  }

  set reveal (newValue) {
    this.setAttribute('reveal', newValue)
  }

  get target () {
    return this.getAttribute('target')
  }

  set target (newValue) {
    this.setAttribute('target', newValue)
  }

  /* Event handling */

  inputChanged (event) {
    if (this.exclusive)
      this._value = event.target.value
    else if (this._value == null) {
      if (event.target.checked) this._value = [event.target.value]
    } else {
      if (event.target.checked)
        this._value.push(event.target.value)
      else {
        const index = this._value.indexOf(event.target.value)
        if (index > -1) this._value.splice(index, 1)
      }
    }

    this.changed = true
    MessageBus.ext.publish('var/' + this.variable + '/changed',
      {
        sourceType: DCCInputChoice.elementTag,
        value: this._value
      })
  }

  /* Rendering */

  elementTag () {
    return DCCInputChoice.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  async _renderInterface () {
    // === pre presentation setup
    // Fetch all the children that are not defined yet
    const undefinedOptions = this.querySelectorAll(':not(:defined)')

    const promises = [...undefinedOptions].map(option => {
      return customElements.whenDefined(option.localName)
    })
    // Wait for all the options be ready
    await Promise.all(promises)

    /*
      let options = this.querySelectorAll(DCCInputOption.elementTag);
      for (let o of options)
         this._options.push({value: o.value, statement: o._statement});
      */

    // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
    /*
      const statement =
         (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
         ? "" : this._statement;
      */

    let child = this.firstChild
    const html = []
    let nop = 0
    const varid = this.variable.replace(/\./g, '_')
    let inStatement = true
    let statement = ''
    while (child != null) {
      if (child.tagName &&
          child.tagName.toLowerCase() == DCCInputOption.elementTag) {
        nop++
        let iid = varid + '_' + nop
        const element = (this.target || child.target)
          ? "<dcc-button id='presentation-dcc-[id]' location='#in' topic='[target]' label='[statement]' divert='round' message='[value]' variable='[variable]'[connect]></dcc-button>[compute]"
            .replace('[id]', iid)
            .replace('[target]', (child.target) ? child.target : this.target)
            .replace('[statement]', child._statement)
            .replace('[value]', child.value)
            .replace('[variable]', this.variable)
            .replace('[connect]', (child.compute == null) ? '' :
              ' connect="click:presentation-dcc-[id]-compute:compute/update"'
                .replace('[id]', iid))
            .replace('[compute]', (child.compute == null) ? '' :
              '<dcc-compute id="presentation-dcc-[id]-compute" expression="[expression]"></dcc-compute>'
                .replace('[id]', iid)
                .replace('[expression]', child.compute))
          : "<input id='presentation-dcc-[id]' type='[exclusive]' name='[variable]' value='[value]'[checked]>[statement]</input>"
            .replace('[id]', iid)
            .replace('[exclusive]',
              (this.hasAttribute('exclusive') ? 'radio' : 'checkbox'))
            .replace('[variable]', this.variable)
            .replace('[value]', child.value)
            .replace('[statement]', child._statement)
            .replace('[checked]', child.hasAttribute('checked') ? ' checked' : '')
        html.push([1, element])
        inStatement = false
      } else {
        const element = (child.nodeType == 3) ? child.textContent : child.outerHTML
        if (inStatement && this._statement == null) { statement += element } else { html.push([0, element]) }
      }
      child = child.nextSibling
    }
    if (statement.length > 0) { this._statement = statement }
    this.innerHTML = ''

    // === presentation setup (DCC Block)
    if (this._statement != null) {
      let stm = this._statement
      if (this.hasAttribute('statement')) stm = '<p>' + stm + '</p>'
      await this._applyRender('<div id="presentation-dcc">' + stm + '</div>',
        'innerHTML', 'text', 'presentation-dcc', false)
    }

    let oop = []   // positions of html items
    let oopN = []  // positions in oop (to control shuffle)
    let no = 0
    const reveal =
      (!this.hasAttribute('reveal') || this.reveal == 'integral') && !this.shuffle
    for (let h in html)
      if ((html[h][0] == 0 && reveal) || html[h][0] == 1) {
        oop.push(h)
        oopN.push(no)
        no++
      }

    const shuffle = this.shuffle && !this.author
    if (shuffle) oopN = this._shuffle(oopN)

    let presentation
    nop = 0
    for (let o of oopN) {
      if (html[oop[o]][0] == 0) {
        if (reveal && html[oop[o]][1].trim().length > 0) {
            await this._applyRender('<span id="presentation-dcc">' + html[oop[o]][1] + '</span>',
              'innerHTML', 'input', 'presentation-dcc', false)
        }
      }
      else {
        nop++
        let presId = (shuffle) ? o+1 : nop
        presentation =
                 await this._applyRender(
                   html[oop[o]][1], 'innerHTML', 'item_' + nop,
                   'presentation-dcc-' + varid + '_' + presId, false)
        presentation.addEventListener('change', this.inputChanged)
        this._options.push(presentation)
      }
    }

    /*
    let presentation
    nop = 0
    for (const h of html) {
      // <TODO> temporarily disabled
      // if (h[0] == 0)
      //       await this._applyRender(h[1], "innerHTML", "input");
      // else {
      if (h[0] == 1) {
        nop++
        presentation =
               await this._applyRender(
                 h[1], 'innerHTML', 'item_' + nop,
                 'presentation-dcc-' + varid + '_' + nop, false)
        presentation.addEventListener('change', this.inputChanged)
        this._options.push(presentation)
      }
    }
    */

    // === post presentation setup
    /*
      if (presentation != null) {
         // v = 1;
         // for (let o of this._options) {
         for (let v = 1; v <= nop; v++) {
            let op = presentation.querySelector("#" + varid + v);
            if (op != null) {
               op.addEventListener("change", this.inputChanged);
               this._options.push(op);
            }
         }
      }
      */

    this._presentationIsReady()

    // <TODO> align with dcc-state-select
    MessageBus.int.publish('var/' + this.variable + '/group_input/ready',
      DCCInputChoice.elementTag)
  }

  _shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  editButtons () {
    return super.editButtons().concat([DCCVisual.editDCCExpand])
  }

  editExpandListener() {}
}

(function () {
  DCCInputOption.elementTag = 'dcc-input-option'
  DCCInputOption.editableCode = false
  customElements.define(DCCInputOption.elementTag, DCCInputOption)
  DCCInputChoice.elementTag = 'dcc-input-choice'
  DCCInputChoice.editableCode = false
  customElements.define(DCCInputChoice.elementTag, DCCInputChoice)
})()
