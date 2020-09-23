(function() {
insertSource(
"Balões Voadores",
[["balloon",  "b", "balão"],
 ["tree", "t", "árvore"]],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" grid>
______
______
______
______
_b____
___b__
tbt_bt
</dcc-space-cellular-editor>

<dcc-cell-image type="b" label="balloon" image="images/cell/balloon01.svg">
</dcc-cell-image>
<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>

<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>
<dcc-trigger label="Save" action="state/save"></dcc-trigger>
<dcc-trigger label="Restart" action="state/reset"></dcc-trigger>

Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Árvore" action="type/tree"
                   image="images/cell/tree01.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Balão" action="type/balloon"
                   image="images/cell/balloon01.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-yellow.svg">
      </dcc-trigger>
   </div>
</div>

<dcc-timer cycles="100000" interval="1000" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/reset" role="reset"></subscribe-dcc>`
);
})();