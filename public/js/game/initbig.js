/**
 * Viewport
 * 
 */
Viewport.bind();
Viewport.reserve = 0;
Viewport.init();

/**
 * Terrain - Definition
 * 
 * Maps Maze built (one map by Level).
 **/
var tileSize = 60;

var maxTiles = (Viewport.width > Viewport.height) ? Viewport.height  : Viewport.width;

maxTiles = Math.floor(maxTiles / tileSize);

var terrainRows = terrainCols = maxTiles;

var maps = [
    new Maze(terrainRows , terrainCols , 1, 1).map
    , new Maze(terrainRows , terrainCols , 1, 1).map
    , new Maze(terrainRows , terrainCols , 1, 1).map
    , new Maze(terrainRows , terrainCols , 1, 1).map
];

var terrainId = 'terrain00';
var terrainOptions = {
    id : terrainId
    , width : tileSize + ((terrainCols * 2) * tileSize)
    , height : tileSize + ((terrainRows * 2) * tileSize)
    , title : 'Terrain ' + terrainId
    , className : 'terrains'
    , elementsClassName : 'element'
    , map : maps
    , questElements : ['n','d','e','t']
};
var terrain = new Terrain(terrainOptions);

/**
 * Characters - Definition
 * 
 **/
var characterOptions = {
    id : 'mushroom01'
    , name : 'smallMushroom'
    , className : 'character m walking'
    , kind : 'm'
    , width : tileSize
    , height : tileSize
    , terrainId : terrainId
    , movement : walking
    , direction : goRight
    , learning : 5
    , allowedDirections : [goUp, goDown, goRight, goLeft]
    , allowedMovements : [walking, staying, running, climbing, swimming]
    , controller : null
    , scale : 1
    , isPlayer : false
    , life : 5
    , moveableElements : ['e']
    , memoryLimitOptions : {
        'error' : terrainRows * 4
        , 'visited' : terrainRows * 4
    } 
}
var mushroom = new Character(characterOptions);
            
characterOptions.id = 'mushroom02';
characterOptions.name = 'megaMushroom'
characterOptions.className = 'character g walking';
characterOptions.kind = 'g';
characterOptions.learning = 2;
var megamushroom = new Character(characterOptions);

characterOptions.id = 'goomba01';
characterOptions.name = 'Goomba'
characterOptions.className = 'character x walking';
characterOptions.kind = 'x';
var goomba = new Character(characterOptions);


characterOptions.id = 'flower01';
characterOptions.name = 'Flower'
characterOptions.className = 'character f walking';
characterOptions.kind = 'f';
characterOptions.learning = 3;
var flower = new Character(characterOptions);

characterOptions.id = 'dcherry01';
characterOptions.name = 'Cherry'
characterOptions.className = 'character c walking';
characterOptions.kind = 'c';
characterOptions.learning = 3;
var cherry = new Character(characterOptions);

characterOptions.id = 'bell01';
characterOptions.name = 'electraBell'
characterOptions.className = 'character u walking';
characterOptions.kind = 'u';
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

var init = function(){
    console.info('Game init');
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
    Scene.setFps(10);
    Scene.terrain = terrain;
    Scene.setTerrainMaps(maps);
    Scene.characters = [mushroom, megamushroom, goomba,flower, cherry, electrabell];
    Scene.execute();
    Scene.bindKeyboard();
    Scene._play();
}