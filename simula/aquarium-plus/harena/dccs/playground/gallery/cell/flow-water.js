(function () {
  insertSource(
    'Water Flow',
`<dcc-space-cellular id="cellular-space" rows="30" cols="30" cell-width="10" cell-height="10" grid>
_
_
____________####
__________###__###
_________##______##
______####___w____###
_____##_____________######
__####___________________##
_###############__________##
_#_________________________#
##_________________________##
#___________________________#
##_________________________##
_#_________________________#
_##########__________#######
__________##________##
_______####__________####
_______#________________##
_______###_____________##
_________#####______####
_____________########
</dcc-space-cellular>

<dcc-cell-color type="w" label="water" color="#0000ff" opacity="10">
  <property-dcc name="value" initial="500"></property-dcc>
</dcc-cell-color>
<dcc-cell-color type="#" label="wall" color="#9b3234"></dcc-cell-color>
<rule-dcc-cell-flow label="spread random 1" probability="100" transition="w_>ww" flow="-1">
   ***
   *_*
   ***
</rule-dcc-cell-flow>
<rule-dcc-cell-flow label="spread random 2" probability="100" transition="ww>ww" flow="-+">
   ***
   *_*
   ***
</rule-dcc-cell-flow>

<dcc-button label="Next" topic="state/next"></dcc-button>
<dcc-button label="Play" topic="timer/start"></dcc-button>
<dcc-button label="Stop" topic="timer/stop"></dcc-button>

<dcc-timer cycles="500" interval="100" publish="state/next">
   <subscribe-dcc topic="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="state/next" role="next"></subscribe-dcc>`
  )
})()
