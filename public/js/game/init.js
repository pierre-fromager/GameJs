console.info('Game init');

/**
 * Terrain - Definition
 **/

/**
 * map01 - Sample Terrain
 **/
var map01 = [
      'b','b','b','b','b','b','i','b','b','b'
    , 'b','n','n','e','e','e','e','e','e','b'
    , 'b','d','n','e','e','e','e','e','e','b'
    , 'b','n','n','e','e','e','e','e','e','b'
    , 'b','n','d','e','e','e','e','e','e','b'
    , 'b','w','w','e','e','w','w','w','w','b'
    , 'b','e','e','e','e','e','w','e','e','b'
    , 'b','n','e','e','e','e','e','e','t','b'
    , 'b','e','e','e','e','w','e','e','e','b'
    , 'b','o','b','b','b','b','b','b','b','b'
];

/**
 * map02 - Sample Terrain
 **/
var map02 = [
      'b','b','b','b','b','b','i','b','b','b'
    , 'b','e','e','e','e','e','e','w','d','b'
    , 'b','n','e','e','e','e','e','w','e','b'
    , 'b','n','e','e','e','e','e','w','e','b'
    , 'b','e','e','e','e','e','e','n','e','b'
    , 'b','e','e','e','e','w','w','w','e','b'
    , 'b','e','e','e','e','e','w','w','d','b'
    , 'b','e','e','e','t','e','e','w','d','b'
    , 'b','e','e','e','e','w','e','e','t','b'
    , 'b','o','b','b','b','b','b','b','b','b'
];

/**
 * map03 - Sample Terrain
 * 
 **/
var map03 = [
    'b','b','b','b','b','b','b','b','i','b'
    , 'b','e','w','e','e','e','e','n','e','b'
    , 'b','n','w','e','e','e','e','n','e','b'
    , 'b','n','e','e','e','e','e','n','e','b'
    , 'b','e','w','e','e','e','e','n','e','b'
    , 'b','w','w','w','e','w','w','w','w','b'
    , 'b','e','e','e','e','e','w','d','d','b'
    , 'b','n','w','e','t','e','e','d','d','b'
    , 'b','e','e','e','e','w','e','e','e','b'
    , 'b','o','b','b','b','b','b','b','b','b'
];

/**
 * map04 - Sample Terrain
 * 
 **/
var map04 = [
    'b','i','b','b','b','b','b','b','b','b'
    , 'b','e','w','w','w','e','e','e','e','b'
    , 'b','e','e','e','e','e','e','e','e','b'
    , 'b','e','w','w','e','e','e','e','e','b'
    , 'b','e','w','e','e','e','e','e','e','b'
    , 'b','e','e','e','e','e','e','e','e','b'
    , 'b','e','e','e','e','e','e','e','e','b'
    , 'b','e','e','e','e','e','e','e','e','b'
    , 'b','e','e','e','e','e','e','e','e','b'
    , 'b','b','b','b','b','b','b','b','o','b'
];

/**
 *  Maps management
 *  
 *  we select a random terrain map
 **/
var maps = [map01, map02, map03, map04];
var randomMapId = Math.floor(Math.random() * maps.length);
var terrainId = 'terrain0' +  randomMapId;

/**
 *  Terrain options definition
 *  
 **/
var terrainOptions = {
    id : terrainId
    , title : 'Terrain ' + randomMapId
    , className : 'terrains'
    , elementsClassName : 'element'
    , map : maps
    , questElements : ['n','d','e','t']
};
var terrain = new Terrain(terrainOptions);

/**
 * Characters - Definition
 **/
var cWidth = 60;
var cHeight = cWidth;

var characterOptions = {
    id : 'mushroom01'
    , name : 'smallMushroom'
    , className : 'character m walking'
    , kind : 'm'
    , x : 1
    , y : 1
    , width : 60
    , height : 60
    , terrainId : terrainId
    , movement : walking
    , direction : goRight
    , learning : 5
    , allowedDirections : [goUp, goDown, goRight, goLeft]
    , allowedMovements : [walking, staying, running, climbing]
    , controller : null
    , scale : 1
    , isPlayer : false
    , life : 3
}
// First character mushroom
var mushroom = new Character(characterOptions);
// End of mushroom character
            
// Second character megamushroom reuse characterOptions
characterOptions.id = 'mushroom02';
characterOptions.name = 'megaMushroom'
characterOptions.className = 'character g walking';
characterOptions.kind = 'g';
characterOptions.allowedDirections = [goRight, goLeft]
characterOptions.x = 6;
characterOptions.y = 2;
characterOptions.allowedMovements = [walking,staying];
characterOptions.controller = null;
characterOptions.learning = 2;
characterOptions.moveableElements = ['e'];
var megamushroom = new Character(characterOptions);

// Goomba reuse characterOptions
characterOptions.id = 'goomba01';
characterOptions.name = 'Goomba'
characterOptions.className = 'character x walking';
characterOptions.kind = 'x';
characterOptions.allowedDirections = [goUp, goDown]
characterOptions.x = 5;
characterOptions.y = 5;
characterOptions.allowedMovements = [walking,staying,running];
characterOptions.controller = null;
characterOptions.keyboardMapping = null;
characterOptions.learning = 3;
characterOptions.moveableElements = ['e'];
var goomba = new Character(characterOptions);
// End of elctrabell character

// electraBell reuse characterOptions
characterOptions.id = 'bell01';
characterOptions.name = 'electraBell'
characterOptions.className = 'character u walking';
characterOptions.kind = 'u';
characterOptions.allowedDirections = [goUp, goDown, goRight, goLeft]
characterOptions.x = 0;
characterOptions.y = 0;
characterOptions.allowedMovements = [walking,staying,running];
characterOptions.controller = 'keyboard';
characterOptions.keyboardMapping = {
    37 : goLeft
    , 38 : goUp
    , 39 : goRight
    , 40 : goDown
};
characterOptions.learning = 3;
characterOptions.isPlayer = true;
characterOptions.moveableElements = ['e','i','o','t','n','d'];
var electrabell = new Character(characterOptions);
// End of elctrabell character

// pls define player @end
var characters = [
    mushroom
    , megamushroom
    , goomba
    , electrabell
];

console.info(characters.length + ' characters detected.');
var init = function(){
    if (document.location.href.match(/\?debug/)) {
        alert('Debug');
    }
    Audio.setPlaylist(
        [
            'smb_1-up.wav'
            , 'smb_breakblock.wav'
            , 'smb_fireball.wav'
            , 'smb_jump-small.wav'
            , 'smb_mariodie.wav'
            , 'smb_powerup_appears.wav'
            , 'smb_stomp.wav'
            , 'smb_world_clear.wav'
            , 'smb_bowserfalls.wav'
            , 'smb_bump.wav'
            , 'smb_flagpole.wav'
            , 'smb_jump-super.wav'
            , 'smb_pause.wav'
            , 'smb_powerup.wav'
            , 'smb_vine.wav'
            , 'smb_bowserfire.wav'
            , 'smb_coin.wav'
            , 'smb_gameover.wav'
            , 'smb_kick.wav'
            , 'smb_pipe.wav'
            , 'smb_stage_clear.wav'
            , 'smb_warning.wav'
        ]
    );
    Audio.init();
    Audio.enabled = true;
    Info.init('info');
    Scene.setSpeed(1000);
    Scene.setFps(60);
    Scene.terrain = terrain;
    Scene.setTerrainMaps(maps);
    Scene.characters = characters;
    Scene.execute();
    console.info('Scene bindKeyboard.');
    Scene.bindKeyboard();
    console.info('Scene _play.');
    Scene._play();
    console.info('Scene started');
}

