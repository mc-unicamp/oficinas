(function() {
AuthorCellManager.instance.insertSource(
"Dois Aviões",
[["empty", "_", {src: "images/cell/cell-blue.svg", width: 25, height: 25, alt: "vazio"}],
 ["balloon", "b", {src: "images/cell/balloon01.svg", width: 25, height: 25, alt: "balão"}],
 ["plane1", "1", {src: "images/cell/plane01.svg", width: 25, height: 25, alt: "avião 1"}],
 ["plane2", "2", {src: "images/cell/plane02.svg", width: 25, height: 25, alt: "avião 2"}],
 ["plane3", "3", {src: "images/cell/plane03.svg", width: 25, height: 25, alt: "avião 3"}],
 ["flagr", "r", {src: "images/cell/flag-red.svg", width: 25, height: 25, alt: "bandeira vermelha"}],
 ["cloud", "c", {src: "images/cell/cloud01.svg", width: 25, height: 25, alt: "nuvem"}],
 ["tree", "t", {src: "images/cell/tree01.svg", width: 25, height: 25, alt: "árvore"}]],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" background-color="#d6f0ffff" grid>
___________
___________
___________
___________
___________
___________
___________
___________
___________
t__________
</dcc-space-cellular-editor>

<dcc-cell-image type="b" label="balloon" image="images/cell/balloon01.svg"></dcc-cell-image>
<dcc-cell-image type="1" label="plane1" image="images/cell/plane01.svg"></dcc-cell-image>
<dcc-cell-image type="2" label="plane2" image="images/cell/plane02.svg"></dcc-cell-image>
<dcc-cell-image type="3" label="plane3" image="images/cell/plane03.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="flagr" image="images/cell/flag-red.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="cloud" image="images/cell/cloud01.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>

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
      <dcc-trigger label="Avião 1" action="type/plane1"
                   image="images/cell/plane01.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Avião 2" action="type/plane2"
                   image="images/cell/plane02.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Avião 3" action="type/plane3"
                   image="images/cell/plane03.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Bandeira Vermelha" action="type/flagr"
                   image="images/cell/flag-red.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nuvem" action="type/cloud"
                   image="images/cell/cloud01.svg">
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