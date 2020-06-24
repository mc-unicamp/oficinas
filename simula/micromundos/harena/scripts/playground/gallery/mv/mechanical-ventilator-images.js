function startInsertImageBlocks() {
const imageBlocks =
{
"image_front_base": {
   src: "images/mv/mv-front-base.svg",
   width: "64",
   height: "64",
   alt: "mv front",
   tooltip: "Mechanical ventilator front.",
   color: 200},
"image_screen_off": {
   src: "images/mv/mv-screen-off.svg",
   width: "64",
   height: "64",
   alt: "screen off",
   tooltip: "Screen off.",
   color: 210},
"image_screen_start": {
   src: "images/mv/mv-screen-start.svg",
   width: "64",
   height: "64",
   alt: "start screen",
   tooltip: "Start screen.",
   color: 220},
"image_screen_mode": {
   src: "images/mv/mv-ventilation-mode.svg",
   width: "32",
   height: "32",
   alt: "ventilation mode",
   tooltip: "Ventilation mode screen.",
   color: 230},
"image_mode_options": {
   src: "images/mv/mv-mode-options.svg",
   width: "64",
   height: "64",
   alt: "mode options",
   tooltip: "Ventilation mode options.",
   color: 240},
"image_back_base": {
   src: "images/mv/mv-back-base.svg",
   width: "64",
   height: "64",
   alt: "mv back",
   tooltip: "Mechanical ventilator back.",
   color: 150},
"image_power": {
   src: "images/mv/mv-power.svg",
   width: "32",
   height: "32",
   alt: "power button",
   tooltip: "Power button.",
   color: 160},
"image_power_pressed": {
   src: "images/mv/mv-power-pressed.svg",
   width: "32",
   height: "32",
   alt: "power button pressed",
   tooltip: "Power button pressed.",
   color: 160}
};

ScriptBlocksDCC.s.addImageBlocks(imageBlocks);

return Object.keys(imageBlocks);
}