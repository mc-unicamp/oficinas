class LayoutController {
  constructor () {
    this._case = null
    this._user = null
    this.busMessages()
    // this.startController()
  }

  set case (newValue) {
    this._case = newValue
  }

  get case () {
    return this._case
  }

  set user (newValue) {
    this._user = newValue
  }

  get user () {
    return this._user
  }

  async startController(){
    // await MessageBus.int.waitMessage('control/html/ready')

    if(new URL(document.location).pathname == '/author/'){
      this.dynamicAuthor()
    }
    if(new URL(document.location).pathname == '/author/home/'){
      this.dynamicMenu()
    }else if(new URL(document.location).pathname == '/author/drafts/feedback/'){
      this.dynamicCaseListFeedback()
    }

  }

  async busMessages(){
    LayoutController.user = await MessageBus.int.waitMessage('data/user/info')
    if(new URL(document.location).pathname == '/author/'){
      LayoutController.case = await MessageBus.ext.waitMessage('service/response/get/harena-case')
    }
    this.startController()
  }

  async dynamicAuthor (){

    if(LayoutController.case.message.category_id === 'pocus-training'
    && LayoutController.user.message.institution === 'hcpa'){
      const toolbarDiv = document.querySelector('#div-toolbar-rightside')
      toolbarDiv.innerHTML =
      `<div class="home-author-sub-text align-self-center" style="color:#808080">FEEDBACK:</div>
      <dcc-rest id="harena-ask-feedback" bind="harena-ask-feedback"
      subscribe="service/request/post:retrieve"></dcc-rest>
      <dcc-rest id="harena-case-property" bind="harena-case-property" subscribe="service/request/post:retrieve"></dcc-rest>
      <form id="form-case-property">
      <input type="hidden" id="property_value" name="property_value" value="">
      <input type="hidden" id="property_title" name="property_title" value="feedback">

      </form>`
      // ------------------------------------------------------------------------------- //



      const dccSubmitProp = document.createElement('dcc-submit')
      const userGrade = LayoutController.user.message.grade
      const formProp = document.querySelector('#form-case-property')
      const inputPropertyValue = document.querySelector('#property_value')


      if(userGrade === 'aluno'){

        dccSubmitProp.setAttribute('id','dcc-submit-feedback')
        dccSubmitProp.setAttribute('bind','submit-case-property')
        dccSubmitProp.setAttribute('xstyle','btn btn-secondary m-1')
        dccSubmitProp.setAttribute('label', "Send to Professor")
        dccSubmitProp.setAttribute('topic','service/request/post')
        // dccSubmitProp.setAttribute('connect','submit:harena-case-property:service/request/post')
        dccSubmitProp.setAttribute('data-toggle','tooltip')
        dccSubmitProp.setAttribute('data-placement','top')
        dccSubmitProp.setAttribute('title',"Send case for professor's feedback")
        await formProp.appendChild(dccSubmitProp)

        inputPropertyValue.value = '0'

      }else if(userGrade === 'professor' || userGrade === 'coordinator'){
        dccSubmitProp.setAttribute('id','dcc-submit-feedback')
        dccSubmitProp.setAttribute('bind','submit-case-property')
        dccSubmitProp.setAttribute('xstyle','btn btn-secondary m-1')
        dccSubmitProp.setAttribute('label','Set Feedback Complete')
        dccSubmitProp.setAttribute('topic','service/request/put')
        dccSubmitProp.setAttribute('connect','submit:harena-case-property:service/request/put')
        dccSubmitProp.setAttribute('data-toggle','tooltip')
        dccSubmitProp.setAttribute('data-placement','top')
        dccSubmitProp.setAttribute('title',"Sets feedback as finished (for your student's knowlegde)")

        await formProp.appendChild(dccSubmitProp)

        inputPropertyValue.value = '1'
      }

      this.feedbackButtonCaseState()

      if(new URL(document.location).searchParams.get('fdbk')){
        setTimeout(function(){
          document.querySelector('#button-comments-nav').click()
          MessageBus.ext.publish('control/properties/expand')
          MessageBus.ext.publish('control/comments/expand')
          MessageBus.int.publish('control/comments/editor')
        }, 500)
      }

    }

  }

  async dynamicMenu (){

    if(LayoutController.user.message.institution === 'hcpa' && document.querySelector('#home-btn-container')){
      const btnContainer = document.querySelector('#home-btn-container')
      const btnFeedback = document.createElement('template')
      btnFeedback.innerHTML =
        `<a id="home-btn-feedback" href="/author/drafts/feedback?clearance=4&prop=feedback" class="d-flex flex-column align-items-center
         justify-content-center home-author-box-content home-author-case-box" style="height:50%; font-size: 30px;">
          Feedbacks
          <div class="home-author-sub-text">
            Feedback case list.
          </div>
        </a>`
        if(!document.querySelector('#home-btn-feedback')){
          btnContainer.appendChild(btnFeedback.content.cloneNode(true))
        }
    }
  }

  async dynamicCaseListFeedback (){
    // console.log('============ starting dynamic list')
    if(LayoutController.user.message.grade === 'professor'
    || LayoutController.user.message.grade === 'coordinator'){
      document.querySelector('#txt-draft-presentation').innerHTML = 'Students cases with feedback request'
      //Selects all divs that start the attribute 'id' with 'e'
      const caseButtons = document.querySelectorAll('div.author-panel-button[id^="e"]')

      for (let d in caseButtons){

        if(caseButtons[d].nodeName === 'DIV'){

          caseButtons[d].innerHTML = 'EDIT FEEDBACK'
        }

      }
    }
  }

  async feedbackButtonCaseState (propValue){
    const userGrade = LayoutController.user.message.grade
    const btnFeedback = document.querySelector('#dcc-submit-feedback')
    if(propValue){
      LayoutController.case.message.property.feedback = propValue
    }
    if(userGrade === 'aluno'){

      //Verifies property 'feedback' to disable button and change layout
      if(LayoutController.case.message.property.feedback){
        if(LayoutController.case.message.property.feedback == 0){

          btnFeedback.firstElementChild.innerHTML = 'Sent'
        }else {
          btnFeedback.firstElementChild.innerHTML = 'Recieved'
        }

        btnFeedback.firstElementChild.classList.add('disabled')
        btnFeedback.style.pointerEvents = 'none'
        document.querySelector('#dcc-submit-feedback').removeAttribute('topic')
        document.querySelector('#dcc-submit-feedback').removeAttribute('connect')
        try {
          document.querySelector('#property_value').remove()
          document.querySelector('#property_title').remove()
          document.querySelector('#harena-case-property').remove()
          document.querySelector('#harena-ask-feedback').remove()
        } catch (e) {
          console.log(e)
        }
      }
      btnFeedback.addEventListener("click", function(event) {
          btnFeedback.firstElementChild.innerHTML = 'Sent'
          btnFeedback.firstElementChild.classList.add('disabled')
          btnFeedback.style.pointerEvents = 'none'
          document.querySelector('#dcc-submit-feedback').removeAttribute('topic')
          document.querySelector('#dcc-submit-feedback').removeAttribute('connect')
          document.querySelector('#harena-case-property').remove()
          document.querySelector('#harena-ask-feedback').remove()
      })

    }else if(userGrade === 'professor' || userGrade === 'coordinator'){
      if(document.querySelector('#harena-ask-feedback'))
        document.querySelector('#harena-ask-feedback').remove()

      let casePropertyRest = document.querySelector('#harena-case-property')
      let caseDccSubmit = document.querySelector('#dcc-submit-feedback')

      if(LayoutController.case.message.property.feedback){
        btnFeedback.firstElementChild.innerHTML = 'Notify as Complete'

        if(LayoutController.case.message.property.feedback == 1){
          casePropertyRest.remove()
          btnFeedback.firstElementChild.innerHTML = 'Notified as Complete'
          btnFeedback.firstElementChild.classList.add('disabled')
          btnFeedback.style.pointerEvents = 'none'
          caseDccSubmit.removeAttribute('topic')
          caseDccSubmit.removeAttribute('connect')
          try {
            document.querySelector('#property_value').remove()
            document.querySelector('#property_title').remove()
          } catch (e) {
            console.log(e)
          }

        }
        btnFeedback.addEventListener("click", function(event) {
            btnFeedback.firstElementChild.innerHTML = 'Notified as Complete'
          })
      }
    }
  }

}
(function () {
  LayoutController.instance = new LayoutController()

})()
