

(function () {

DCC.component(
  'xkcd',
  'dcc-rest',
  {
    paths: {
      'http://xkcd.com/{comic_id}/info.0.json': {
        'get': {
          operationId: 'info'
        }
      }
    }
  }
)

DCC.component(
  'coronavirus',
  'dcc-rest',
  {
    paths: {
      'https://api.quarantine.country/api/v1/spots/year?region={region}': {
        'get': {
          operationId: 'latest'
        }
      }
    }
  }
)

DCC.component(
  'harena-login',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/auth/login': {
          'post': {
            operationId: 'login',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'email',
               in: 'query'},
              {name: 'password',
               in: 'query'},
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-logout',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/auth/logout': {
          'post': {
            operationId: 'logout',
            parameters: [
              {name: 'url-manager',
               in: 'path'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-roles',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        '{url-manager}/admin/roles': {
          'get': {
            operationId: 'roles',
            parameters: [
              {name: 'url-manager',
               in: 'path'}
            ]
          }
        }
      }
    }
  }
)

DCC.component(
  'harena-cases',
  'dcc-rest',
  {
    environment: {
      'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
    },
    oas: {
      paths: {
        'http://localhost:10020/api/v1/author/quest/cases?questId={questId}': {
          'get': {
            operationId: 'cases',
            parameters: [
              {name: 'url-manager',
               in: 'path'},
              {name: 'questId',
               in: 'path'}
            ]
          }
        }
      }
    }
  }
)

})()