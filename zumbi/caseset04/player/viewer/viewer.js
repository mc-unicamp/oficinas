class Zoom {

start() {
  this.imageZoom = this.imageZoom.bind(this);
  this.zoomInClicked = this.zoomInClicked.bind(this);
  this.zoomSameClicked = this.zoomSameClicked.bind(this);
  this.zoomOutClicked = this.zoomOutClicked.bind(this);
  this.nextClicked = this.nextClicked.bind(this);
  this.zoomEnd = this.zoomEnd.bind(this);

  this._zoomImage = document.querySelector("#zoom-image");
  this._zoomImage.addEventListener("click", this.imageZoom, false);
  this._zoomImage.addEventListener("animationend", this.zoomEnd, false);

  this._buttonZoomIn = document.querySelector("#button-in");
  this._buttonZoomIn.addEventListener("click", this.zoomInClicked, false);

  this._buttonZoomSame = document.querySelector("#button-same");
  this._buttonZoomSame.addEventListener("click", this.zoomSameClicked, false);

  this._buttonZoomOut = document.querySelector("#button-out");
  this._buttonZoomOut.addEventListener("click", this.zoomOutClicked, false);

  this._buttonNext = document.querySelector("#button-next");
  this._buttonNext.addEventListener("click", this.nextClicked, false);

  this._zoomImage.addEventListener("click", this.imageZoomIn, false);

  this._dimensions = this.screenDimensions();
  this._shiftX = 0;
  this._shiftY = 0;
  this._scale = 1;
  this._buttonState = 1;
  this._storyCounter = 1;

  this._pathPos = 0;
  this._lastScale = 1;
  this._lastTransX = 0;
  this._lastTransY = 0;
}

zoomInClicked() {
  this._buttonZoomIn.style.display = "none";
  this._buttonZoomSame.style.display = "inline";
  this._buttonState = 2;
}

zoomSameClicked() {
  this._buttonZoomSame.style.display = "none";
  this._buttonZoomOut.style.display = "inline";
  this._buttonState = 3;
}

zoomOutClicked() {
  this._buttonZoomOut.style.display = "none";
  this._buttonZoomIn.style.display = "inline";
  this._buttonState = 1;
}

nextClicked() {
  const next = Zoom.path[this._pathPos];
  const scale = next[0];
  const transX = next[1] * this._dimensions.width / 1299;
  const transY = next[2] * this._dimensions.height / 630;

  this.zoomTo(scale, transX, transY);
  this._pathPos++;
}

zoomTo(scale, transX, transY) {
  if (scale <= 32)
    this.zoomToAnim(scale, transX, transY);
  else
    this.zoomToStraight(scale, transX, transY);

  this._lastScale = scale;
  this._lastTransX = transX;
  this._lastTransY = transY;
}

zoomToStraight(scale, transX, transY) {
  this._zoomImage.style.transform =
    "scale(" + scale +
    ") translate(" + transX + "px," + transY + "px)";
}

zoomToAnim(scale, transX, transY) {
  let rule = this.findKeyframesRule("image-anim");

  rule.appendRule("100% {transform: scale(" + scale +
                    ") translate(" + transX + "px," +
                    transY + "px)}");

  this._zoomImage.classList.add("image-zoom");
}

zoomEnd() {
   this.zoomToStraight(this._lastScale,
                       this._lastTransX, this._lastTransY);
   this._zoomImage.classList.remove("image-zoom");
}

imageZoom(event) {
  const transX = this._lastTransX +
    ((this._dimensions.width / 2) - event.clientX) / this._lastScale;
  const transY = this._lastTransY +
    ((this._dimensions.height / 2) - event.clientY) / this._lastScale;

  const scale = (this._buttonState == 1)
    ? this._lastScale * 2
    : (this._buttonState == 3)
      ? this._lastScale / 2
      : this._lastScale;
  console.log("scale(" + scale +
    ") translate(" + transX + "px," + transY + "px)");
  this.zoomTo(scale, transX, transY);
}

screenDimensions() {
  let dimensions = {
     left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
     top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
     width: (window.innerWidth)
               ? window.innerWidth
               : (document.documentElement.clientWidth)
                  ? document.documentElement.clientWidth
                  : screen.width,
     height: (window.innerHeight)
                ? window.innerHeight
                : (document.documentElement.clientHeight)
                   ? document.documentElement.clientHeight
                   : screen.height,
     };
  dimensions.zoom = dimensions.width / window.screen.availWidth;
  return dimensions;
}

findKeyframesRule(rule) {
  console.log(rule);
  let ss = document.styleSheets;
  for (let i = 0; i < ss.length; i++) {
    console.log(ss[i]);
    for (let j = 0; j < ss[i].cssRules.length; j++) {
      if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && 
      ss[i].cssRules[j].name == rule) { 
        return ss[i].cssRules[j]; }
    }
  }
  return null;
}

}

(function() {

   Zoom.path = [[8, 373, 195],
                [8, 373, 70],
                [8, 149, 66],
                [1, 0, 0],
                [8, -228, 203],
                [8, -238, 75],
                [8, -235, -59],
                [8, -80, -82],
                [1, 0, 0],
                [8, 320, -191]];

   Zoom.instance = new Zoom();
})();