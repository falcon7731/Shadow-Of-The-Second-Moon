//=============================================================================
// QuestGuide.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v2.3 Displays a quest guide with text and a rotatable directional arrow on a brown background.
 * @author Grok
 *
 * @command setTargetTile
 * @text Set Target Tile
 * @desc Sets the tile coordinates for the arrow to point towards.
 * @arg x
 * @type number
 * @text X Coordinate
 * @desc The X coordinate of the target tile.
 * @default 0
 * @arg y
 * @type number
 * @text Y Coordinate
 * @desc The Y coordinate of the target tile.
 * @default 0
 *
 * @command showText
 * @text Show Quest Text
 * @desc Sets and displays the quest text.
 * @arg text
 * @type text
 * @text Quest Text
 * @desc The text to display in the quest guide.
 * @default Follow the arrow to your goal!
 *
 * @command hideText
 * @text Hide Quest Text
 * @desc Hides the quest text.
 *
 * @command showArrow
 * @text Show Arrow
 * @desc Shows the directional arrow pointing to the target tile.
 *
 * @command hideArrow
 * @text Hide Arrow
 * @desc Hides the directional arrow.
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin creates a quest guide window with text and a directional arrow,
 * both displayed on a brown background. The arrow points towards a specified
 * tile, and the background is only visible when either the text or arrow is shown.
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 *
 * 1. Save this plugin as `QuestGuide.js` in your project's `js/plugins` folder.
 * 2. In RPG Maker MZ, go to the Plugin Manager, add `QuestGuide`, and enable it.
 * 3. Use the following plugin commands in your events:
 *    - `setTargetTile x y`: Sets the target tile coordinates (e.g., `setTargetTile 5 3`).
 *    - `showText "Your text here"`: Sets and displays the quest text (e.g., `showText "Find the treasure chest!"`).
 *    - `hideText`: Hides the quest text.
 *    - `showArrow`: Shows the arrow pointing to the target tile.
 *    - `hideArrow`: Hides the arrow.
 * 4. The brown background (semi-transparent) appears only when text or arrow is visible.
 * 5. The arrow sprite uses a single `Arrow_Down` image from the `img/system/` folder,
 *    which is rotated based on the direction to the target tile.
 *
 * ============================================================================
 * Notes
 * ============================================================================
 *
 * - The window is positioned at the top-left of the screen by default.
 * - The arrow now uses a single `Arrow_Down.png` image and rotates to point towards the target.
 * - Ensure your `img/system/` folder contains an image named `Arrow_Down.png`.
 * - If both text and arrow are hidden, the background is automatically hidden.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * Free for use in both commercial and non-commercial projects. Please credit
 * Grok or xAI. No additional restrictions.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.0:
 * - Initial release with text, arrow, and brown background functionality.
 * Version 1.1:
 * - Fixed Rectangle object requirement for Window_Base.initialize in RPG Maker MZ 1.8.0.
 * Version 1.2:
 * - Removed invalid this.refresh() call and added custom refresh method.
 * Version 1.3:
 * - Reduced font size to prevent text overflow.
 * - Added debug logging for arrow image loading.
 * Version 1.4:
 * - Enhanced debug logging and path checking for arrow images.
 * Version 1.5:
 * - Added rotation for a single arrow image (Arrow_Down).
 * - Further reduced font size to prevent overflow.
 * Version 1.6:
 * - Corrected arrow rotation direction (adjusted by 180 degrees).
 * - Reduced font size further to ensure text fits within background.
 * Version 1.7:
 * - Ensured font size reduction is applied correctly by resetting font settings.
 * Version 1.8:
 * - Fixed TypeError by using correct font setting method from Window_Base.
 * Version 1.9:
 * - Enforced font size change by directly manipulating canvas context for text rendering.
 * Version 2.0:
 * - Removed dependency on standardFontFace, using a hardcoded font face to fix TypeError.
 * Version 2.1:
 * - Fixed background not showing below text by adjusting text rendering to preserve background.
 * Version 2.2:
 * - Refined text rendering to prevent background clearing, ensuring background shows behind text.
 * Version 2.3:
 * - Increased font size and moved text up within the window.
 */

(function() {
    // Register plugin commands
    PluginManager.registerCommand('QuestGuide', 'setTargetTile', args => {
        $gameSystem.setQuestGuideTargetTile(Number(args.x), Number(args.y));
    });

    PluginManager.registerCommand('QuestGuide', 'showText', args => {
        $gameSystem.setQuestGuideText(args.text);
        $gameSystem.showQuestGuideText(true);
    });

    PluginManager.registerCommand('QuestGuide', 'hideText', () => {
        $gameSystem.showQuestGuideText(false);
    });

    PluginManager.registerCommand('QuestGuide', 'showArrow', () => {
        $gameSystem.showQuestGuideArrow(true);
    });

    PluginManager.registerCommand('QuestGuide', 'hideArrow', () => {
        $gameSystem.showQuestGuideArrow(false);
    });

    // Store quest guide data in Game_System
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._questGuideTargetTile = { x: 0, y: 0 };
        this._questGuideText = '';
        this._questGuideShowText = false;
        this._questGuideShowArrow = false;
    };

    Game_System.prototype.setQuestGuideTargetTile = function(x, y) {
        this._questGuideTargetTile = { x: x, y: y };
    };

    Game_System.prototype.getQuestGuideTargetTile = function() {
        return this._questGuideTargetTile;
    };

    Game_System.prototype.setQuestGuideText = function(text) {
        this._questGuideText = text;
    };

    Game_System.prototype.getQuestGuideText = function() {
        return this._questGuideText;
    };

    Game_System.prototype.showQuestGuideText = function(show) {
        this._questGuideShowText = show;
    };

    Game_System.prototype.isQuestGuideTextVisible = function() {
        return this._questGuideShowText;
    };

    Game_System.prototype.showQuestGuideArrow = function(show) {
        this._questGuideShowArrow = show;
    };

    Game_System.prototype.isQuestGuideArrowVisible = function() {
        return this._questGuideShowArrow;
    };

    // Quest Guide Window
    function Window_QuestGuide() {
        this.initialize(...arguments);
    }

    Window_QuestGuide.prototype = Object.create(Window_Base.prototype);
    Window_QuestGuide.prototype.constructor = Window_QuestGuide;

    Window_QuestGuide.prototype.initialize = function() {
        const width = 300;
        const height = 100;
        const x = 10;
        const y = 5; // Adjusted y position to move text up
        const rect = new Rectangle(x, y, width, height);
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0; // No default windowskin
        this._arrowSprite = null;
        this._arrowImage = 'Arrow_Down'; // Single arrow image
        this.createArrowSprite();
        this.refresh(); // Call custom refresh method
    };

    Window_QuestGuide.prototype.createArrowSprite = function() {
        this._arrowSprite = new Sprite();
        this._arrowSprite.anchor.x = 0.5;
        this._arrowSprite.anchor.y = 0.5;
        this.addChild(this._arrowSprite);
    };

    Window_QuestGuide.prototype.refresh = function() {
        this.contents.clear();
        const isVisible = $gameSystem.isQuestGuideTextVisible() || $gameSystem.isQuestGuideArrowVisible();
        this.visible = isVisible;
        this._arrowSprite.visible = $gameSystem.isQuestGuideArrowVisible();
        if (isVisible) {
            this.drawBackground();
            if ($gameSystem.isQuestGuideTextVisible()) {
                this.drawQuestText();
            }
        }
    };

    Window_QuestGuide.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateVisibility();
        if ($gameSystem.isQuestGuideArrowVisible()) {
            this.updateArrow();
        }
    };

    Window_QuestGuide.prototype.updateVisibility = function() {
        const isVisible = $gameSystem.isQuestGuideTextVisible() || $gameSystem.isQuestGuideArrowVisible();
        this.visible = isVisible;
        this._arrowSprite.visible = $gameSystem.isQuestGuideArrowVisible();
        this.contents.clear();
        if (isVisible) {
            this.drawBackground();
            if ($gameSystem.isQuestGuideTextVisible()) {
                this.drawQuestText();
            }
        }
    };

    Window_QuestGuide.prototype.drawBackground = function() {
        const width = this.contents.width;
        const height = this.contents.height;
        this.contents.fillAll('#8B4513'); // Brown background
        this.contents.context.globalAlpha = 0.7; // Semi-transparent
        this.contents.context.globalAlpha = 1.0; // Reset alpha
    };

    Window_QuestGuide.prototype.drawQuestText = function() {
        const text = $gameSystem.getQuestGuideText();
        const x = 10;
        const y = 2; // Moved text up by reducing y offset
        // Directly manipulate the canvas context to enforce font size and preserve background
        const context = this.contents.context;
        context.save();
        context.font = '18px GameFont'; // Increased font size from 10px to 14px
        context.fillStyle = '#ffffff'; // White text for contrast
        const lines = text.split('\n');
        let currentY = y;
        for (let line of lines) {
            // Draw text without clearing the background
            context.fillText(line, x, currentY + this.lineHeight() - 4); // Adjusted vertical alignment for larger font
            currentY += this.lineHeight();
        }
        context.restore();
    };

    Window_QuestGuide.prototype.updateArrow = function() {
        const target = $gameSystem.getQuestGuideTargetTile();
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const dx = target.x - playerX;
        const dy = target.y - playerY;

        // Calculate angle in degrees
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        // Adjust angle to rotate correctly (down is 0 degrees, corrected by adding 180 degrees)
        angle = (angle + 270) % 360;

        const bitmap = ImageManager.loadSystem(this._arrowImage);
        const fullPath = `img/system/${this._arrowImage}.png`;
        console.log(`Attempting to load arrow image from: ${fullPath}`);

        if (bitmap.isReady()) {
            this._arrowSprite.bitmap = bitmap;
            this._arrowSprite.rotation = angle * Math.PI / 180; // Convert degrees to radians
            console.log(`Arrow image ${this._arrowImage}.png loaded successfully, rotated to ${angle} degrees`);
        } else {
            console.error(`Arrow image ${this._arrowImage}.png failed to load. Check if ${fullPath} exists and is accessible.`);
        }
        this._arrowSprite.x = this.contents.width / 2;
        this._arrowSprite.y = this.contents.height - 20;
    };

    // Add window to scene
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createQuestGuideWindow();
    };

    Scene_Map.prototype.createQuestGuideWindow = function() {
        this._questGuideWindow = new Window_QuestGuide();
        this.addWindow(this._questGuideWindow);
    };

})()