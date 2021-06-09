/**
 * Miniature Capsule
 *
 * Capsule of a mini running environment created to render a preview of a node inside a iframe miniature.
 */

class CapsuleManager {
   constructor() {
      MessageBus.page = new MessageBus(false);
   }
   
   startCapsule() {
      PlayerManager.player._mainPanel = document.querySelector("#main-panel");
   }
}

(function() {
   CapsuleManager.capsule = new CapsuleManager();
})();