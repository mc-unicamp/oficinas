(function () {
  insertSource(
    'Micromundos 3',
`<div style="width: 100%; display:flex; flex-direction:row">

<div style="flex:50%">
<dcc-space-cellular-editor id="cellular-space" cell-width="32" cell-height="32" background-color="#ccccff">
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
</dcc-space-cellular-editor>

<dcc-cell-image type="p" label="alga" image="images/cell/alga.svg"></dcc-cell-image>
<dcc-cell-image type="h" label="nematode" image="images/cell/nematode.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="tardigrade" image="images/cell/tardigrade.svg"></dcc-cell-image>

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

<div>
   <dcc-button label="Próximo" topic="state/next"></dcc-button>
   <dcc-button label="Play" topic="timer/start"></dcc-button>
   <dcc-button label="Stop" topic="timer/stop"></dcc-button>
   <dcc-button label="Gravar" topic="state/save"></dcc-button>
   <dcc-button label="Ler" topic="state/load"></dcc-button>
   <dcc-button label="Baixar" topic="state/download"></dcc-button>
</div>
</div>

<div style="flex:50%">
Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="alga" topic="type/alga"
                   image="images/cell/alga.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="nematóide" topic="type/nematode"
                   image="images/cell/nematode.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="tardígrado" topic="type/tardigrade"
                   image="images/cell/tardigrade.svg">
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
   <img src="images/cell/nematode.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/nematode.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="nematode_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/nematode-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="nematode_dies" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/tardigrade.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/tardigrade.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="tardigrade_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/tardigrade-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="tardigrade_dies" value="0" index></dcc-slider>
   </div>
</div>

<dcc-timer cycles="100000" interval="500" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="alga-replicates" topic="var/alga_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="alga-dies" topic="var/alga_dies/changed" role="probability"></subscribe-dcc>
<subscribe-dcc target="nematode-replicates" topic="var/nematode_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="nematode-dies" topic="var/nematode_dies/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-replicates" topic="var/tardigrade_replicates/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-dies" topic="var/tardigrade_dies/changed" role="probability">
</subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/load" role="load"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/download" role="download"></subscribe-dcc>

</div>
</div>`
  )
})()
