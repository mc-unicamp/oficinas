(function () {
  insertSource(
    'Falling Rocks (simple movement)',
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" grid>
r__r_r
__r_r_
______
______
t_t__t
</dcc-space-cellular-editor>

<dcc-cell-image type="r" label="rock" image="images/cell/rock01.svg">
</dcc-cell-image>
<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>

<rule-dcc-cell-pair label="fall" probability="100" transition="r_>_r">
___
___
_*_
</rule-dcc-cell-pair>

<dcc-button label="Next" topic="state/next"></dcc-button>
<dcc-button label="Play" topic="timer/start"></dcc-button>

<dcc-button label="Empty" topic="type/empty"></dcc-button>
<dcc-button label="Rock" topic="type/rock"></dcc-button>
<dcc-button label="Tree" topic="type/tree"></dcc-button>

<dcc-timer cycles="10" interval="1000" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="type/#" role="type"></subscribe-dcc>`
  )
})()
