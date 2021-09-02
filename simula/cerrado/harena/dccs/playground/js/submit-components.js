(function () {

DCC.component(
  'submit-login',
  'dcc-submit',
  {
    pre: function (message, form, schema) {
      let check = true
      if (message.value.email.length == 0)
        check = false
      console.log('Campo vazio')
      return check
    },
    pos: function(response) {
      console.log('=== after processing')
      console.log(response)
    }
  }
)

DCC.component(
  'submit-logout',
  'dcc-submit',
  {
    pos: function(response) {
      console.log('=== after processing')
      console.log(response)
    }
  }
)

})()