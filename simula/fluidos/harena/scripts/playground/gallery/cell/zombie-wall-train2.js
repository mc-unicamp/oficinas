(function() {
AuthorCellManager.instance.insertSource(
"Zombie Venom Treino 2",
[],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50"
  background-image="images/cell/house-background-numbers.svg" cover-image="images/cell/house-cover.svg"
  cover-opacity="0" grid>
______1__a
__________
__________
__________
2_________
__________
__________
__________
__________
b_________
</dcc-space-cellular-editor>

<dcc-cell-image type="1" label="zombie1" image="images/cell/zumbi_10.png">
</dcc-cell-image>
<dcc-cell-image type="2" label="zombie2" image="images/cell/zumbi_3.png">
</dcc-cell-image>
<dcc-cell-image type="a" label="cursor1" image="images/cell/glass-red.svg">
</dcc-cell-image>
<dcc-cell-image type="b" label="cursor1" image="images/cell/glass.svg">
</dcc-cell-image>
<dcc-cell-image type="w" label="wall" image="images/cell/wall.svg"></dcc-cell-image>

<rule-dcc-cell-pair label="walk1" probability="100" transition="1_>_1">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walka" probability="100" transition="a_>_a">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walka" probability="100" transition="ab>_a">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk2" probability="100" transition="2_>_2">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walkb" probability="100" transition="b_>_b">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walka" probability="100" transition="ba>_b">
___
__*
___
</rule-dcc-cell-pair>

<dcc-timer cycles="100000" interval="1000" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" role="reset"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Zumbi" action="type/zombie1"
                   image="images/cell/zumbi_10.png">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Zumbi" action="type/zombie2"
                   image="images/cell/zumbi_3.png">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Parede" action="type/wall"
                   image="images/cell/wall.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-green.svg">
      </dcc-trigger>
   </div>
</div>
Configure a transparência do teto:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/icon/opacity.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="cover_opacity" value="0" index></dcc-slider>
   </div>
</div>
<subscribe-dcc target="cellular-space" topic="var/cover_opacity/changed" role="cover-opacity">
</subscribe-dcc>`
);
})();