# GameJs

2D Fast Javascript Game Engine with concise sample.

Description :

* Sample Game is SMario alike.
* No HTML5 Canvas , Dom used only.
* Css3 transformations transitions as scale, keyframes...; sprite defined by simple block background.
* No extra dependancies js framework required.
* Js resources loaded from Html page.

Organisation :

* Root tree contains 2 html files (index for small, big for big maze).
* All js and css resources in \public folder.
* All css in css folder.
* All extras prototypes in js\lib dir.
* All engine's prototypes in js\engine dir.
* Audios asset in asset\audio.
* Init js files in js\game.

Engine resources :

* Terrain (Manual mapped or automatic mazed designed - Instanciation).
* Character (Identified by an id and a kind - Instanciation).
* Scene (Federate Terrains and Characters cycle through rules - Static).
* Info (Player infos manager).
* Audio (Webaudio - Static).
* Direction (Directions type manager - Strategy).
* Movement (Movement ans speed type manager - Strategy).
* Key (Keyboard manager - Static).
* Ticker (Fast timer - Singleton).

Concept :

* One Terrain by level.
* Terrain contains elements such as empty (e) or questable.
* Terrain has 1 entrance and 1 exit.
* N Terrains in Scene.
* N Characters in Scene.
* Character may be a player or an autonoumous cell.
* Autonomous Characters are blind and request terrain for a new position from a random Direction.
* Terrain respond by accept or deny following collide rules.
* Characters have memory and they learn from their errors.
* Autonomous Characters change their own speed from a random Movement.
* Scene on each update sort Characters list by speed.
* Scene skip some ticks timer and give priority to the player.
* Scene is managing each Character as a thread with priority given by speed.
* Scene let the player change level and terrain once quest is reached.
* Character player is controlled by keyboard by direction key.

Initialization :

* init.js (small design with manual terrain).
* initbig.js (large design with map maze based).

Todo :

* Setup Js class Namespacing.
* Implement various controlers to let the player be controled by orientation on mobile device.
* Implement multi players.
* Implement Viewport to detect screen dimensions.
* Find the max Terrain dimensions applying the corresponding scale factor from Viewport.

Compatibility :

* Tested on platform : Andoid, Linux, OsX.
* Working on Firefox, Chrome, Chromium, Iceweasel, Safari.

Bugs :

* Audio may be disabled on unsupported Webaudio browsers.

