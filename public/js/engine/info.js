var Info = {
    instance : null
    , id : ''
    , className : ''
    , level : 0
    , life : 10
    , score : 0
    , speed : 0
    , quest : 0
    , status : 'hidden'
    , color : 'red'
    , message : ''
    , character : null
    , terrain : null
    , scene : null
    , displayMessage : function(){
        Info.instance.innerHTML = this.message;
    }
    , displayPlayer : function() {
        this.message = '<div class="info">'
            + '<p><span class="label">Player </span>' 
            + Info.character.name 
            + '</p>'
            + '<p><span class="label">Energy </span>'
            + Info.character.energy 
            + '</p>'
            + '<p><span class="label">Life </span>'
            + Info.character.life 
            + '</p>'
            + '<p><span class="label">Quests </span>' + Info.quest + '</p>'
            + '<p><span class="label">Level </span>' + (Info.scene.level + 1) 
            + ' / ' + Info.scene.terrainMaps.length 
            + '</p>'
            + '<p><span class="label">Score </span>' + Info.score + '</p>';
        this.displayMessage();
    }
    , init : function(id) {
        Info.id = id;
        Info.instance = document.getElementById(Info.id);
        return Info;
    }
    , update : function(scene, character) {
        Info.scene = scene;
        Info.character = character;
        Info.quest = Info.scene.terrain.countQuestElements();
    }
}