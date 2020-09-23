(function() {
insertSource(
"Relógio de Areia",
[["sand",  ".", "areia"],
 ["glass", "#", "vidro"]],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" label="sand clock" cell-width="6" cell-height="6">
#############################################
#...........................................#
#...........................................#
#...........................................#
#...........................................#
##.........................................##
_#.........................................#_
_##.......................................##_
__#.......................................#__
__##.....................................##__
___#.....................................#___
___##...................................##___
____#...................................#____
____##.................................##____
_____##...............................##_____
______##.............................##______
_______##...........................##_______
________##.........................##________
_________##.......................##_________
__________##.....................##__________
___________###.................###___________
_____________###.............###_____________
_______________###.........###_______________
_________________###.....###_________________
___________________##___##___________________
___________________##___##___________________
_________________###_____###_________________
_______________###_________###_______________
_____________###_____________###_____________
___________###_________________###___________
__________##_____________________##__________
_________##_______________________##_________
________##_________________________##________
_______##___________________________##_______
______##_____________________________##______
_____##_______________________________##_____
____##_________________________________##____
____#___________________________________#____
___##___________________________________##___
___#_____________________________________#___
__##_____________________________________##__
__#_______________________________________#__
_##_______________________________________##_
_#_________________________________________#_
##_________________________________________##
#___________________________________________#
#___________________________________________#
#___________________________________________#
#___________________________________________#
#############################################
</dcc-space-cellular-editor>

<dcc-cell-color type="#" label="glass" color="#57c86e"></dcc-cell-color>

<dcc-cell-color type="." label="sand" color="#7f8395"></dcc-cell-color>

<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>
<dcc-trigger label="Save" action="state/save"></dcc-trigger>
<dcc-trigger label="Restart" action="state/reset"></dcc-trigger>

Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Vidro" action="type/glass"
                   image="images/cell/glass.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Areia" action="type/sand"
                   image="images/cell/sand.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-yellow.svg">
      </dcc-trigger>
   </div>
</div>

<dcc-timer cycles="100000" interval="50" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/reset" role="reset"></subscribe-dcc>`
);
})();