(function() {
AuthorCellManager.instance.insertSource(
"Foguetes",
[["empty", "_", {src: "images/cell/cell-blue.svg", width: 25, height: 25, alt: "vazio"}],
 ["balloon", "b", {src: "images/cell/balloon01.svg", width: 25, height: 25, alt: "balão"}],
 ["plane1", "1", {src: "images/cell/plane01.svg", width: 25, height: 25, alt: "avião 1"}],
 ["plane2", "2", {src: "images/cell/plane02.svg", width: 25, height: 25, alt: "avião 2"}],
 ["plane3", "3", {src: "images/cell/plane03.svg", width: 25, height: 25, alt: "avião 3"}],
 ["rocket", "r", {src: "images/cell/rocket01.svg", width: 25, height: 25, alt: "foguete"}],
 ["flagr", "f", {src: "images/cell/flag-red.svg", width: 25, height: 25, alt: "bandeira vermelha"}],
 ["cloud", "#", {src: "images/cell/cloud01.svg", width: 25, height: 25, alt: "nuvem"}],
 ["tree", "t", {src: "images/cell/tree01.svg", width: 25, height: 25, alt: "árvore"}]],
`<block type="condition"></block>
<block type="velocity"></block>
<block type="acceleration"></block>
<block type="action_agent"></block>
<block type="expression"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cols="950" rows="600"
                            cell-width="1" cell-height="1" background-color="#d6f0ffff" grid>
</dcc-space-cellular-editor>

<dcc-cell-image type="b" label="balloon" image="images/cell/balloon01.svg"></dcc-cell-image>
<dcc-cell-image type="1" label="plane1" image="images/cell/plane01.svg"></dcc-cell-image>
<dcc-cell-image type="2" label="plane2" image="images/cell/plane02.svg"></dcc-cell-image>
<dcc-cell-image type="3" label="plane3" image="images/cell/plane03.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="rocket" image="images/cell/rocket01.svg"></dcc-cell-image>
<dcc-cell-image type="f" label="flagr" image="images/cell/flag-red.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="cloud" image="images/cell/cloud01.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>
<dcc-cell-image type="#" label="cloudb" image="images/cell/cloud01-black.svg"></dcc-cell-image>

<dcc-cell-ruler image="images/icon/target.svg" proportion="10" unit="m">
   <subscribe-dcc topic="ruler/activate" role="activate"></subscribe-dcc>
   <subscribe-dcc topic="ruler/reset" role="reset"></subscribe-dcc>
</dcc-cell-ruler>

<dcc-timer cycles="100000" interval="1" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" role="stop"></subscribe-dcc>
   <subscribe-dcc topic="var/timer_interval/changed" role="interval"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" role="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="space/edit" role="edit"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="space/view" role="view"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="var/space_scale/changed" role="scale"></subscribe-dcc>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:20%; max-width:96px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Régua" action="ruler/activate"
                   image="images/cell/ruler.svg">
      </dcc-trigger>
   </div>
   <div style="flex:20%; max-width:96px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Apagar Régua" action="ruler/reset"
                   image="images/cell/ruler-reset.svg">
      </dcc-trigger>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/clock.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="timer_interval" min="1" max="5000" value="1" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/zoom.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="space_scale" min="1" max="100" value="1" index></dcc-slider>
   </div>
</div>`,
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
      <dcc-trigger label="Foguete" action="type/rocket"
                   image="images/cell/rocket01.svg">
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
</div>
`
);
})();