(function () {
  AuthorCellManager.instance.insertSource(
    'Boids',
    [['empty', '_', { src: 'images/cell/cell-blue.svg', width: 25, height: 25, alt: 'vazio' }],
      ['boid', 'o', { src: 'images/cell/boid01.svg', width: 25, height: 25, alt: 'boid' }],
      ['flagr', 'f', { src: 'images/cell/flag-red.svg', width: 25, height: 25, alt: 'bandeira vermelha' }],
      ['cloud', '#', { src: 'images/cell/cloud01.svg', width: 25, height: 25, alt: 'nuvem' }],
      ['tree', 't', { src: 'images/cell/tree01.svg', width: 25, height: 25, alt: 'árvore' }]],
`<block type="boid"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" background-color="#d6f0ffff" grid infinite>
_________________
_________________
_________________
_________________
_________________
_________________
_________________
_________________
_________________
_________________
</dcc-space-cellular-editor>

<dcc-cell-image type="o" label="boid" image="images/cell/boid01.svg"></dcc-cell-image>
<dcc-cell-image type="f" label="flagr" image="images/cell/flag-red.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="cloud" image="images/cell/cloud01.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>
<dcc-cell-image type="#" label="cloudb" image="images/cell/cloud01-black.svg"></dcc-cell-image>

<dcc-cell-ruler image="images/icon/target.svg" proportion="10" unit="m">
   <subscribe-dcc topic="ruler/activate" role="activate"></subscribe-dcc>
   <subscribe-dcc topic="ruler/reset" role="reset"></subscribe-dcc>
</dcc-cell-ruler>

<dcc-timer cycles="100000" interval="1000" publish="state/next">
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
      <dcc-button label="Régua" topic="ruler/activate"
                   image="images/cell/ruler.svg">
      </dcc-button>
   </div>
   <div style="flex:20%; max-width:96px; max-height:48px; margin-right:10px">
      <dcc-button label="Apagar Régua" topic="ruler/reset"
                   image="images/cell/ruler-reset.svg">
      </dcc-button>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/clock.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="timer_interval" min="1" max="5000" value="1000" index></dcc-slider>
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
      <dcc-button label="Árvore" topic="type/tree"
                   image="images/cell/tree01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid" topic="type/boid" message="rotate:0"
                   image="images/cell/boid01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 45" topic="type/boid" message="rotate:45"
                   image="images/cell/boid01-045.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 90" topic="type/boid" message="rotate:90"
                   image="images/cell/boid01-090.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 135" topic="type/boid" message="rotate:135"
                   image="images/cell/boid01-135.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 180" topic="type/boid" message="rotate:180"
                   image="images/cell/boid01-180.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 225" topic="type/boid" message="rotate:225"
                   image="images/cell/boid01-225.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 270" topic="type/boid" message="rotate:270"
                   image="images/cell/boid01-270.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Boid 315" topic="type/boid" message="rotate:315"
                   image="images/cell/boid01-315.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Bandeira Vermelha" topic="type/flagr"
                   image="images/cell/flag-red.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nuvem" topic="type/cloud"
                   image="images/cell/cloud01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nada" topic="type/empty"
                   image="images/cell/cell-blue.svg">
      </dcc-button>
   </div>
</div>
`
  )
})()
