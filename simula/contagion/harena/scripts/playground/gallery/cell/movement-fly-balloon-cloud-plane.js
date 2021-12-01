(function () {
  AuthorCellManager.instance.insertSource(
    'Balões, Aviões e Nuvens',
    [['empty', '_', { src: 'images/cell/cell-blue.svg', width: 25, height: 25, alt: 'vazio' }],
      ['balloon', 'b', { src: 'images/cell/balloon01.svg', width: 25, height: 25, alt: 'balão' }],
      ['plane', 'p', { src: 'images/cell/plane01.svg', width: 25, height: 25, alt: 'avião' }],
      ['cloud', 'c', { src: 'images/cell/cloud01.svg', width: 25, height: 25, alt: 'nuvem' }],
      ['tree', 't', { src: 'images/cell/tree01.svg', width: 25, height: 25, alt: 'árvore' }]],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" background-color="#d6f0ffff" grid>
__________
__________
__________
__________
__________
__________
__________
__________
__________
t_________
</dcc-space-cellular-editor>

<dcc-cell-image type="b" label="balloon" image="images/cell/balloon01.svg"></dcc-cell-image>
<dcc-cell-image type="p" label="plane" image="images/cell/plane01.svg"></dcc-cell-image>
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
      <dcc-button label="Árvore" topic="type/tree"
                   image="images/cell/tree01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Balão" topic="type/balloon"
                   image="images/cell/balloon01.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Avião" topic="type/plane"
                   image="images/cell/plane01.svg">
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
</div>`
  )
})()
