/**
 * Bus
 */

class MessageBus {
  constructor (externalized) {
    this._externalized = externalized
    this._listeners = []
    this._providers = {}
    this._connections = {}
  }

  get externalized () {
    return this._externalized
  }

  set externalized (newValue) {
    this._externalized = newValue
  }

  // <TODO> provisory
  defineRunningCase (runningCase) {
    this._runningCase = runningCase
  }

  subscribe (topic, callback) {
    const status = true

    // Topic Filter: transform wildcards in regular expressions
    if (topic.indexOf('+') > -1 || topic.indexOf('#') > -1) {
      const reTopic = MessageBus._convertRegExp(topic)
      this._listeners.push({
        topic: topic,
        regexp: reTopic,
        callback: callback
      })
    } else {
      this._listeners.push({
        topic: topic,
        callback: callback
      })
    }

    return status
  }

  unsubscribe (topic, callback) {
    let found = false
    for (let l = 0; l < this._listeners.length && !found; l++) {
      if (this._listeners[l].topic == topic &&
             this._listeners[l].callback == callback) {
        this._listeners.splice(l, 1)
        found = true
      }
    }
  }

  async publish (topic, message) {
    for (const l in this._listeners) {
      if (this.matchTopic(l, topic)) { this._listeners[l].callback(topic, message) }
    }

    if (this._externalized) {
      if (DCCCommonServer.loggerAddressAPI) {
        const currentDateTime = new Date()
        let extMessage = {
          localTime: currentDateTime.toJSON()
        }
        if (message != null) extMessage.content = message
        // let extMessage = (message != null) ? message : {}
        // if (typeof message !== 'object') { extMessage = { content: message } }
        let extTopic = topic
        if (this._runningCase != null) {
          extMessage.track = {
            userid: this._runningCase.track.userid,
            caseid: this._runningCase.track.caseid
          }
          extTopic = this._runningCase.runningId + '/' + topic
        }

        // const response = await fetch('https://harena.ds4h.org/logger/api/v1/message', {
        const response = await fetch(DCCCommonServer.loggerAddressAPI + 'message', {
          method: 'POST',
          body: JSON.stringify({
            'harena-log-stream-version': '1',
            'harena-log-stream': [
              {
                topic: extTopic,
                payload: extMessage
              }]
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const status = await response.json()
      }

      parent.postMessage({ topic: topic, message: message }, '*')
    }
  }

  /* Checks if this topic has a subscriber */
  hasSubscriber (topic) {
    let hasSub = false
    for (let l = 0; !hasSub && l < this._listeners.length; l++) { hasSub = this.matchTopic(l, topic) }
    return hasSub
  }

  matchTopic (index, topic) {
    let matched = false
    if (this._listeners[index].regexp) {
      const matchStr = this._listeners[index].regexp.exec(topic)
      if (matchStr != null && matchStr[0] === topic) { matched = true }
    } else if (this._listeners[index].topic === topic) { matched = true }
    return matched
  }

  async request (requestTopic, requestMessage, responseTopic) {
    let rt
    let rm = (requestMessage != null) ? requestMessage : null
    if (responseTopic) { rt = responseTopic } else {
      if (rm == null) { rm = {} } else if (typeof rm !== 'object') { rm = { body: rm } }
      rm.responseStamp = MessageBus._stamp
      rt = requestTopic + '/response/' + MessageBus._stamp
      MessageBus._stamp++
    }

    const promise = new Promise((resolve, reject) => {
      const callback = function (topic, message) {
        resolve({ topic: topic, message: message, callback: callback })
      }
      this.subscribe(rt, callback)
      this.publish(requestTopic, rm)
    })

    const returnMessage = await promise
    this.unsubscribe(rt, returnMessage.callback)

    return {
      topic: returnMessage.topic,
      message: returnMessage.message
    }
  }

  async waitMessage (topic) {
    const promise = new Promise((resolve, reject) => {
      const callback = function (topic, message) {
        resolve({ topic: topic, message: message, callback: callback })
      }
      this.subscribe(topic, callback)
    })

    const returnMessage = await promise
    this.unsubscribe(topic, returnMessage.callback)

    return {
      topic: returnMessage.topic,
      message: returnMessage.message
    }
  }

  /* Connection-oriented communication
   ***********************************/

  /*
   * Components declare provided services. Each topic defines a service.
   *   id: unique id of the component that offers the service
   *   topic: topic related to the provided service
   *   service: the component method that implements the service
   */
  provides (id, topic, service) {
    let status = true
    const key = id + ':' + topic
    if (this._providers[key])
      status = false
    else {
      this._providers[key] = service
      if (this._connections[key] != null) {
        for (let c of this._connections[key])
          c.connectionReady(id, topic)
        delete this._connections[key]
      }
    }
  }

  /*
   * Connects a component to another one based on the id and a topic (service).
   *   id: id of the component that offers the service
   *   topic: topic related to the provided service
   *   callback: instance that will be notified as soon as the service is
   *             connected
   */
  connect (id, topic, callback) {
    // console.log('=== connect')
    // console.log(id)
    // console.log(topic)
    const key = id + ':' + topic
    // console.log(key)
    // console.log(this._providers[key])
    if (this._providers[key])
      callback.connectionReady(id, topic)
    else
      if (this._connections[key])
        this._connections[key].push(callback)
      else
        this._connections[key] = [callback]
  }

  /*
   * Triggers a service defined by an id and topic, sending an optional
   * message to it.
   */
  async requestC (id, topic, message) {
    let response = null
    const key = id + ':' + topic
    if (this._providers[key] != null)
      response = await this._providers[key](topic, message)
    return response
  }

  /*
   connect(callback) {
      const connection = MessageBus._connection;
      this.subscribe("connection/" + connection, callback);
      MessageBus._connection++;
      return connection;
   }

   disconnect(connection, callback) {
      this.unsubscribe("connection/" + connection, callback);
   }

   send(connection, message) {
      this.publish("connection/" + connection, message);
   }
   */

  /* Message analysis services
     *************************/

  static _convertRegExp (filter) {
    return new RegExp(filter.replace(/\//g, '\\/')
      .replace(/\+/g, '[^\/]+') // "[\\w -\.\*<>]+"
      .replace(/#/g, '.+')) // "[\\w\\/ -\.\*<>]+"
  }

  static matchFilter (topic, filter) {
    let match = false
    const regExp = MessageBus._convertRegExp(filter)
    const matched = regExp.exec(topic)
    if (matched != null && matched[0] === topic) { match = true }
    return match
  }

  /*
    * Returns the label at a specific level of the message.
    */
  static extractLevel (topic, level) {
    // console.log('============ topic')
    // console.log(topic)
    // console.log('============ level')
    // console.log(level)
    let label = null
    if (topic != null) {
      const levelSet = topic.split('/')
      if (level <= levelSet.length) { label = levelSet[level - 1] }
    }
    return label
  }

  /* Message building services
      *************************/
  static buildResponseTopic (topic, message) {
    return topic + '/response/' + message.responseStamp
  }
}

(function () {
  MessageBus._stamp = 1
  MessageBus._connection = 1

  MessageBus.int = new MessageBus(false)
  MessageBus.ext = new MessageBus(true)
  MessageBus.page = new MessageBus(false)
})()
