class TemplateManager {
   async start() {
      const authorState = Basic.service.authorStateRetrieve();

      this._boxesPanel = document.querySelector("#template-boxes");
      this._templateSelect();
   }

   async _templateSelect() {
      const templateList = await MessageBus.ext.request("data/template/*/list",
                                                        {scope: "case"});

      console.log("List:");
      console.log(templateList.message);
      const tl = templateList.message;
      for (let t in tl) {
         let tid = tl[t].id.replace(/\//ig, "__");
         let template = document.createElement("template");
         template.innerHTML = TemplateManager.templateBox
            .replace("[id]", tid)
            .replace("[icon]", tl[t].icon)
            .replace("[title]", tl[t].name)
            .replace("[description]", tl[t].description);
         this._boxesPanel.appendChild(template.content.cloneNode(true));
         let box = this._boxesPanel.querySelector("#" + tid);
         box.addEventListener("click",
               function(){
                  let tid = this.id.replace(/__/ig, "/");
                  console.log(tid);
                  Basic.service.authorTemplateStore(tid);
                  window.location.href = 'author.html';
               }
            );
      }
   }
}

(function() {
TemplateManager.instance = new TemplateManager();

TemplateManager.templateBox =
`<div class="d-flex h-100 flex-column draft-author-case-container">
   <div class="draft-case-image w-100 h-50">
      <img src="[icon]" class="home-author-image">
   </div>
   <div class="draft-case-title">[title]</div>
   <div class="draft-author-description">[description]</div>
   <div class="d-flex"><div id="[id]" class="author-case-buttons">NEW</div></div>
</div>`;

})();