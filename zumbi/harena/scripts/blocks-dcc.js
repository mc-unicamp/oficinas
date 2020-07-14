/**
 * Customized blocks for Blockly
 */

class ScriptBlocksDCC {
   static create() {
      ScriptBlocksDCC.s = new ScriptBlocksDCC();
   }

   constructor() {
      this._buildBlocks();
      this._codeGenerator();
   }

   _buildBlocks() {
      /*
      Blockly.Blocks["state"] = {
        init: function() {
          this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
          this.setStyle('list_blocks');
          this.itemCount_ = 2;
          this.updateShape_();
          // this.setOutput(true, 'Array');
          this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
          this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
        },
        mutationToDom: function() {
          var container = Blockly.utils.xml.createElement('mutation');
          container.setAttribute('items', this.itemCount_);
          return container;
        },
        domToMutation: function(xmlElement) {
          this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
          this.updateShape_();
        },
        decompose: function(workspace) {
          var containerBlock = workspace.newBlock('lists_create_with_container');
          containerBlock.initSvg();
          var connection = containerBlock.getInput('STACK').connection;
          for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
          }
          return containerBlock;
        },
        compose: function(containerBlock) {
          var itemBlock = containerBlock.getInputTargetBlock('STACK');
          // Count number of inputs.
          var connections = [];
          while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          }
          // Disconnect any children that don't belong.
          for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && connections.indexOf(connection) == -1) {
              connection.disconnect();
            }
          }
          this.itemCount_ = connections.length;
          this.updateShape_();
          // Reconnect any child blocks.
          for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
          }
        },
        saveConnections: function(containerBlock) {
          var itemBlock = containerBlock.getInputTargetBlock('STACK');
          var i = 0;
          while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          }
        },
        updateShape_: function() {
          if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
          } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
          }

          // Add new inputs.
          for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput("ADD" + i)) {
              let input = this.appendValueInput("ADD" + i);
              switch (i) {
                 // case 0: input.appendField("State"); break;
                 case 0: input.appendField("variable");
                         input.appendField(
                           new Blockly.FieldTextInput("value"), "variable");
                         break;
                 case 1: input.appendField("rotate");
                         input.appendField(
                            new Blockly.FieldCheckbox(true), "rotate");
                         break;
              }
            }
          }

          // Remove deleted inputs.
          while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
          }
        }
      };
      */
      const listBase = {
        mutationToDom: function() {
          var container = Blockly.utils.xml.createElement('mutation');
          container.setAttribute('items', this.itemCount_);
          return container;
        },
        domToMutation: function(xmlElement) {
          this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
          this.updateShape_();
        },
        decompose: function(workspace) {
          var containerBlock = workspace.newBlock('lists_create_with_container');
          containerBlock.initSvg();
          var connection = containerBlock.getInput('STACK').connection;
          for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
          }
          return containerBlock;
        },
        compose: function(containerBlock) {
          var itemBlock = containerBlock.getInputTargetBlock('STACK');
          // Count number of inputs.
          var connections = [];
          while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          }
          // Disconnect any children that don't belong.
          for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && connections.indexOf(connection) == -1) {
              connection.disconnect();
            }
          }
          this.itemCount_ = connections.length;
          this.updateShape_();
          // Reconnect any child blocks.
          for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
          }
        },
        saveConnections: function(containerBlock) {
          var itemBlock = containerBlock.getInputTargetBlock('STACK');
          var i = 0;
          while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          }
        }
      };
      Blockly.Blocks["group"] = Object.assign({
        init: function() {
          this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
          this.setStyle('list_blocks');
          this.itemCount_ = 2;
          this.updateShape_();
          this.setOutput(true, 'lists_create_with_item');
          this.setColour(300);
          this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
          this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
        },
        updateShape_: function() {
          if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
          } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
          }
          // Add new inputs.
          for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput("ADD" + i)) {
              let input = this.appendValueInput("ADD" + i);
              switch (i) {
                 case 0: input.appendField("group");
                         break;
                 case 1: input.appendField("role");
                         input.appendField(
                            new Blockly.FieldTextInput(), "role");
                         break;
              }
            }
          }
          // Remove deleted inputs.
          while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
          }
        }
      }, listBase);
      Blockly.Blocks["state"] = Object.assign({
        init: function() {
          this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
          this.setStyle('list_blocks');
          this.itemCount_ = 2;
          this.updateShape_();
          this.setColour(350);
          this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
          this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
        },
        updateShape_: function() {
          if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
          } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
          }
          // Add new inputs.
          for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput("ADD" + i)) {
              let input = this.appendValueInput("ADD" + i);
              switch (i) {
                 // case 0: input.appendField("State"); break;
                 case 0: input.appendField("state");
                         input.appendField(
                           new Blockly.FieldTextInput("value"), "variable");
                         break;
                 case 1: input.appendField("rotate");
                         input.appendField(
                            new Blockly.FieldCheckbox(true), "rotate");
                         break;
              }
            }
          }
          // Remove deleted inputs.
          while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
          }
        }
      }, listBase);
   }

   addImageBlocks(imageBlocks) {
      for (let ib in imageBlocks) {
         Blockly.Blocks[ib] = {
           init: function() {
             this.jsonInit({
               "message0": "image %1  role %2",
               "args0": [
                  {
                    "type": "field_image",
                    "name": "src",
                    "src": imageBlocks[ib].src,
                    "width": imageBlocks[ib].width,
                    "height": imageBlocks[ib].height,
                    "alt": imageBlocks[ib].alt
                  },
                  {
                    "type": "field_input",
                    "name": "role"
                  }
               ],
               "colour": imageBlocks[ib].color,
               "tooltip": imageBlocks[ib].tooltip,
               "output": "lists_create_with_item"
             });
           }
         };
      }
   }

   _codeGenerator() {
      Blockly.JavaScript["image"] = function(block) {
         return "<dcc-image image='" +
                block.getFieldValue("src") + "'>" +
                "</dcc-image>\n";
      };

      Blockly.JavaScript["state"] = function(block) {
         let code = "<dcc-state variable='" +
            block.getFieldValue("variable") + "'" +
            ((block.getFieldValue("rotate") == "TRUE") ? " rotate" : "") +
            ">\n";
         for (let i = 0; i < block.itemCount_; i++)
            code += Blockly.JavaScript.statementToCode(block, "ADD" + i);
          // Blockly.JavaScript.statementToCode(block, "image") +
          code += "</dcc-state>";
          return code;
      };

      Blockly.JavaScript["lists_create_with"] = function(block) {
         let code = "";
         for (let i = 0; i < block.itemCount_; i++)
            code += Blockly.JavaScript.statementToCode(block, "ADD" + i);
         return code;
      };
   }
}

(function() {
})();