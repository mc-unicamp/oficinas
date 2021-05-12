(function () {
  const localTheme = `
<div class="styn-note">
   <div class="styn-control-button">
      <dcc-button topic="knot/</navigate" label="Previous Knot" image="../themes/minimal/images/icon-back.svg"></dcc-button>
   </div>

   <div class="styt-pul-main">{knot}</div>
</div>
`

  MessageBus.int.publish('control/theme/note/load/ready', localTheme)
})()
