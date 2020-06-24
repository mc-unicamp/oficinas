/**
 * Customized blocks for Blockly
 */

class ScriptBlocksCell {
   static create(types) {
      ScriptBlocksCell.s = new ScriptBlocksCell(types);
   }

   constructor(types) {
      this._selectTypes = [];
      let emptyPos = -1;
      for (let t in types)
         if (types[t][0] == "empty")
            emptyPos = t;
         else
            this._selectTypes.push([types[t][2], types[t][0]]);
      this._allSelectTypes = this._selectTypes.slice();
      this._allSelectTypes.unshift(
         (emptyPos > -1)
           ? [types[emptyPos][2], types[emptyPos][0]]
           : [ScriptBlocksCell.emptyType[2], ScriptBlocksCell.emptyType[0]]);

      this._types = {};
      if (emptyPos == -1)
         this._types[ScriptBlocksCell.emptyType[0]] = ScriptBlocksCell.emptyType[1];
      for (let t of types)
         this._types[t[0]] = t[1];

      this._buildBlocks();
      this._codeGenerator();
   }

   _buildBlocks() {
      Blockly.Blocks["neighbor"] = {
        init: function() {
          this.jsonInit({
            "message0": "se %1 encontra %2 então %3",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "origin",
                 "options": ScriptBlocksCell.s._allSelectTypes
               },
               {
                 "type": "field_dropdown",
                 "name": "target",
                 "options": ScriptBlocksCell.s._allSelectTypes
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

      Blockly.Blocks["expression"] = {
        init: function() {
          this.jsonInit({
            "message0": "se %1 encontra %2 então",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "origin",
                 "options": ScriptBlocksCell.s._allSelectTypes
               },
               {
                 "type": "field_dropdown",
                 "name": "target",
                 "options": ScriptBlocksCell.s._allSelectTypes
               }
            ],
            "message1": "expressão %1 %2",
            "args1": [
              {
                "type": "field_input",
                "name": "expression"
              },
              {
                "type": "input_value",
                "name": "action",
                "check": "Action"
              }
            ],
            "colour": 170,
            "tooltip": "Computes expression."
          });
        }
      };

      Blockly.Blocks["boid"] = {
        init: function() {
          this.jsonInit({
            "message0": "se %1 encontra %2 então",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "origin",
                 "options": ScriptBlocksCell.s._allSelectTypes
               },
               {
                 "type": "field_dropdown",
                 "name": "target",
                 "options": ScriptBlocksCell.s._allSelectTypes
               }
            ],
            "message1": "ação %1",
            "args1": [
              {
                "type": "input_value",
                "name": "action",
                "check": "Action"
              }
            ],
            "colour": 170,
            "tooltip": "Boid agent."
          });
        }
      };

      Blockly.Blocks["condition"] = {
        init: function() {
          this.jsonInit({
            "message0": "se %1 encontra %2 então",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "origin",
                 "options": ScriptBlocksCell.s._allSelectTypes
               },
               {
                 "type": "field_dropdown",
                 "name": "target",
                 "options": ScriptBlocksCell.s._allSelectTypes
               }
            ],
            "message1": "ângulo de inclinação %1",
            "args1": [
               {
                 "type": "field_number",
                 "name": "angle",
                 "value": 90,
                 "min": 0,
                 "max": 360
               }
            ],
            "message2": "detalhe %1",
            "args2": [
               {
                 "type": "field_dropdown",
                 "name": "time_rate",
                 "options": [
                    ["Pouco", "1"],
                    ["Médio", "0.5"],
                    ["Muito", "0.1"]
                 ]
               },
            ],
            "message3": "velocidade inicial %1",
            "args3": [
               {
                 "type": "input_value",
                 "name": "initial_velocity",
                 "check": "Velocity",
                 "align": "RIGHT"
               }
            ],
            "message4": "gravidade %1",
            "args4": [
               {
                 "type": "input_value",
                 "name": "gravity",
                 "check": "Acceleration",
                 "align": "RIGHT"
               }
            ],
            "message5": "ação %1",
            "args5": [
               {
                 "type": "input_value",
                 "name": "action",
                 "check": "Action",
                 "align": "RIGHT"
               }
            ],
            "colour": 170,
            "tooltip": "Computes expression."
          });
        }
      };

      Blockly.Blocks["velocity"] = {
        init: function() {
          this.jsonInit({
            "message0": "%1 m/s",
            "args0": [
               {
                "type": "field_number",
                "name": "velocity",
                "value": 1,
                "min": 0
               }
            ],
            "colour": 200,
            "tooltip": "Velocity.",
            "output": "Velocity"
          });
        }
      };

      Blockly.Blocks["acceleration"] = {
        init: function() {
          this.jsonInit({
            "message0": "%1 m/s²",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "acceleration",
                 "options": [
                    ["Terra - 9,8 m/s²", "0.98"],
                    ["Lua - 1,62 m/s²", "0.162"],
                    ["Júpiter - 24,79", "2.479"]
                 ]
               },
            ],
            "colour": 240,
            "tooltip": "Acceleration.",
            "output": "Acceleration"
          });
        }
      };

      Blockly.Blocks["action_agent"] = {
        init: function() {
          this.jsonInit({
            "message0": "ação %1",
            "args0": [
               {
                 "type": "field_dropdown",
                 "name": "action",
                 "options": [
                    ["rastro", "trail"],
                    ["movimenta", "move"]
                 ]
               },
            ],"colour": 260,
            "tooltip": "Action.",
            "output": "Action"
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
                    ["duplica", "duplicate"],
                    ["desaparece", "vanish"],
                    ["rastro", "trail"]
                 ]
               },
            ],
            "message1": "passo %1",
            "args1": [
              {
                "type": "field_number",
                "name": "step",
                "value": 1,
                "min": 0,
                "max": 100
              }
            ],
            "message2": "chance %1",
            "args2": [
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
                 "options": ScriptBlocksCell.s._selectTypes
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
                   .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue("origin")])
                   .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue("target")]) +
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
      Blockly.JavaScript["expression"] = function(block) {
         let result = "<rule-dcc-cell-expression " +
                "expression='" + block.getFieldValue("expression") + "' " +
                Blockly.JavaScript.statementToCode(block, "action")
                   .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue("origin")])
                   .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue("target")]) +
                ">\n" +
                "</rule-dcc-cell-expression>";
         /*
         console.log("=== rule");
         console.log(result);
         */
         return result;
      };

      Blockly.JavaScript["boid"] = function(block) {
         // console.log("=== generating boid");
         let result = "<rule-dcc-cell-agent " +
                Blockly.JavaScript.statementToCode(block, "action")
                   .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue("origin")])
                   .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue("target")]) +
                ">\n" +
                "</rule-dcc-cell-agent>";
         /*
         console.log("=== rule");
         console.log(result);
         */
         return result;
      };

      Blockly.JavaScript["condition"] = function(block) {
         console.log("=== generating condition");
         let expX = "x=x0";
         let expY = "y=y0";
         const angle = block.getFieldValue("angle");
         let v0 = Blockly.JavaScript.statementToCode(block, "initial_velocity").trim();
         if (v0.length > 0) {
            expX += "+" + v0 + "*cos(" + angle + ")*t";
            expY += "-" + v0 + "*sin(" + angle + ")*t";
         }
         let a = Blockly.JavaScript.statementToCode(block, "gravity").trim();
         if (a.length > 0)
            expY += "+" + a + "*(t^2/2)";
         let result = "<rule-dcc-cell-expression " +
                "expression='" + expX + ";" + expY + "' " +
                "time-rate='" + block.getFieldValue("time_rate") + "' " +
                Blockly.JavaScript.statementToCode(block, "action")
                   .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue("origin")])
                   .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue("target")]) +
                ">\n" +
                "</rule-dcc-cell-expression>";
         console.log("=== rule");
         console.log(result);
         return result;
      };

      Blockly.JavaScript["velocity"] = function(block) {
         return "" + block.getFieldValue("velocity");
      };

      Blockly.JavaScript["acceleration"] = function(block) {
         return "" + block.getFieldValue("acceleration");
      };

      Blockly.JavaScript["action"] = function(block) {
         return " probability='" + block.getFieldValue("probability") + "'" +
                " step='" + block.getFieldValue("step") + "'" +
                " transition='" + ScriptBlocksCell.transitions[block.getFieldValue("action")] + "'";
      };

      Blockly.JavaScript["action_agent"] = function(block) {
         return " probability='100' " +
                " transition='" + ScriptBlocksCell.transitions[block.getFieldValue("action")] + "'";
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
   ScriptBlocksCell.emptyType = ["empty", "_", "vazio"];

   ScriptBlocksCell.transitions = {
      "move":      "_o_t>_t_o",
      "duplicate": "_o_t>_o_o",
      "vanish":    "_o_t>__t",
      "trail":     "_o_t>#_o"
   };
})();