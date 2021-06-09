class DraftManager {
   async start() {
      this.deleteCase = this.deleteCase.bind(this);
      MessageBus.int.subscribe("control/case/delete", this.deleteCase);

      const authorState = Basic.service.authorStateRetrieve();

      this._boxesPanel = document.querySelector("#case-boxes");
      this._draftSelect(authorState.userid);
   }

   async _draftSelect(userid) {
      const cases = await MessageBus.ext.request("data/case/*/list",
                                                 {filterBy: "user",
                                                  filter: userid});

      const cl = cases.message;
      for (let c in cl) {
         let template = document.createElement("template");
         template.innerHTML = DraftManager.caseBox
            .replace(/\[id\]/ig, cl[c].id)
            // .replace("[icon]", cl[c].icon)
            .replace("[title]", cl[c].name);
            // .replace("[description]", cl[c].description);
         this._boxesPanel.appendChild(template.content.cloneNode(true));
         let editButton = this._boxesPanel.querySelector("#e" + cl[c].id);
         let previewButton = this._boxesPanel.querySelector("#p" + cl[c].id);
         let deleteButton = this._boxesPanel.querySelector("#d" + cl[c].id);
         editButton.addEventListener("click",
            function() {
               Basic.service.authorCaseStore(this.id.substring(1));
               window.location.href = 'author.html';
            }
         );
         previewButton.addEventListener("click",
            function(){
               Basic.service.authorCaseStore(this.id.substring(1));
               window.location.href = '../player/index.html';
            }
         );
         deleteButton.addEventListener("click",
            function() {
               MessageBus.int.publish("control/case/delete", this.id.substring(1));
            }
         );
      }
   }

   async deleteCase(topic, message) {
      const decision =
         await DCCNoticeInput.displayNotice(
            "Are you sure that you want to delete this case? (write yes or no)",
            "input");
      if (decision.toLowerCase() == "yes")
         await MessageBus.ext.request("data/case/" + message + "/delete");
      const box = this._boxesPanel.querySelector("#b" + message);
      this._boxesPanel.removeChild(box);
   }
}

(function() {
DraftManager.instance = new DraftManager();

DraftManager.caseBox =
`<div id="b[id]" class="d-flex h-100 flex-column draft-author-case-container">
   <div class="draft-case-image w-100 h-50"></div>
   <div class="draft-case-title">[title]</div>
   <div class="draft-author-description">Brief description of the case.</div>
   <div class="d-flex">
      <div id="e[id]" class="author-case-buttons">EDIT</div>
      <div id="p[id]" class="author-case-buttons">PREVIEW</div>
      <div id="d[id]" class="author-case-buttons">DELETE</div>
   </div>
</div>`;

})();