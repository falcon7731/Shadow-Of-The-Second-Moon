//==========================================================================
// EliMZ_ExtraMapScroll.js
//==========================================================================

/*:
@target MZ
@base EliMZ_Book

@plugindesc ♦1.2.2♦ Can add extra distance/space to the map scroll.
@author Hakuen Studio
@url https://hakuenstudio.itch.io/extra-map-scroll-for-rpg-maker-mz/rate?source=game

@help
★★★★★ Rate the plugin! Please, is very important to me ^^
● Terms of Use
https://www.hakuenstudio.com/terms-of-use-5-0-0

============================================================================
Features
============================================================================

● Adds extra tile space for the map to scroll.

============================================================================
How to use
============================================================================

https://docs.google.com/document/d/1yEOpQcTHyXGOfx0hQFO1Cg2tDriLMy6X9syHqf0wiKY/edit?usp=sharing

============================================================================

@param distanceX
@text The X distance off screen
@type number
@desc Choose the default extra X scroll distance.
@default 2

@param distanceY
@text The Y distance off screen
@type number
@desc Choose the default extra Y scroll distance.
@default 6

@param alwaysActive
@text Always Active
@type boolean
@desc If true, the plugin will always be enabled, without the need of setting note tags.
@default true

*/

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_ExtraMapScroll = true

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */   
Eli.ExtraMapScroll = {

    Parameters: class {
        constructor(parameters){
            this.distanceX = Number(parameters.distanceX)
            this.distanceY = Number(parameters.distanceY)
            this.alwaysActive = parameters.alwaysActive === "true"
        }
    },

    initialize(){
        this.initParameters()
    },

    initParameters(){
        this.parameters = new this.Parameters(PluginManager.parameters("EliMZ_ExtraMapScroll"))
    },

    getParam(){
        return this.parameters
    },

    calculateScreenTileX(){
        return Math.round((Graphics.width / $gameMap.tileWidth()) * 16) / 16
    },
    
    calculateScreenTileY(){
        return Math.round((Graphics.height / $gameMap.tileHeight()) * 16) / 16
    },

    calculateExtraScroll(){
        let extraScroll = $dataMap.meta.ExtraScroll

        if(extraScroll){
            extraScroll = extraScroll.split(',').map(coord => Number(coord))
            
        }else{
            const {distanceX, distanceY} = this.getParam()
            extraScroll = [distanceX, distanceY]
        }

        return {x: extraScroll[0], y: extraScroll[1]}
    }

}

{

const Alias = Eli.ExtraMapScroll.alias
const Plugin = {}

Plugin.initialize()

/* -------------------------------- GAME MAP -------------------------------- */
Alias.Game_Map_initialize = Game_Map.prototype.initialize
Game_Map.prototype.initialize = function(){
    this.extraScroll = {x: 0, y: 0}
    Alias.Game_Map_initialize.call(this)
}

Alias.Game_Map_setup = Game_Map.prototype.setup
Game_Map.prototype.setup = function(mapId){
    Alias.Game_Map_setup.call(this, mapId)
    if(this.canExtraScroll()){
        this.setupExtraScroll()
    }
}

Game_Map.prototype.canExtraScroll = function(){
    return $dataMap.meta.ExtraScroll || Plugin.param().alwaysActive
}

Game_Map.prototype.setupExtraScroll = function(){
    this._screenTileX = Plugin.calculateScreenTileX()
    this._screenTileY = Plugin.calculateScreenTileY()
    this.extraScroll = Plugin.calculateExtraScroll()
}

Alias.Game_Map_scrollDown = Game_Map.prototype.scrollDown
Game_Map.prototype.scrollDown = function(distance){
    if(this.canUpDownScroll()){
        this.adjustExtraScrollDown(distance)
    }else{
        Alias.Game_Map_scrollDown.call(this, distance)
    }
}

Alias.Game_Map_scrollLeft = Game_Map.prototype.scrollLeft
Game_Map.prototype.scrollLeft = function(distance){
    if(this.canSideScroll()){
        this.adjustExtraScrollLeft(distance)
    }else{
        Alias.Game_Map_scrollLeft.call(this, distance)
    }
}

Alias.Game_Map_scrollRight = Game_Map.prototype.scrollRight
Game_Map.prototype.scrollRight = function(distance){
    if(this.canSideScroll()){
        this.adjustExtraScrollRight(distance)
    }else{
        Alias.Game_Map_scrollRight.call(this, distance)
    }
}

Alias.Game_Map_scrollUp = Game_Map.prototype.scrollUp
Game_Map.prototype.scrollUp = function(distance){
    if(this.canUpDownScroll()){
        this.adjustExtraScrollUp(distance)
    }else{
        Alias.Game_Map_scrollUp.call(this, distance)
    }
}

Game_Map.prototype.canUpDownScroll = function(){
    return !this.isLoopVertical() && this.height() >= this.screenTileY() && 
            this.canExtraScroll()
}

Game_Map.prototype.canSideScroll = function(){
    return !this.isLoopHorizontal() && this.width() >= this.screenTileX() && 
            this.canExtraScroll()
}

Game_Map.prototype.adjustExtraScrollDown = function(distance){
    const [displayY, parallaxY] = this.calculateExtraDisplayYDown(distance)

    this._displayY = displayY
    this._parallaxY += parallaxY
}

Game_Map.prototype.adjustExtraScrollLeft = function(distance){
    const [displayX, parallaxX] = this.calculateExtraDisplayXLeft(distance)

    this._displayX = displayX
    this._parallaxX += parallaxX
}

Game_Map.prototype.adjustExtraScrollRight = function(distance){
    const [displayX, parallaxX] = this.calculateExtraDisplayXRight(distance)

    this._displayX = displayX
    this._parallaxX += parallaxX
}

Game_Map.prototype.adjustExtraScrollUp = function(distance){
    const [displayY, parallaxY] = this.calculateExtraDisplayYUp(distance)

    this._displayY = displayY
    this._parallaxY += parallaxY
}

Game_Map.prototype.calculateExtraDisplayYDown = function(distance){
    const lastDisplayY = this._displayY
    const distanceY = this.height() - this._screenTileY + this.getExtraScrollY()
    const displayY = Math.min(this._displayY + distance, distanceY)
    const parallaxY = this._displayY - lastDisplayY

    return [displayY, parallaxY]
}

Game_Map.prototype.calculateExtraDisplayXLeft = function(distance){
    const lastDisplayX = this._displayX
    const displayX = Math.max(this._displayX - distance, - this.getExtraScrollX())
    const parallaxX = this._displayX - lastDisplayX

    return [displayX, parallaxX]
}

Game_Map.prototype.calculateExtraDisplayXRight = function(distance){
    const lastDisplayX = this._displayX
    const distanceX = this.width() - this._screenTileX + this.getExtraScrollX()
    const displayX = Math.min(this._displayX + distance, distanceX)
    const parallaxX = this._displayX - lastDisplayX

    return [displayX, parallaxX]
}

Game_Map.prototype.calculateExtraDisplayYUp = function(distance){
    const lastDisplayY = this._displayY
    const displayY = Math.max(this._displayY - distance, - this.getExtraScrollY())
    const parallaxY = this._displayY - lastDisplayY

    return [displayY, parallaxY]
}

Game_Map.prototype.getExtraScrollX = function(){
    return this.extraScroll.x
}

Game_Map.prototype.getExtraScrollY = function(){
    return this.extraScroll.y
}

}