(function() {
insertSource(
"Water Flow Editor",
`<div style="width: 100%; display:flex; flex-direction:row">

<div style="flex:50%">

<dcc-space-cellular-editor id="cellular-space" rows="30" cols="30" cell-width="10" cell-height="10" grid>
_
_
_
_
_
___#___________w
</dcc-space-cellular-editor>

<dcc-cell-color type="w" label="water" color="#0000ff" opacity="10">
  <property-dcc name="value" initial="1000"></property-dcc>
</dcc-cell-color>
<dcc-cell-color type="#" label="wall" color="#9b3234"></dcc-cell-color>
<rule-dcc-cell-flow label="spread random 1" probability="100" transition="w_>ww" flow="-1">
   ***
   *_*
   ***
</rule-dcc-cell-flow>
<rule-dcc-cell-flow label="spread random 2" probability="100" transition="ww>ww" flow="-+">
   ***
   *_*
   ***
</rule-dcc-cell-flow>

<div>
   <dcc-trigger label="Próximo" action="state/next"></dcc-trigger>
   <dcc-trigger label="Play" action="timer/start"></dcc-trigger>
   <dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>
   <dcc-trigger label="Gravar" action="state/save"></dcc-trigger>
   <dcc-trigger label="Ler" action="state/load"></dcc-trigger>
   <dcc-trigger label="Baixar" action="state/download"></dcc-trigger>
</div>
</div>

<div style="flex:50%">
Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Água" action="type/water"
                   image="images/cell/waves.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Parede" action="type/wall"
                   image="images/cell/wall.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-yellow.svg">
      </dcc-trigger>
   </div>
</div>

<dcc-timer cycles="100000" interval="100" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/load" role="load"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/download" role="download"></subscribe-dcc>

</div>
</div>`
);
})();