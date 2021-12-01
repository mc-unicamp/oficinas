(function () {
  insertSource(
    'Rocket (expression)',
`<dcc-space-cellular id="cellular-space" cell-width="50" cell-height="50" grid>
r_________
__________
__________
__________
__________
__________
__________
</dcc-space-cellular>

<dcc-cell-image type="r" label="rock" image="images/cell/rock01.svg">
</dcc-cell-image>
<rule-dcc-cell-expression label="fall" expression="x=x0+t;y=y0+t" transition="r_>_r">
</rule-dcc-cell-expression>

<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>

<dcc-button label="Next" topic="state/next"></dcc-button>
<dcc-button label="Play" topic="timer/start"></dcc-button>

<dcc-timer cycles="10" interval="1000" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>`
  )
})()
