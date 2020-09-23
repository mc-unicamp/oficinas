/**
 * Customized blocks for Blockly
 */

class ScriptBlocks {
   static create(types) {
      ScriptBlocks.inst = new ScriptBlocks(types);
   }

   constructor(types) {
      this._selectTypes = [];
      for (let t of types)
         this._selectTypes.push([t[2], t[0]]);
      this._allSelectTypes = this._selectTypes.slice();
      this._allSelectTypes.unshift([ScriptBlocks.emptyType[2], ScriptBlocks.emptyType[0]]);

      this._types = {};
      this._types[ScriptBlocks.emptyType[0]] = ScriptBlocks.emptyType[1];
      for (let t of types)
         this._types[t[0]] = t[1];

      this._buildBlocks();
      this._codeGenerator();
   }

   _buildBlocks() {
      Blockly.Blocks["neighbor"] = {
        init: function() {
          this.jsonInit({
            "message0": "se %1 \n encontra %2 então %3",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "origin",
                 "options": ScriptBlocks.inst._allSelectTypes
               },
               {
                 "type": "field_dropdown",
                 "name": "target",
                 "options": ScriptBlocks.inst._allSelectTypes
               },
               {
                 "type": "input_value",
                 "name": "action",
                 "check": "Action"
               }
            ],
            "message1": "%1 %2 %3",
            "args1": [
              {
                "type": "field_checkbox",
                "name": "upLeft",
                "check": "Boolean"
              },
              {
                "type": "field_checkbox",
                "name": "up",
                "check": "Boolean"
              },
              {
                "type": "field_checkbox",
                "name": "upRight",
                "check": "Boolean"
              }
            ],
            "message2": "%1 %2 %3 direção",
            "args2": [
              {
                "type": "field_checkbox",
                "name": "left",
                "check": "Boolean"
              },
              {
                "type": "field_image",
                "src":  "../icons/arrows.png",
                "width": 22,
                "height": 22
              },
              {
                "type": "field_checkbox",
                "name": "right",
                "check": "Boolean"
              }
            ],
            "message3": "%1 %2 %3",
            "args3": [
              {
                "type": "field_checkbox",
                "name": "downLeft",
                "check": "Boolean"
              },
              {
                "type": "field_checkbox",
                "name": "down",
                "check": "Boolean"
              },
              {
                "type": "field_checkbox",
                "name": "downRight",
                "check": "Boolean"
              }
            ],
            "colour": 160,
            "tooltip": "Checks neighborhood."
          });
        }
      };

      Blockly.Blocks["action"] = {
        init: function() {
          this.jsonInit({
            "message0": "ação %1",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "action",
                 "options": [
                    ["movimenta", "move"],
                    ["duplica", "duplicate"]
                 ]
               },
            ],
            "message1": "chance %1",
            "args1": [
              {
                "type": "field_number",
                "name": "probability",
                "value": 100,
                "min": 0,
                "max": 100
              }
            ],
            "colour": 230,
            "tooltip": "Action.",
            "output": "Action"
          });
        }
      };

      Blockly.Blocks["disapear"] = {
        init: function() {
          this.jsonInit({
            "message0": "%1 desaparecer",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "action",
                 "options": ScriptBlocks.inst._selectTypes
               },
            ],
            "message1": "chance %1",
            "args1": [
              {
                "type": "field_number",
                "name": "probability",
                "value": 100,
                "min": 0,
                "max": 100
              }
            ],
            "colour": 200,
            "tooltip": "Disapear."
          });
        }
      };
   }

   _codeGenerator() {
      Blockly.JavaScript["neighbor"] = function(block) {
         return "<rule-dcc-cell-pair " +
                Blockly.JavaScript.statementToCode(block, "action")
                   .replace(/_o/g, ScriptBlocks.inst._types[block.getFieldValue("origin")])
                   .replace(/_t/g, ScriptBlocks.inst._types[block.getFieldValue("target")]) +
                ">\n" +
                ((block.getFieldValue("upLeft") == "TRUE") ? "*" : "_") +
                ((block.getFieldValue("up") == "TRUE") ? "*" : "_") +
                ((block.getFieldValue("upRight") == "TRUE") ? "*" : "_") + "\n" +
                ((block.getFieldValue("left") == "TRUE") ? "*" : "_") + "_" +
                ((block.getFieldValue("right") == "TRUE") ? "*" : "_") + "\n" +
                ((block.getFieldValue("downLeft") == "TRUE") ? "*" : "_") +
                ((block.getFieldValue("down") == "TRUE") ? "*" : "_") +
                ((block.getFieldValue("downRight") == "TRUE") ? "*" : "_") + "\n" +
                "</rule-dcc-cell-pair>";
      };
      Blockly.JavaScript["action"] = function(block) {
         return " probability='" + block.getFieldValue("probability") + "'" +
                " transition='" + ScriptBlocks.transitions[block.getFieldValue("action")] + "'";
      };

/*
<rule-dcc-cell-pair label="fall vertical" probability="100" transition="._>_.">
___
___
_*_
</rule-dcc-cell-pair>
*/
   }
}

(function() {
   ScriptBlocks.emptyType = ["empty", "_", "vazio"];

   ScriptBlocks.transitions = {
      "move":      "_o_t>_t_o",
      "duplicate": "_o_t>_o_o"
   };
})();