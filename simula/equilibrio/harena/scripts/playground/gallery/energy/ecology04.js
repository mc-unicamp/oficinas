(function() {
insertSource(
"Tiny Earth - Movement, Replication, and Predation",
`<dcc-space-cellular id="cellular-space" cell-width="32" cell-height="32" background-color="#aaffaa">
__c_____h___hhc____h
_____t____t____r____
________w________h__
h__c_twwwww___t_____
___t_wwwwwww______c_
____h__wwwwwtt__t___
c_t______wwr_____r__
_____c______t_______
_h_____r______hc____
</dcc-space-cellular>

<dcc-cell-color type="w" label="water" color="#0000ff"></dcc-cell-color>
<dcc-cell-image type="r" label="rock" image="images/cell/rock01.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tree"image="images/cell/tree01.svg"></dcc-cell-image>

<dcc-cell-image type="c" label="carnivore" image="images/cell/carnivorous-dinosaur.svg">
</dcc-cell-image>

<dcc-cell-image type="h" label="herbivore" image="images/cell/brontosaurus.svg">
</dcc-cell-image>

<rule-dcc-cell-pair label="carnivore eat and replicates" probability="30" transition="ch>cc">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="herbivore replicates" probability="50" transition="h_>hh">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="herbivore dies" probability="10" transition="h?>_?">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="carnivore dies" probability="10" transition="c?>_?">
   ___
   _*_
   ___
</rule-dcc-cell-pair>

<dcc-trigger label="Next" action="state/next"></dcc-trigger>
<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>

<dcc-timer cycles="1000" interval="500" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>`
);
})();