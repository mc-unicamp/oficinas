/**
 * 
 */

class Tracker {
   constructor() {
      // this._server = server;
      this._variables = {};
      this._groupInput = null;
      
      this.inputReady = this.inputReady.bind(this);
      MessageBus.ext.subscribe("var/+/input/ready", this.inputReady);
      this.groupinputReady = this.groupinputReady.bind(this);
      MessageBus.ext.subscribe("var/+/group_input/ready", this.groupinputReady);
      this.subinputReady = this.subinputReady.bind(this);
      MessageBus.ext.subscribe("var/+/subinput/ready", this.subinputReady);
      this.inputTyped = this.inputTyped.bind(this);
      MessageBus.ext.subscribe("var/+/typed", this.inputTyped);
      this.inputChanged = this.inputChanged.bind(this);
      MessageBus.ext.subscribe("var/+/changed", this.inputChanged);
      this.stateChanged = this.stateChanged.bind(this);
      MessageBus.ext.subscribe("var/+/state_changed", this.stateChanged);
      
      this.submitVariables = this.submitVariables.bind(this);
      MessageBus.ext.subscribe("control/input/submit", this.submitVariables);
   }
   
   inputReady(topic, message) {
      this._updateVariable(topic, "");
      // console.log("input: " + message.value);
   }
   
   groupinputReady(topic, message) {
      this._updateVariable(topic, {});
      this._groupInput = MessageBus.extractLevel(topic, 2);
      // console.log("input: " + message.context);
   }
   
   subinputReady(topic, message) {
      // console.log("variables");
      // console.log(this._variables);

      if (this._groupInput != null) {
         const id = MessageBus.extractLevel(topic, 2);
         this._variables[this._groupInput][id] =
            {content: message.content, state: " "};
      }
   }
   
   inputTyped(topic, message) {
      this._updateVariable(topic, message.value);
      // console.log("input: " + message.value);
   }
   
   inputChanged(topic, message) {
      this._updateVariable(topic, message.value);
      // console.log("input: " + message.value);
   }
   
   stateChanged(topic, message) {
      if (this._groupInput != null) {
         const id = MessageBus.extractLevel(topic, 2);
         this._variables[this._groupInput][id].state = message.state;
      }
      
      // console.log("variables");
      // console.log(this._variables);
   }
   
   submitVariables(topic, message) {
      for (let v in this._variables)
         MessageBus.ext.publish("var/" + v + "/set", this._variables[v]);
      // console.log("variavel: " + v + " -- " + this._variables[v]);
      // this._server.recordInput(v, this._variables[v]);
   }
   
   _updateVariable(topic, value) {
      let v = MessageBus.extractLevel(topic, 2); 
       //  /^\/var\/(\w+)\//.exec(topic);
      if (v != null) {
         this._variables[v] = value;
         // console.log("update variable " + v + " with " + value);
      }
   }
}