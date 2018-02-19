//Sets up game
var Invaders = Invaders || {};

Invaders.game = new Phaser.Game(640, 960, Phaser.AUTO);

Invaders.game.state.add('Boot', Invaders.BootState);
Invaders.game.state.add('Preload', Invaders.PreloadState);
Invaders.game.state.add('Game', Invaders.GameState);
Invaders.game.state.add('MainMenu', Invaders.MainMenuState);
Invaders.game.state.add('Story', Invaders.StoryState);

Invaders.game.state.start('Boot');
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/