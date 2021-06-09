/**
 * Utilities in general
 */

class Basic {
   constructor() {
      this._host = null;
      this._rootPath = "../";

      // initial values of shared states
      this.currentThemeFamily = Basic.standardThemeFamily;
      this._currentThemeCSS = null;
      this.currentCaseId = null;

      /*
      this.requestCurrentThemeFamily = this.requestCurrentThemeFamily.bind(this);
      MessageBus.ext.subscribe("control/_current_theme_name/get",
                               this.requestCurrentThemeFamily);
      */
   }

   /*
    * Properties
    */

   get host() {
      return this._host;
   }
   
   set host(newValue) {
      this._host = newValue;
   }

   get rootPath() {
      return this._rootPath;
   }
   
   set rootPath(newValue) {
      this._rootPath = newValue;
   }

   /*
    * States shared by author, player, and other environments
    */

   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      // Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;

      this._currentThemeCSS =
         this.replaceStyle(document, this._currentThemeCSS, newValue);
   }

   /*
   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }
   */

   set currentCaseId(newValue) {
      this._currentCaseId = newValue;
   }

   get currentCaseId() {
      return this._currentCaseId;
   }

   isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   /*
    * Use signin
    *    state - player state variable; stores user credentials after login
    */
   async signin(state) {
      let status = "start";

      let userid = null;
      let userEmail = null;

      // if (!state) {
      const authorState = this.authorStateRetrieve();

      userid = (authorState != null && authorState.userid != null)
         ? authorState.userid : null;

      if (userid != null) {
         let decision = await DCCNoticeInput.displayNotice(
            "Proceed as " + authorState.email + "?", "message", "Yes", "No");
         if (decision == "Yes") {
            DCCCommonServer.instance.token = authorState.token;
            userEmail = authorState.email;
         } else
            userid = null;
      }
      // }

      let errorMessage = "";
      while (userid == null) {
         userEmail =
            await DCCNoticeInput.displayNotice(errorMessage +
                                         "<h3>Signin</h3><h4>inform your email:</h4>",
                                         "input");
         const userPass =
            await DCCNoticeInput.displayNotice("<h3>Signin</h3><h4>inform your password:</h4>",
                                         "password");

         let loginReturn = await MessageBus.ext.request("data/user/login",
                                                        {email: userEmail,
                                                         password: userPass});

         userid = loginReturn.message.userid;
         if (userid == null)
            errorMessage =
               "<span style='color: red'>Invalid user and/or password.</span>";
      }
      if (state)
        state.sessionRecord(userid, DCCCommonServer.instance.token);
      this.authorIdStore(userid, userEmail, DCCCommonServer.instance.token);
   }

   /*
    * Authoring State
    * <TODO> Unify with State
    */
   authorStateRetrieve() {
      let state = null;
      const stateS = localStorage.getItem(Basic.authorStateId);
      if (stateS != null) {
         state = JSON.parse(stateS);
         DCCCommonServer.instance.token = state.token;
      }
      return state;
   }

   authorIdStore(userid, userEmail, token) {
      const state = {
         userid: userid,
         email: userEmail,
         token: token
      };
      localStorage.setItem(Basic.authorStateId,
                           JSON.stringify(state));
   }

   authorTemplateStore(template) {
      let state = this.authorStateRetrieve();
      if (state != null) {
         state.template = template;
         localStorage.setItem(Basic.authorStateId,
                              JSON.stringify(state));
      }
   }
   
   authorCaseStore(caseId) {
      let state = this.authorStateRetrieve();
      if (state != null) {
         state.caseId = caseId;
         localStorage.setItem(Basic.authorStateId,
                              JSON.stringify(state));
      }
   }

   screenDimensions() {
      let dimensions = {
         left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
         top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
         width: (window.innerWidth)
                   ? window.innerWidth
                   : (document.documentElement.clientWidth)
                      ? document.documentElement.clientWidth
                      : screen.width,
         height: (window.innerHeight)
                    ? window.innerHeight
                    : (document.documentElement.clientHeight)
                       ? document.documentElement.clientHeight
                       : screen.height,
         };
      dimensions.zoom = dimensions.width / window.screen.availWidth;
      return dimensions;
   }
   
   centralize(width, height) {
      const dimensions = this.screenDimensions();
      return {
         left: ((dimensions.width - width) / 2) / dimensions.zoom + dimensions.left,
         top: ((dimensions.height - height) / 2) / dimensions.zoom + dimensions.top
      }
   }

   imageResolver(path) {
      let result = path;
      // <TODO> improve
      if (path.startsWith("theme/"))
         result = this._rootPath +
                  "themes/" + this.currentThemeFamily +
                  "/images/" + path.substring(6);
      else if (path.startsWith("template/"))
         result = this._rootPath +
                  "templates/" + this.currentThemeFamily +
                  "/images/" + path.substring(9);
      else if (!(path.startsWith("http://") || path.startsWith("https://") ||
            path.startsWith("/") || path.startsWith("../")))
         result = DCCCommonServer.managerAddress + "artifacts/cases/" +
                  ((this.host != null) ? this.currentCaseId + "/" : "") +
                  path;
      return result;
   }

   themeStyleResolver(cssFile) {
      return this._rootPath + "themes/" + this.currentThemeFamily +
             "/css/" + cssFile;
   }

   systemStyleResolver(cssFile) {
      return this._rootPath + "themes/" + Basic.systemThemeFamily +
             "/css/" + cssFile;
   }

   replaceStyle(targetDocument, oldCSS, newTheme, cssFile) {
      if (oldCSS)
         targetDocument.head.removeChild(oldCSS);

      const cssF = (cssFile) ? cssFile : "theme.css";

      let newCSS = document.createElement("link");
      newCSS.setAttribute("rel", "stylesheet");
      newCSS.setAttribute("type", "text/css");
      newCSS.setAttribute("href", this.themeStyleResolver(cssF));
      targetDocument.head.appendChild(newCSS);

      return newCSS;
   }
}

(function() {
   Basic.standardThemeFamily = "minimal";
   Basic.systemThemeFamily = "system";

   // <TODO> provisory based on SVG from XD
   Basic.referenceViewport = {width: 1920, height: 1080};

   // <TODO> unify with State
   Basic.storeId = "harena-state";
   Basic.authorStateId = "harena-state-author";

   Basic.service = new Basic();
})();