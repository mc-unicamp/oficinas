/**
 *
 */

class DCCCommonServer {
  constructor () {
    // this._local = false

    /*
      console.log("=== token");
      this._token = null;
      if (document.cookie.includes("token="))
         this._token = document.cookie
                          .split("; ")
                          .find(row => row.startsWith("token="))
                          .split("=")[1];
      console.log(this._token);
      */

    // this.userLogin = this.userLogin.bind(this);
    // MessageBus.ext.subscribe("data/user/login", this.userLogin);
    this.casesList = this.casesList.bind(this)
    MessageBus.ext.subscribe('data/case/*/list', this.casesList)
    this.loadCase = this.loadCase.bind(this)
    MessageBus.ext.subscribe('data/case/+/get', this.loadCase)
    this.loadTheme = this.loadTheme.bind(this)
    this.themeFamilySettings = this.themeFamilySettings.bind(this)
    MessageBus.int.subscribe('data/theme_family/+/settings',
      this.themeFamilySettings)
    MessageBus.ext.subscribe('data/theme/+/get', this.loadTheme)
    this.contextList = this.contextList.bind(this)
    MessageBus.int.subscribe('data/context/*/list', this.contextList)
    this.loadContext = this.loadContext.bind(this)
    MessageBus.int.subscribe('data/context/+/get', this.loadContext)
  }

  /*
   get token() {
      return this._token;
   }

   set token(newToken) {
      this._token = newToken;
   }
   */

  /*
  get local () {
    return this._local
  }

  set local (newValue) {
    this._local = newValue
  }
  */

  /*
    * Wrappers of the services
    * ************************
    */

  /*
   async userLogin(topic, message) {
      let header = {
         "async": true,
         "crossDomain": true,
         "method": "POST",
         "headers": {
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({"email": message.email,
                                  "password": message.password})
      }

      console.log("=== login request");
      console.log(DCCCommonServer.managerAddressAPI + "user/login");
      console.log(header);

      const response = await fetch(
         DCCCommonServer.managerAddressAPI + "user/login", header);

      console.log("=== login response");
      console.log(response);

      const jsonResponse = await response.json();
      console.log(jsonResponse);
      const busResponse = {
         userid: jsonResponse.id,
         token: jsonResponse.token
      };
      this._token = jsonResponse.token;
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             busResponse);
   }
   */

  async casesList (topic, message) {
    const clearance = new URL(document.location).searchParams.get('clearance')
    const config = {
      method: 'GET',
      url: DCCCommonServer.managerAddressAPI + 'user/cases?clearance=' + clearance,
      withCredentials: true
    }
    /*
      if (message.filterBy) {
         header.body = JSON.stringify({
            filterBy: message.filterBy,
            filter: message.filter
         });
      }
      const response = await fetch(
         DCCCommonServer.managerAddressAPI + "case/list", header);
      */
    // console.log(DCCCommonServer.managerAddressAPI);
    /*
      const response = await fetch(
         DCCCommonServer.managerAddressAPI +
         ((message.user) ? "user/cases" : "cases"), header);
      */
    let jsonResponse
    await axios(config)
      .then(function (endpointResponse) {
        jsonResponse = endpointResponse.data.cases
      })
      .catch(function (error) {
        console.log(error)
        console.log(error.code)
      })
    const busResponse = []
    for (const c in jsonResponse.cases) {
      busResponse.push({
        id: jsonResponse.cases[c].id,
        title: jsonResponse.cases[c].title
        // icon: Basic.service.rootPath + 'resources/icons/mono-slide.svg'
      // svg : jsonResponse[c].svg
      })
      busResponse.push({pages: jsonResponse.pages})
    }
    busResponse.sort(function (c1, c2) {
      return (c1.title < c2.title) ? -1 : 1
    })
    MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
      busResponse)
  }

  async loadCase (topic, message) {
    let caseComplete

    if (HarenaConfig.local) {
      this._caseScript = document.createElement('script')
      this._caseScript.src = Basic.service.rootPath + 'cases/current-case.js'
      document.head.appendChild(this._caseScript)
      // <TODO> adjust topic
      const caseM = await MessageBus.int.waitMessage('control/case/load/ready')
      caseComplete = caseM.message
    } else {
      // <TODO> the topic service/request/get is extremely fragile -- refactor
      const caseId = MessageBus.extractLevel(topic, 3)
      const caseObj = await MessageBus.ext.request(
        'service/request/get', {caseId: caseId})

      caseComplete = caseObj.message
      const template =
        caseComplete.source.
          match(/^___ Template ___[\n]*\*[ \t]+template[ \t]*:[ \t]*(.+)$/im)
      if (template != null && template[1] != null) {
        const templateMd =
          await MessageBus.ext.request(
            'data/template/' + template[1].replace(/\//g, '.') +
              '/get', {static: true})
        caseComplete.source += templateMd.message
      }
      /*
      const caseId = MessageBus.extractLevel(topic, 3)
      if (document.querySelector('#settings-modal') == null) {

        const header = {
          async: true,
          crossDomain: true,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + DCCCommonServer.token
          }
        }

        const response =
            await fetch(DCCCommonServer.managerAddressAPI + 'case/' + caseId,
              header)

        const jsonResponse = await response.json()

        caseObj = {
          title: jsonResponse.title,
          description: jsonResponse.description,
          language: jsonResponse.language,
          domain: jsonResponse.domain,
          specialty: jsonResponse.specialty,
          keywords: jsonResponse.keywords,
          source: jsonResponse.source
        }
      } else {
        caseObj = {
          title: document.getElementById('case_title').value,
          description: document.getElementById('description').value,
          language: document.getElementById('language').value,
          domain: document.getElementById('domain').value,
          specialty: document.getElementById('specialty').value,
          keywords: document.getElementById('keywords').value,
          source: document.getElementById('case_source').value
            .replace(/\\"/gm, '"')
        }
      }
      */
    }

    // console.log('====================Case object');
    // console.log(caseObj);

    // console.log('=== case complete')
    // console.log(caseComplete)
    MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                           caseComplete)
  }

  async themeFamilySettings (topic, message) {
    let settings = {}
    if (!HarenaConfig.local) {
      const themeFamily = MessageBus.extractLevel(topic, 3)
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'text/json'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'themes/' +
                                      themeFamily + '/theme.json', header)
      settings = await response.json()
    }
    MessageBus.int.publish(MessageBus.buildResponseTopic(topic, message),
      settings)
  }

  async loadTheme (topic, message) {
    let themeObj
    const themeCompleteName = MessageBus.extractLevel(topic, 3)
    const separator = themeCompleteName.indexOf('.')
    const themeFamily = themeCompleteName.substring(0, separator)
    const themeName = themeCompleteName.substring(separator + 1)
    let caseObj
    if (HarenaConfig.local) {
      this._themeScript = document.createElement('script')
      this._themeScript.src = Basic.service.rootPath + 'themes/' +
                                 themeFamily + '/local/' + themeName + '.js'
      document.head.appendChild(this._themeScript)
      // <TODO> adjust topic
      const themeM = await MessageBus.int.waitMessage('control/theme/' +
                                                         themeName +
                                                         '/load/ready')
      themeObj = themeM.message
    } else {
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'text/html'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'themes/' +
                                      themeFamily + '/' + themeName +
                                      '.html', header)
      themeObj = await response.text()
    }
    MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
      themeObj)
  }

  async contextList (topic, message) {
    let ctxCatalog = {}
    if (!HarenaConfig.local) {
      const header = {
        async: true,
        crossDomain: true,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(Basic.service.rootPath + 'context/context.json',
        header)
      ctxCatalog = await response.json()
    }
    MessageBus.int.publish(MessageBus.buildResponseTopic(topic, message),
      ctxCatalog)
  }

  async loadContext (topic, message) {
    const header = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-Type': 'text/json'
      }
    }
    const response = await fetch(Basic.service.rootPath + 'context/' +
                                   message.body, header)
    const textResponse = await response.text()
    MessageBus.int.publish(MessageBus.buildResponseTopic(topic, message),
      textResponse)
  }
}

(function () {
  DCCCommonServer.instance = new DCCCommonServer()
})()
