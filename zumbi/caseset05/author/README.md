# Author Platform

Visual front-end platform where the author creates, edits and shares cases.

# Platform Map

* **Main Author Environment** (`author.html` and `js/author.js`) - Main authoring environment, which presents the visual interface and coordinates the authoring activities.

* **Case Navigator** (`js/navigator.js`) - Concentrates routines related to navigation throughout a case. It shows a visual map of knots and enables to visually access and edit them.

* **Miniature Capsule** (`knot-capsule.html` and `js/knot-capsule.js`) - Capsule of a mini running environment created to render a preview of a node inside a iframe miniature.

* **Server Proxy Component** (`js/dcc-author-server-proxy.js` and `js/dcc-author-server-address.js`) - Component following the Digital Content Component (DCC) model responsible for acting as a proxy between the authoring environment and the server. The `js/dcc-author-server-address.js` is only a configuration file that defines the server address.