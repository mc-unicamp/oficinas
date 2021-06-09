/**
 * 
 */

class DCCPlayerServer {
   /*
    * Case services
    * *************
    */

   /*
   getCaseId() {
      return DCCPlayerServer.playerObj.id;
   }
   */
   
   /*
   getStartKnot() {
      return DCCPlayerServer.playerObj.start;
   }
   */

   loadKnot(knotName) {
      if (DCCPlayerServer.localEnv) {
         this._knotScript = document.createElement("script");
         this._knotScript.src = "knots/" + knotName + ".js";
         document.head.appendChild(this._knotScript);
      } else {
         
      }
   }
   
   
   /*
    * Running Case services
    * *********************
    */
   
   generateRunningCase(userid, caseid) {
      // const profile = this.getCurrentProfile();

      const currentDateTime = new Date();
      const caseuid = this.generateUID();
      // const casekey = profile.id + "#" + caseid + "#" + caseuid;
      // profile.cases.push(casekey);
      // this.setProfile(profile);
      // this.setRunningCasekey(casekey);

      const casetrack = {
        userid : userid,
        caseid : caseid,
        start  : currentDateTime.toJSON(),
        inputs : {},
        route : []
      };
      // this.setCaseInstance(casekey, casetrack);
      
      return {runningId: caseuid, track: casetrack};
   }
   
   generateUID() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      const currentDateTime = new Date();
      return currentDateTime.toJSON() + "-" +
             s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   }
   
   getRunningCasekey() {
      return localStorage.getItem(DCCPlayerServer.storePrefix + "running-case");
   }
   
   resetRunningCase() {
      localStorage.removeItem(DCCPlayerServer.storePrefix + "running-case");
   }
   
   setRunningCasekey(casekey) {
      localStorage.setItem(DCCPlayerServer.storePrefix + "running-case", casekey);
   }
   
   getCaseInstance(casekey) {
      const casek = localStorage.getItem(DCCPlayerServer.storePrefix + casekey);
      return JSON.parse(casek);
   }
   
   setCaseInstance(casekey, caseInstance) {
      localStorage.setItem(DCCPlayerServer.storePrefix + casekey, JSON.stringify(caseInstance));
   }

   trackRoute(item) {
      const casekey = this.getRunningCasekey();
      if (casekey != null) {
         let casetrack = this.getCaseInstance(casekey);
         this._addTrack(casetrack, item);
         this.setCaseInstance(casekey, casetrack);
      }
   }
   
   recordInput(variable, value) {
      const casekey = this.getRunningCasekey();
      if (casekey != null) {
         let casetrack = this.getCaseInstance(casekey);
         this._addTrack(casetrack, "#input(" + variable + "):" + value);
         casetrack.inputs[variable] = value;
         this.setCaseInstance(casekey, casetrack);
      }
   }
   
   _addTrack(casetrack, item) {
      const currentDateTime = new Date();
      casetrack.route.push(item + "," + currentDateTime.toJSON());
   }   
   
   /*
    * User services
    * *************
    */
   
   getCurrentUser() {
      return localStorage.getItem(DCCPlayerServer.storePrefix + "current-user");
   }
   
   setCurrentUser(userId) {
      localStorage.setItem(DCCPlayerServer.storePrefix + "current-user", userId);
   }
   
   getUsers() {
      let usersStr = localStorage.getItem(DCCPlayerServer.storePrefix + "users");
      return (usersStr == null) ? {ids: []} : JSON.parse(usersStr);
   }
   
   getCurrentProfile() {
      return this.getProfile(this.getCurrentUser());
   }
   
   getProfile(userid) {
      return JSON.parse(localStorage.getItem(DCCPlayerServer.storePrefix + "profile-" + userid));
   }
   
   addProfile(profile) {
      this.setProfile(profile);
      let users = this.getUsers();
      users.ids.push(profile.id);
      localStorage.setItem(DCCPlayerServer.storePrefix + "users", JSON.stringify(users));
   }
   
   setProfile(profile) {
      localStorage.setItem(DCCPlayerServer.storePrefix + "profile-" + profile.id, JSON.stringify(profile));
   }
   
   /*
    * General services
    * ****************
    * <TODO> provisory
    */
   getPlayerObj() {
      return DCCPlayerServer.playerObj;
   }

}

(function() {
   DCCPlayerServer.storePrefix = "casenote_";
})();