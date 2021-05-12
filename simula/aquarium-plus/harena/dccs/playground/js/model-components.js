

(function () {

DCC.component(
  'xkcd',
  'dcc-model',
  {
    schema: {
      comic_id: 'number',
      month: 'string',
      num: 'number',
      link: 'string',
      year: 'string',
      news: 'string',
      safe_title: 'string',
      alt: 'string',
      img: 'string',
      title: 'string',
      day: 'string'
    }
  }
)

DCC.component(
  'coronavirus',
  'dcc-model',
  {
    schema: {
      'region': 'string',
      'total_cases': 'number',
      'deaths': 'number',
      'recovered': 'number',
      'critical': 'number',
      'tested': 'number',
      'death_ratio': 'number',
      'recovery_ratio': 'number'
    }
  }
)

DCC.component(
  'user',
  'dcc-model',
  {
    schema: {
      'email': 'string',
      'password': 'string'
    }
  }
)

})()