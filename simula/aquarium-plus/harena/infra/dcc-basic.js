(function () {
  DCC.component(
    'submit-login',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        if (form.checkValidity() === false) {
          for ( i = 0; i < form.elements.length; i++){
            if(form[i].required && form[i].validity.valid){
              form[i].classList.add('is-valid')
              form[i].classList.remove('is-invalid')
            }else{
              form[i].classList.add('is-invalid')
              form[i].classList.remove('is-valid')
            }
          }
          // console.log('form invalid')
          return false
        }
        // console.log('form valid')
        for ( i = 0; i < form.elements.length; i++){
            // form[i].classList.add('is-valid')
            form[i].classList.remove('is-invalid')
        }
        // form.classList.add('was-validated')
        return true

      },
      pos: function (response) {
        // console.log(response['harena-login']['response'])
        if(response['harena-login']['response'] === 'Login successful'){
          // console.log('login successful');
          if(document.querySelector('#login-message-alert')){
            document.querySelector('#btn-submit-login').firstElementChild.innerHTML = 'Logging...'
            document.querySelector('#login-message-alert').innerHTML = response['harena-login']['response']
            document.querySelector('#login-message-alert').classList.add('alert-success')
            document.querySelector('#login-message-alert').classList.remove('alert-danger')

          }

           setTimeout(function(){
             window.location.href = '/'
           }, 2000)
        }else if (response['harena-login']['response'] === 'Email or password incorrect'){
          // console.log('login failed, password or email incorrect');
          if(document.querySelector('#login-message-alert')){
            document.querySelector('#login-message-alert').innerHTML = response['harena-login']['response']
            document.querySelector('#login-message-alert').classList.add('alert-danger')
            document.querySelector('#login-message-alert').classList.remove('alert-success')

            document.querySelector('#email').classList.add('is-invalid')
            document.querySelector('#password').classList.add('is-invalid')

          }
        }
      }
    }
  )
  DCC.component(
    'submit-logout',
    'dcc-submit',
    {
      pos: function (response) {
        // console.log(response)
        window.location.href = '/'
      }
    }
  )

  DCC.component(
    'submit-change-password',
    'dcc-submit',
    {
      pos: async function (response) {
        // console.log(response['harena-change-password'])
        const responseContainer = document.querySelector('#updatePasswordResponse')
        responseContainer.innerHTML = response['harena-change-password']
        if(response['harena-change-password'] === 'Password changed successfully.'){
          // console.log('if')
          responseContainer.classList.remove('text-danger')
          responseContainer.classList.add('text-success')
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(window.location.href = '/'), 1000)
          })
        }else {
          // console.log('else')
          responseContainer.classList.remove('text-success')
          responseContainer.classList.add('text-danger')
        }
      }
    }
  )

  DCC.component(
    'submit-case-property',
    'dcc-submit',
    {
      pos: async function (response) {
        // console.log('============ pos dcc-submit prop')
        // console.log(response)
        let propValue = null
        if(response['harena-case-property']['case_property']){
          propValue = response['harena-case-property']['case_property']['value']
        }else{
          propValue = response['harena-case-property']['value']
        }
        LayoutController.instance.feedbackButtonCaseState(propValue)
      }
    }
  )

  DCC.component(
    'submit-filter',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        // console.log('============ pre submit-filter')
        // console.log(message['value'])
        // console.log('============ form')
        // console.log(form)
        var url = new URL(document.location)
        for(_info in message['value']){
            url.searchParams.set(_info,message['value'][_info])
        }
        document.location = url
        return true

      },
      pos: function (response) {

      }
    }
  )

  DCC.component(
    'submit-share',
    'dcc-submit',
    {
      pre: function (message, form, schema) {
        $('#notice-modal').modal('show')
        var txt = document.querySelector('#modal-notice-txt')
        var modalBody = document.querySelector('#modal-notice-body')

        txt.innerHTML = 'Sharing cases...'

        modalBody.classList.remove('bg-danger')
        modalBody.classList.remove('bg-success')
        txt.classList.remove('text-white')
        modalBody.classList.add('bg-white')
        txt.classList.add('text-secondary')

        return true
      },
      pos: async function (response) {

        // console.log(response['harena-share-cases'].message)
        var txt = document.querySelector('#modal-notice-txt')
        var modalBody = document.querySelector('#modal-notice-body')

        txt.innerHTML = response['harena-share-cases'].message
        if(response['harena-share-cases'].message.includes('Error')){
          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')
        }else if(response['harena-share-cases'].message.includes("Cannot read property 'split'")){
          txt.innerHTML = 'Error. Please select at least one case to share.'

          modalBody.classList.remove('bg-success')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-danger')
          txt.classList.add('text-white')
        }else{
          modalBody.classList.remove('bg-danger')
          modalBody.classList.remove('bg-white')
          txt.classList.remove('text-secondary')
          modalBody.classList.add('bg-success')
          txt.classList.add('text-white')
        }

        setTimeout(function(){
          $('#notice-modal').modal('hide')
        }, 7000)

      }
    }
  )
})()
