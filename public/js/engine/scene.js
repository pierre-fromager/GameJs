var Scene = {
    fps : 1
    , lastUpdate : 0
    , speed : 1000 // 1 cycle/s
    , requestAnimationFrameHandler : null
    , intervalHanler : null
    , running : false
    , paused : false
    , ticks : 0
    , characters : null
    , terrain : null
    , cycleHandle : null
    , ticker : null
    , frames : 0
    , infos : null
    , level : 0
    , terrainMaps : []
    , canExit : false
    , playerKind : null
    , playerId : null
    , gameOver : false
};

Scene.setTerrainMaps = function(maps){
    this.terrainMaps = maps;
}

Scene.setRandomQuests = function() {
    var countEmptyCells = this.terrain.getPosByKind('e').length;
    var distributionRatio = countEmptyCells / 4;
    var quest = {
      'n' : distributionRatio / 4
      , 'd' : distributionRatio / 8
      , 't' : distributionRatio / 16
    };
    var questElements = Object.keys(quest);
    var randomQuestElement = '';
     do {
        questElements.shuffle();
        randomQuestElement = questElements[0];
        QuestElementSum = quest.SumValues();
        if (quest[randomQuestElement] > 0) {
            var ERcood = this.terrain.getRandomPosByKind('e');
            this.terrain.setElementPos(ERcood,randomQuestElement);
            --quest[randomQuestElement];
        } 
    } while (QuestElementSum > 0)
}

Scene.setSpeed = function(speed){
    this.speed = speed;
}

Scene.setFps = function(fps){
    this.fps = fps;
}

Scene.getSpeed = function(){
    return this.speed;
}

Scene.getFps = function(){
    return this.fps;
}

Scene.setCharacters = function(characters){
    this.characters = (characters) ? characters : [];
}

Scene.setLevel = function(level){
    Scene.level = level;
}

Scene.inherit = function(){
    Dom.call(this);
    RandomGen.call(this);
}

Scene.execute = function() {
    if (this.characters.length > 0) {
        Scene.inherit();
        Scene.drawTerrain();
        Scene.drawCharacters();
    } else {
        console.log('No characters defined.');
    }
}

Scene.addCharacter = function(character){
    this.characters.push(character);
}

Scene.drawTerrain = function(){
    Scene.terrain.map = Scene.terrainMaps[Scene.level];
    Scene.terrain.setMatrix();
    Scene.setRandomQuests();
    Scene.terrain.draw();
}

Scene.drawCharacters = function(){
    for (i = 0; i < this.characters.length; i++){
        if (!Scene.characters[i].isPlayer) {
            Scene.characters[i].setPos(this.terrain.getRandomPosByKind('e'));
        } else {
            Scene.playerKind = Scene.characters[i].kind;
            Scene.playerId = i;
            Scene.characters[i].setPos(this.terrain.getNextEntranceCoords());
        }
        Scene.characters[i].draw();
    }
}

Scene.sortCharactersByProperty = function(property, reverse){
    reverse = (reverse) ? reverse : false;
    var moveSmaller = reverse ? 1 : -1;
    var moveLarger = reverse ? -1 : 1;
    this.characters.sort(
        function(c1, c2) {
            if (c1[property] < c2[property]) {
                return moveSmaller;
            }
            if (c1[property] > c2[property]) {
                return moveLarger;
            }
            return 0;
        }
    );
    //Scene.setPlayerId();
}

Scene.setPlayerId = function(){
    //Scene.playerId =
    var c =  this.characters.filter(
            function(k,v){if (k.isPlayer === true){console.log(k,v);return true};}
        );
            console.log('c',c[0].id);
}

Scene.endGame = function(){
    if (Scene.running) {
        Audio.play(20);
        this.getDomId('gameOver').style.display = 'block';
        Scene.running = false;
    }
    Scene._stop();
    console.info('End of game');
    return;
}

Scene.bindKeyboard = function(){
    window.addEventListener('keyup', function(event) {
        Key.onKeyup(event);
    }, false);
    
    window.addEventListener('keydown', function(event) {
        Key.onKeydown(event);
    }, false);
}

Scene.update = function(){
    Scene.getKeyboard();
    if (Scene.paused) {return}
    if (Scene.playerId) {
        Scene.gameOver = (
            (Scene.characters[Scene.playerId].life <= 0) 
            || (Scene.level > Scene.terrainMaps.length)
        );
        if (Scene.gameOver) Scene.endGame()
    }
    if (Scene.running === false){
        Scene._stop();
        return
    }
    var charcatersAmount = Scene.characters.length;
    var frame = (Ticker.instance.frame + 1 % (Scene.fps * Scene.speed));
    if (isNaN(frame)) {
        console.log('Nana');
        return
    }
    //var schedCharacter = (frame % (charcatersAmount * (Scene.terrainMaps.length - Scene.level)) == 0);
    //if (schedCharacter && !Scene.gameOver) {
    //var 
    if (!Scene.gameOver) {
        Scene.sortCharactersByProperty('speed',true);
        for (i = 0; i < charcatersAmount; i++){
            var isSetupCharacters = (Scene.lastUpdate == 0);
            var isPlayer = (Scene.characters[i].isPlayer === true);
            Scene.playerId = (isPlayer) ? i : Scene.playerId;
            if (isSetupCharacters) {
                if (isPlayer) {
                    Scene.characters[i].setPos(this.terrain.getNextEntranceCoords());
                } else {
                    Scene.characters[i].setPos(this.terrain.getRandomPosByKind('e'));
                }
                Scene.terrain.setElementPos(
                    Scene.characters[i].getPos()
                    , Scene.characters[i].kind
                );
            }
            var initialCoords = Scene.characters[i].getPos();
            var movableCoord = Scene.characters[i].requestTerrain();
            var terrainElement = Scene.terrain.getElementPos(
                movableCoord.x
                , movableCoord.y
            );
            var ticker = Math.floor(
                frame % (Scene.characters[i].speed * Math.pow(Scene.characters.length,2 - Scene.level))
            );
            //var speedRatio = 1 + Math.round(Scene.characters[i].speed * 33.3);
            if (isPlayer == false && !ticker == 0) continue;
            var rulesAccept = Scene.characters[i].isMovable(terrainElement);
            movableCoord.accept = rulesAccept;
            movableCoord.element = terrainElement;
            Scene.characters[i].responseTerrain(movableCoord);
            if (rulesAccept) {
                if (initialCoords != movableCoord){
                    --Scene.characters[i].energy;
                }
                //var previousMovableElement = Scene.terrain.getElementPos(movableCoord);
                Scene.terrain.setElementPos(movableCoord, Scene.characters[i].kind);
                Scene.terrain.setElementPos(initialCoords, 'e');
                if (isPlayer) {
                    if (['e','i','o'].indexOf(terrainElement) === -1) {
                        var eatAble = (this.terrain.questElements.indexOf(terrainElement) !== -1);
                        if (eatAble) {
                            var questElementId = Scene.terrain.getElementIdByCoord(movableCoord);
                            this.terrain.setElementClassNameById(
                                questElementId
                                , ' ' + terrainElement
                                , ' ' + this.terrain.emptyElementKind
                            ); 
                            Info.score += 10;
                            Audio.play(0);
                        }
                    }
                    Audio.play(6);
                    Info.update(Scene, Scene.characters[i]);
                    Info.displayPlayer();
                    Scene.canExit = (Info.quest == 0);
                    if (terrainElement == 'o' && Scene.canExit) {
                        Scene.changeTerrain();
                    }
                } 
            } else {
                if (terrainElement == Scene.playerKind) {
                    if (isPlayer) {
                        //Scene.removeCharacter(i);
                        //console.log('Im the player ' + Scene.playerKind);
                    } else {
                        Scene.characters[Scene.playerId].energy -= 50;
                        if (Scene.characters[Scene.playerId].energy <= 0) {
                            Audio.play(11);
                            --Scene.characters[Scene.playerId].life;
                            Scene.characters[Scene.playerId].energy = 1000;
                        }
                        Info.update(Scene, Scene.characters[Scene.playerId]);
                        Info.displayPlayer();
                        Audio.play(9);
                    }
                }
            }
        }
        Scene.lastUpdate = (new Date).getTime();
    }
}

Scene.addCharacter = function(characterOptions){}

Scene.removeCharacter = function(characterId){
    if (characterId > -1) {
        Scene.characters.splice(characterId, 1);
    }
}

Scene.changeCharacter = function(characterId, characterOptions){
    Scene.characters[characterId].hydrate(characterOptions);
}

Scene.getKeyboard = function(){
    if (Key.hasDown()) {                            // Keypressed
        var keyCode = Key.getFirst();
        var keyName = Key.keys[keyCode];
        if (!Key.isMulti()){                        // Single
            if (keyName === 'X') {
                Scene.running = false;
            }
            if (keyName === 'P') {
                Scene.paused = !Scene.paused;
            }
            if (keyName === 'M') {
                Audio.enabled = !Audio.enabled;
            }
            if (keyName === 'O') {
            }
            if (keyName === 'F') {
            }
            if (keyName === 'R') {
            }
            /*
            if (keyName === 'UP') {
            }
            if (keyName === 'DOWN') {
            }
            if (keyName === 'LEFT') {
            }
            if (keyName === 'RIGHT') {
            }*/
            if (keyName === 'SPACE') {
                this.characters[this.playerId].toggleBulletMode();
            }
        } else {                                    // Multi
            if (Key.hasShift()){                    // Shifted
                var shiftedKeyCode = Key.getSecond();
                keyName = Key.keys[shiftedKeyCode];
                if (keyName === 'LEFT') {
                }
                if (keyName === 'RIGHT') {
                }
                if (keyName === 'UP') {
                }
                if (keyName === 'DOWN') {
                }
            }
            if (Key.hasAlt()){                      // Alted
                var altedKeyCode = Key.getSecond();
                keyName = Key.keys[altedKeyCode];
                            
                if (keyName === 'LEFT') {
                }
                if (keyName === 'RIGHT') {
                }
            }
            if (Key.hasCtrl()){                     // Controlled
                var contolledKeyCode = Key.getSecond();
                keyName = Key.keys[contolledKeyCode];
            /*if (keyName === 'LEFT') {
                                Oscilator.amp--;
                            }
                            if (keyName === 'RIGHT') {
                                Oscilator.amp++;
                            }*/
            }
            if (Key.hasApple()){                    // Appled
                var appledKeyCode = Key.getSecond();
                keyName = Key.keys[appledKeyCode];
            /*if (keyName === 'LEFT') {
                                Oscilator.amp--;
                            }
                            if (keyName === 'RIGHT') {
                                Oscilator.amp++;
                            }*/
            }
        }
    }
            
}

Scene.changeTerrain = function(){
    var canChangeTerrain = (Scene.level +1 < Scene.terrainMaps.length)
    if (canChangeTerrain) {
        Audio.play(10);
        ++Scene.level;
        ++Info.level;
        Scene.terrain.map = Scene.terrainMaps[Scene.level];
        Scene.terrain.matrix = [];
        Scene.terrain.setMatrix();
        Scene.setRandomQuests();
        Scene.terrain.removeChildsFromByClassName('character');
        Scene.terrain.refresh();
        Scene.drawCharacters();
    } else {
        Scene.endGame();
    }
}

Scene.run = (function() {
    var loops = 0
    var skipTicks = Scene.getSpeed() / Scene.getFps();
    console.log(Scene.getSpeed() +  '/' +  Scene.getFps());
    console.log('Scene.running' + Scene.running );
    var nextGameTick = (new Date).getTime();
    return function() {
        if (Scene.running === false) {
            return;
        }
        loops = 0;
        while ((new Date).getTime() > nextGameTick) {
            nextGameTick += skipTicks;
            loops++;
            //console.log('compound');
        }
        if (loops && Scene.running) {
            Scene.ticks = (new Date).getTime();
            Scene.update();
            console.log('updated');
        }}
})();

Scene.regulate = function(){
    var loops = 0
    var skipTicks =  1000 / 25;
    var nextGameTick = (new Date).getTime();
    //loops = 0;
    while ((new Date).getTime() > Scene.ticks) {
        nextGameTick += skipTicks;
        loops++;
    }
    if (loops && Scene.running) {
        Scene.ticks = (new Date).getTime();
        Scene.update();
        console.log('updated regulate at ' + Scene.ticks);
    }
}

Scene._play = function(){
    Scene.running = true;
    if (!this.ticker) {
        Ticker.instance = new Ticker(Scene.fps / Scene.speed);
    }
    Ticker.instance.start(this.update, this);
};

Scene._stop = function(){
    Ticker.instance.stop(this.update, this);
    this.ticker = null;
    Scene.running = false;
};
