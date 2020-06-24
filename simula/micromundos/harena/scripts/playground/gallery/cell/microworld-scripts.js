(function() {
AuthorCellManager.instance.insertSource(
"Micromundos",
[["empty", "_", {src: "images/cell/cell-blue.svg", width: 25, height: 25, alt: "vazio"}],
 ["alga", "a", {src: "images/cell/alga.svg", width: 25, height: 25, alt: "alga"}],
 ["nematode", "n", {src: "images/cell/nematode.svg", width: 25, height: 25, alt: "nematóide"}],
 ["tardigrade", "t", {src: "images/cell/tardigrade.svg", width: 25, height: 25, alt: "tardígrado"}]],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#d6f0ff" grid>
</dcc-space-cellular-editor>

<dcc-cell-image type="a" label="alga" image="images/cell/alga.svg"></dcc-cell-image>
<dcc-cell-image type="n" label="nematode" image="images/cell/nematode.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tardigrade" image="images/cell/tardigrade.svg"></dcc-cell-image>

<dcc-timer cycles="100000" interval="1000" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/zoom.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="space_scale" min="1" max="100" value="1" index></dcc-slider>
   </div>
</div>

<subscribe-dcc target="cellular-space" topic="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" role="reset"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Alga" action="type/alga"
                   image="images/cell/alga.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nematóide" action="type/nematode"
                   image="images/cell/nematode.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Tardígrado" action="type/tardigrade"
                   image="images/cell/tardigrade.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-blue.svg">
      </dcc-trigger>
   </div>
</div>`
);
})();