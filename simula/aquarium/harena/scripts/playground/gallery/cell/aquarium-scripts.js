(function () {
  AuthorCellManager.instance.insertSource(
    'Aquarium',
    [['empty', '_', { src: 'images/cell/cell-blue.svg', width: 25, height: 25, alt: 'vazio' }],
      ['alga', 'a', { src: 'images/cell/alga.svg', width: 25, height: 25, alt: 'alga' }],
      ['plant', 'p', { src: 'images/cell/alga-02.svg', width: 25, height: 25, alt: 'alga planta' }],
      ['glass', 'g', { src: 'images/cell/glass-block-01.png', width: 25, height: 25, alt: 'vidro' }],
      ['herbivor1r', 'h', { src: 'images/cell/fish-herbivor-01-right.svg', width: 25, height: 25, alt: 'herbívoro 1' }],
      ['herbivor1l', 'i', { src: 'images/cell/fish-herbivor-01-left.svg', width: 25, height: 25, alt: 'herbívoro 1' }],
      ['carnivor1r', 'r', { src: 'images/cell/fish-carnivor-01-right.svg', width: 25, height: 25, alt: 'carnívoro 1' }],
      ['carnivor1l', 'l', { src: 'images/cell/fish-carnivor-01-left.svg', width: 25, height: 25, alt: 'carnívoro 1' }],
      ['shark1r', 's', { src: 'images/cell/shark-01-right.svg', width: 25, height: 25, alt: 'tubarão 1' }],
      ['shark1l', 't', { src: 'images/cell/shark-01-left.svg', width: 25, height: 25, alt: 'tubarão 1' }],
      ['jelly', 'j', { src: 'images/cell/jellyfish-01.svg', width: 25, height: 25, alt: 'medusa 1' }],
      ['turtle1r', 'y', { src: 'images/cell/turtle-01-right.png', width: 25, height: 25, alt: 'tartaruga 1' }],
      ['turtle1l', 'z', { src: 'images/cell/turtle-01-left.png', width: 25, height: 25, alt: 'tartaruga 1' }]
    ],
`<category name="Ação" colour="210">
  <block type="transform_horizontal"></block>
  <block type="transform_vertical"></block>
</category>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#d6f0ff" grid policy="crescent">
</dcc-space-cellular-editor>

<dcc-cell-image type="a" label="alga" image="images/cell/alga.svg"></dcc-cell-image>
<dcc-cell-image type="p" label="plant" image="images/cell/alga-02.svg"></dcc-cell-image>
<dcc-cell-image type="g" label="glass" image="images/cell/glass-block-01.png"></dcc-cell-image>
<dcc-cell-image type="h" label="herbivor1r" image="images/cell/fish-herbivor-01-right.svg"></dcc-cell-image>
<dcc-cell-image type="i" label="herbivor1l" image="images/cell/fish-herbivor-01-left.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="carnivor1r" image="images/cell/fish-carnivor-01-right.svg"></dcc-cell-image>
<dcc-cell-image type="l" label="carnivor1l" image="images/cell/fish-carnivor-01-left.svg"></dcc-cell-image>
<dcc-cell-image type="s" label="shark1r" image="images/cell/shark-01-right.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="shark1l" image="images/cell/shark-01-left.svg"></dcc-cell-image>
<dcc-cell-image type="j" label="jelly" image="images/cell/jellyfish-01.svg"></dcc-cell-image>
<dcc-cell-image type="y" label="turtle1r" image="images/cell/turtle-01-right.png"></dcc-cell-image>
<dcc-cell-image type="z" label="turtle1l" image="images/cell/turtle-01-left.png"></dcc-cell-image>

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
      <dcc-button label="Alga" topic="type/alga"
                   image="images/cell/alga.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Planta Aquática" topic="type/plant"
                   image="images/cell/alga-02.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Vidro" topic="type/glass"
                   image="images/cell/glass-block-01.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Herbívoro 1" topic="type/herbivor1r"
                   image="images/cell/fish-herbivor-01-right.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Herbívoro 1" topic="type/herbivor1l"
                   image="images/cell/fish-herbivor-01-left.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Carnívoro 1" topic="type/carnivor1r"
                   image="images/cell/fish-carnivor-01-right.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Carnívoro 1" topic="type/carnivor1l"
                   image="images/cell/fish-carnivor-01-left.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Tubarão 1" topic="type/shark1r"
                   image="images/cell/shark-01-right.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Tubarão 1" topic="type/shark1l"
                   image="images/cell/shark-01-left.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Medusa" topic="type/jelly"
                   image="images/cell/jellyfish-01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Tartaruga 1" topic="type/turtle1r"
                   image="images/cell/turtle-01-right.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Tartaruga 1" topic="type/turtle1l"
                   image="images/cell/turtle-01-left.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nada" topic="type/empty"
                   image="images/cell/cell-blue.svg">
      </dcc-button>
   </div>
</div>`
  )
})()
