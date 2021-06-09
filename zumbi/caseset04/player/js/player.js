const storePrefix = "casenote_";

class PlayerManager {
   /*
   static instance() {
      if (!PlayerManager._instance)
         PlayerManager._instance = new PlayerManager();
      return PlayerManager._instance;
   }
   */
   
   constructor() {
      Basic.service.host = this;

      this._server = new DCCPlayerServer();
      this._tracker = new Tracker();
      // this._history = [];
      this._state = new PlayState();

      // this._currentThemeCSS = null;
      // this.currentThemeFamily = "minimal";
      
      this.controlEvent = this.controlEvent.bind(this);
      MessageBus.ext.subscribe("control/#", this.controlEvent);
      this.navigateEvent = this.navigateEvent.bind(this);
      MessageBus.ext.subscribe("knot/+/navigate", this.navigateEvent);
      
      // <TODO> temporary
      this.produceReport = this.produceReport.bind(this);
      MessageBus.int.subscribe("/report/get", this.produceReport);
      
      this.caseCompleted = this.caseCompleted.bind(this);
      MessageBus.ext.subscribe("case/completed", this.caseCompleted);

      /*
      this.inputEvent = this.inputEvent.bind(this);
      MessageBus.ext.subscribe("input/#", this.inputEvent);
      */
      
      // tracking
      this.trackTyping = this.trackTyping.bind(this);

      // <TODO> provisory
      // this._nextKnot = 1;
   }

   /* <TODO>
      A commom code for shared functionalities between player and author
      ******/

   /*
   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;

      this._currentThemeCSS =
         Basic.service.replaceStyle(document, this._currentThemeCSS, newValue);
   }

   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }

   get currentCaseId() {
      return this._currentCaseId;
   }
   */

   /*
    * Event handlers
    * **************
    */
   
   controlEvent(topic, message) {
      switch (topic) {
         case "control/register": this.register(); break;
         case "control/signin":   this.signIn(); break;
         /*
         case "control/_current_theme_name/get" :
             this.requestCurrentThemeFamily(topic, message);
             break;
         */
      }
   }
   
   navigateEvent(topic, message) {
      let target = MessageBus.extractLevel(topic, 2);
      /*     
      if (message)
         target = (typeof message === "string") ? message : message.target;
      */
      this.trackTrigger(target);

      // MessageBus.ext.publish("checkout", message);
      if (this._currentKnot != null) {
         MessageBus.ext.publish("control/input/submit"); // <TODO> provisory
         MessageBus.ext.publish("knot/" + this._currentKnot + "/end");
      }
      switch (topic) {
         case "knot/</navigate": if (this._state.historyHasPrevious())
                                    this.knotLoad(this._state.historyPrevious());
                                 break;
         case "knot/<</navigate": this.startCase();
                                  console.log("=== start");
                                  console.log(DCCPlayerServer.localEnv);
                                  // console.log(DCCPlayerServer.playerObj.start);
                                  console.log(this._compiledCase);
                                  const startKnot = (DCCPlayerServer.localEnv)
                                     ? DCCPlayerServer.playerObj.start
                                     : this._compiledCase.start;
                                  this._state.historyRecord(startKnot);
                                  this.knotLoad(startKnot);
                                  break;
         case "knot/>/navigate": const nextKnot = this._state.nextKnot();
                                 this._state.historyRecord(nextKnot);
                                 this.knotLoad(nextKnot);
                                 break;
         case "knot/>>>/navigate": window.open(message.value, "_self");
                                   break;
         default: if (MessageBus.matchFilter(topic, "knot/+/navigate")) {
                     this._state.historyRecord(target);
                     // this._history.push(target);
                     if (message.value) {
                        this._state.parameter = message.value;
                        this.knotLoad(target, message.value);
                     } else {
                        this._state.parameter = null;
                        this.knotLoad(target);
                     }
                  }
                  break;
      }
      /*
      switch (topic) {
         case "navigate/knot/previous": window.history.back();
                                        break;
         case "navigate/knot/start": window.open(this._server.getStartKnot().
                                       replace(/ /igm, "_") + ".html", "_self");
                                     break;
         case "navigate/trigger": window.open(message, "_self");
                                  break;
      }
      */
   }

   /*
   inputEvent(topic, message) {
      this._server.recordInput(topic.substring(6), message);
   } 
   */  
   
   async startPlayer(caseid) {
      this._mainPanel = document.querySelector("#main-panel");

      let precase = window.location.search.substr(1);
      if (precase != null && precase.length > 0) {
         const pm = precase.match(/case=([\w-]+)/i);
         precase = (pm == null) ? null : pm[1];
      } else
         precase = null;

      let resume = false;
      if (this._state.pendingPlayCheck()) {
         // <TODO> adjust for name: (precase == null || this._state.pendingPlayId() == precase)) {
         const decision = await DCCNoticeInput.displayNotice(
            "You have an unfinished case. Do you want to continue?",
            "message", "Yes", "No");
         if (decision == "Yes") {
            resume = true;
            this._state.pendingPlayRestore();
            DCCCommonServer.instance.token = this._state.token;
            console.log("=== state");
            console.log(this._state);
            console.log(this._state.currentCase);
            await this._caseLoad(this._state.currentCase);
            const current = this._state.historyCurrent();
            if (this._state.parameter == null)
               this.knotLoad(current);
            else
               this.knotLoad(current, this._state.parameter);
         }
      }

      if (!resume) {
         if (DCCCommonServer.instance.local)
            await this._caseLoad();
         else {
           this._userid = await Basic.service.signin(this._state);

           if (DCCPlayerServer.localEnv)
              Basic.service.currentCaseId = DCCPlayerServer.playerObj.id;
           else {
              const casesM = await MessageBus.ext.request(
                    "data/case/*/list",
                    {filterBy: "user", filter: this._userid});
              const cases = casesM.message;
              let pi = -1;
              if (precase != null)
                 for (let c in cases)
                    if (cases[c].name == precase)
                       pi = c;

              if (!caseid && (precase == null || pi == -1))
                 caseid = await DCCNoticeInput.displayNotice(
                    "Select a case to load.",
                    "list", "Select", "Cancel", cases);
              else
                 caseid = cases[pi].id;
              this._state.currentCase = caseid;
              await this._caseLoad(caseid);
           }
        }
        MessageBus.ext.publish("knot/<</navigate");
        // this.knotLoad("entry");
      }
   }

   async _caseLoad(caseid) {
      console.log("=== load: " + caseid);
      Basic.service.currentCaseId = caseid;
      const caseObj = await MessageBus.ext.request(
         "data/case/" + Basic.service.currentCaseId + "/get");
      this._currentCaseName = caseObj.message.name;

      console.log("=== compile");
      console.log(Basic.service.currentCaseId);
      console.log(caseObj.message.source);
      this._compiledCase =
         await Translator.instance.compileMarkdown(Basic.service.currentCaseId,
                                                   caseObj.message.source);
      console.log(this._compiledCase);
      this._knots = this._compiledCase.knots;
      Basic.service.currentThemeFamily = this._compiledCase.theme;
   }
   
   async knotLoad(knotName, parameter) {
      this._currentKnot = knotName;
      console.log("=== knots");
      console.log(knotName);
      console.log(this._knots);
      // <TODO> Local Environment - Future
      /*
      this._knotScript = document.createElement("script");
      this._knotScript.src = "knots/" + knotName + ".js";
      document.head.appendChild(this._knotScript);
      */
      if (!DCCPlayerServer.localEnv) {
         let knot = await Translator.instance.generateHTML(
            this._knots[knotName]);
         if (parameter &&
             (knot.indexOf("<>") > -1 || knot.indexOf("&lt;&gt;") > -1))
            knot = knot.replace("<>", parameter)
                       .replace("&lt;&gt;", parameter);
         if (this._knots[knotName].categories &&
             this._knots[knotName].categories.indexOf("note") > -1)
            this.presentNote(knot);
         else
            this.presentKnot(knot);
      }
      MessageBus.ext.publish("knot/" + knotName + "/start");
   }

   caseCompleted(topic, message) {
      this._state.sessionCompleted();
   }
   
   presentKnot(knot) {
      MessageBus.page = new MessageBus(false);
      
      this._mainPanel.innerHTML = knot;

      // <TODO> Local Environment - Future
      /*
      if (DCCPlayerServer.localEnv)
         document.head.removeChild(this._knotScript);
      */
      
      // <TODO> Improve the strategy
      if (this._currentKnot == "entry")
         this.startGame();
   }
   
   presentNote(knot) {
      // <TODO> provisory
      if (!MessageBus.page)
         MessageBus.page = new MessageBus(false);

      const dimensions = Basic.service.screenDimensions();
      
      let div = document.createElement("div");
      
      div.style.position = "absolute";
      div.style.margin = "auto";
      div.style.top = 0;
      div.style.right = 0;
      div.style.bottom = 0;
      div.style.left = 0;
      div.style.width = (dimensions.width * .7) + "px";
      div.style.height = (dimensions.height * .7) + "px";
      
      div.innerHTML = knot;
      
      this._mainPanel.appendChild(div);
   }
   
   /*
    * Registry related operations
    * ***************************
    */
   
   /*
   startGame() {
      this._history = [];
      
      this._server.resetRunningCase();
      let currentUser = this._server.getCurrentUser();
      if (currentUser == null)
         document.querySelector("#signin-register").style.display = "flex";
      else {
         let userId = document.querySelector("#user-id");
         userId.innerHTML = userId.innerHTML + currentUser;
         let profile = this._server.getProfile(currentUser);
         let userName = document.querySelector("#user-name");
         userName.innerHTML = userName.innerHTML + profile.name;
         document.querySelector("#signed-user").style.display = "initial";
      }
    }
   
   register() {
      let userId = document.querySelector("#idInput").value;
      let userName = document.querySelector("#nameInput").value;
      let userAge = document.querySelector("#ageInput").value;
      let invalidId = document.querySelector("#invalid-id");
      let answerAll = document.querySelector("#answer-all");

      if (userId.trim().length >0 && userName.trim().length > 0 && parseInt(userAge) > 0) {
         let users = this._server.getUsers();
         if (users.ids.indexOf(userId) > -1) {
             invalidId.style.display = "initial";
             answerAll.style.display = "none";
         } else {
             let profile = {id: userId,
                            name: userName,
                            age: userAge,
                            cases: []};
             this._server.setProfile(profile);
             invalidId.style.display = "none";
             answerAll.style.display = "none";
             document.querySelector("#signed-user").style.display = "initial";
             document.querySelector("#registration-form").style.display = "none";
             this._server.setCurrentUser(userId);
         }
      } else {
          invalidId.style.display = "none";
          answerAll.style.display = "initial";
      }
   }
   
   signIn() {
      var userId = document.querySelector("#idInput").value;

      if (this._server.getUsers().ids.indexOf(userId) > -1) {
          var profile = this._server.getProfile(userId);
          var userName = document.querySelector("#user-name");
          userName.innerHTML = userName.innerHTML + profile.name;
          document.querySelector("#request-id").style.display = "none";
          document.querySelector("#invalid-id").style.display = "none";
          document.querySelector("#signed-user").style.display = "initial";
          this._server.setCurrentUser(userId);
      } else
          document.querySelector("#invalid-id").style.display = "initial";
   }
   */
   
   /*
    * Start the tracking record of a case
    */
   startCase() {
      if (!PlayerManager.isCapsule) {
         // <TODO> this._runningCase is provisory
         const runningCase =
            this._server.generateRunningCase(this._userid,
                                             Basic.service.currentCaseId);
        
         MessageBus.ext.defineRunningCase(runningCase);
      }
   }
   
   /*
    * Tracking player
    * ***************
    */
   
   trackTrigger(trigger) {
      this._server.trackRoute("#nav:" + trigger);
   }
   
   startTrackTyping(variable) {
      MessageBus.ext.subscribe("/" + variable + "/typed", this.trackTyping);
   }
   
   trackTyping(topic, message) {
      console.log("track typing: " + message.value);
   }
   
   // <TODO> provisory
   
   produceReport(topic, message) {
      const server = this._server;
      
      let output = {
         currentUser: server.getCurrentUser(),
         runningCase: server.getRunningCasekey(),
         users: {}
      }
      
      const users = server.getUsers();
      for (let u in users.ids) {
         let profile = server.getProfile(users.ids[u]);
         if (profile != null) {
            profile.caseTracks = {};
            for (let c in profile.cases)
                profile.caseTracks[profile.cases[c]] = server.getCaseInstance(profile.cases[c]);
         }
         output.users[users.ids[u]] = profile;
      }
      
      MessageBus.int.publish("/report", {caseobj: server.getPlayerObj(),
                                                result: output});
   }   
}

(function() {
   PlayerManager.player = new PlayerManager();
})();