(function () {
  AuthorCellManager.instance.insertSource(
    'Aquarium Sliders',
    [],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#d6f0ff" grid>
</dcc-space-cellular-editor>

<dcc-cell-image type="g" label="glass" image="images/cell/glass-block-01.png"></dcc-cell-image>
<dcc-cell-image type="p" label="alga" image="images/cell/alga.svg"></dcc-cell-image>
<dcc-cell-image type="h" label="herbivor" image="images/cell/fish-herbivor-01-right.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="carnivor" image="images/cell/fish-carnivor-01-right.svg"></dcc-cell-image>

<rule-dcc-cell-pair id="alga-dies" label="alga dies" probability="0" transition="pp>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="alga-replicates" label="alga replicates" probability="0" transition="p_>pp">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="nematode-dies" label="nematode dies" probability="0" transition="hh>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="nematode-replicates" label="nematode eat and replicates"
                    probability="0" transition="hp>hh">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="nematode moves" probability="50" transition="h_>_h">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="tardigrade-dies" label="tardigrade dies" probability="0" transition="cc>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="tardigrade-replicates" label="tardigrade eat and replicates"
                    probability="0" transition="ch>cc">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="tardigrade moves" probability="50" transition="c_>_c">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="tardigrade moves" probability="50" transition="cp>pc">
   ***
   *_*
   ***
</rule-dcc-cell-pair>

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
<subscribe-dcc target="cellular-space" topic="state/reset" role="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="var/space_scale/changed" role="scale"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Vidro" topic="type/glass"
                   image="images/cell/glass-block-01.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="alga" topic="type/alga"
                   image="images/cell/alga.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="herbívoro" topic="type/herbivor"
                   image="images/cell/fish-herbivor-01-right.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="carnívoro" topic="type/carnivor"
                   image="images/cell/fish-carnivor-01-right.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nada" topic="type/empty"
                   image="images/cell/cell-blue.svg">
      </dcc-button>
   </div>
</div>
Selecione abaixo a chance de cada um dos eventos:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/alga.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/alga.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="alga_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/alga-dies.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="alga_dies" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/fish-herbivor-01-right.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/fish-herbivor-01-right.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="herbivor_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/fish-herbivor-01-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="herbivor_dies" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/fish-carnivor-01-right.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/fish-carnivor-01-right.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="carnivor_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/fish-carnivor-01-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="carnivor_dies" value="0" index></dcc-slider>
   </div>
</div>

<subscribe-dcc target="alga-replicates" topic="var/alga_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="alga-dies" topic="var/alga_dies/changed" role="probability"></subscribe-dcc>
<subscribe-dcc target="nematode-replicates" topic="var/herbivor_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="nematode-dies" topic="var/herbivor_dies/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-replicates" topic="var/carnivor_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-dies" topic="var/carnivor_dies/changed" role="probability">
</subscribe-dcc>`
  )
})()
