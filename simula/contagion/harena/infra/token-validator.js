class TokenController {
  constructor () {

    this._tokenChecked = false
    this.checkToken = this.checkToken.bind(this)
    MessageBus.int.subscribe('control/button/logout-button/ready', this.checkToken)
    if (window.location.pathname !== '/') {
      this.redirectUnlogged()
    }
  }

  set tokenChecked (newValue) {
    this._tokenChecked = newValue
  }

  get tokenChecked () {
    return this._tokenChecked
  }

  async checkToken () {
    if (document.getElementById('harena-header')) {

      if (!TokenController.instance.tokenChecked) {
        const config = {
          method: 'GET',
          url: DCCCommonServer.managerAddressAPI + 'auth/check',
          withCredentials: true
        }

        await axios(config)
          .then(function (endpointResponse) {
            sessionStorage.setItem('harena-user-grade', endpointResponse.data.grade)
            sessionStorage.setItem('harena-user-institution', endpointResponse.data.institution)
            sessionStorage.setItem('harena-user-institution-id', endpointResponse.data.institutionId)
            // localStorage.setItem('harena-user-grade', endpointResponse.data.grade)
            // localStorage.setItem('harena-user-institution', endpointResponse.data.institution)
            // localStorage.setItem('harena-user-institution-id', endpointResponse.data.institutionId)
            MessageBus.int.publish('data/user/info', endpointResponse.data)
            TokenController.instance.changeHeaderButtons(endpointResponse.data)
          })
          .catch(function (error) {
            console.log('=== check token error')
            console.log(error)
          })
      }
    }
  }

  async changeHeaderButtons(response){

      if (document.readyState === 'complete' && document.querySelector('#logout-block')) {

        try {
          const elemLogin = document.querySelector('#login-block')
          const elemLogout = document.querySelector('#logout-block')

          if(response.token === 'token valid'){
            // console.log(response.token)
            elemLogin.style.display = 'none'
            elemLogout.style.display = 'block'
            document.querySelector('#logoutDropdownBtn').innerHTML = response.username
          }else{
            // console.log(response.token)
            elemLogin.style.display = 'block'
            elemLogout.style.display = 'none'
          }
        } catch (e) {
          // console.log(e)
        }
        MessageBus.ext.publish('control/validate/ready')
      }else{
        setTimeout(function(){
          TokenController.instance.changeHeaderButtons(response)
        }, 200)
        /* window.addEventListener("load", function(event) {
        //   try {
        //     const elemLogin = document.querySelector('#login-block')
        //     const elemLogout = document.querySelector('#logout-block')
        //
        //     if(response.token === 'token valid'){
        //       // console.log(response.token)
        //       elemLogin.style.display = 'none'
        //       elemLogout.style.display = 'block'
        //       document.querySelector('#logoutDropdownBtn').innerHTML = response.username
        //     }else{
        //       // console.log(response.token)
        //       elemLogin.style.display = 'block'
        //       elemLogout.style.display = 'none'
        //     }
        //   } catch (e) {
        //     // console.log(e)
        //   }
        //   console.log('============')
        //   MessageBus.ext.publish('control/validate/ready')
      });*/
      }
  }

  async redirectUnlogged () {
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'auth/check',
      withCredentials: true
    }
    await axios(config)
      .then(function (endpointResponse) {
        if(endpointResponse.data.token === 'token valid'){
          TokenController.instance.tokenChecked = true
          sessionStorage.setItem('harena-user-grade', endpointResponse.data.grade)
          sessionStorage.setItem('harena-user-institution', endpointResponse.data.institution)
          sessionStorage.setItem('harena-user-institution-id', endpointResponse.data.institutionId)
          // localStorage.setItem('harena-user-grade', endpointResponse.data.grade)
          // localStorage.setItem('harena-user-institution', endpointResponse.data.institution)
          // localStorage.setItem('harena-user-institution-id', endpointResponse.data.institutionId)
          MessageBus.int.publish('data/user/info', endpointResponse.data)

          TokenController.instance.changeHeaderButtons(endpointResponse.data)
        } else{
          window.location.href = '/user'
        }
      })
      .catch(function (error) {
        console.log('=== check redirect error')
        console.log(error)
      })
  }
}
(function () {
  TokenController.instance = new TokenController()
})()
