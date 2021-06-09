class AuthorStart {
   async start() {
      this._userid = await Basic.service.signin();
   }
}

(function() {
AuthorStart.instance = new AuthorStart();
})();