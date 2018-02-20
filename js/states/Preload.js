var Invaders = Invaders || {};

Invaders.PreloadState = {
	preload: function() {
		/*var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		this.load.setPreloadSprite(preloadProgress);
		*/
		this.preloadResources();
	},
	preloadResources: function() {
		var pack = resources = {
    'image': [
        ['instructions', 'assets/images/instructions_text.png'],
        ['coupon-hundred', 'assets/images/coupon100.jpg'],
        ['coupon-five', 'assets/images/coupon500.jpg'],
        ['coupon-thousand', 'assets/images/coupon1000.jpg'],
        ['start-bg', 'assets/images/start_bg.jpg'],
        ['logo', 'assets/images/si_logo.png'],
        ['photon', 'assets/images/photon2.png'],
		['enemy1b', 'assets/images/enemy1.png'],
		//['enemy2', 'assets/images/enemy2.png'],
		//['enemy3', 'assets/images/enemy3.png'],
		//['enemy4', 'assets/images/enemy4.png'],
		['ship', 'assets/images/ship.png'],
		['space', 'assets/images/space_bg.jpg'],
        ['instructions-background', 'assets/images/instructions_bg.jpg'],
		['background', 'assets/images/background.png'],
		['title', 'assets/images/title.png'],
		['logo-enclave', 'assets/images/logo-enclave.png'],
		['clickme', 'assets/images/clickme.png'],
		['overlay', 'assets/images/overlay.png'],
		['button-beer', 'assets/images/button-beer.png'],
		['particle', 'assets/images/particle.png'],
        ['goo', 'assets/images/goo.png']
	],
	'spritesheet': [
		['enemy1', 'assets/images/enemy1Spritesheet.png', 80, 80, 2],
		['enemy2', 'assets/images/enemy2Spritesheet.png', 80, 80, 2],
		['enemy3', 'assets/images/enemy3Spritesheet.png', 80, 80, 2],
		['enemy4', 'assets/images/enemy4Spritesheet.png', 80, 80, 2],
        ['enemyShip', 'assets/images/mainSpritesheet.png', 80, 160, 4],
        ['man', 'assets/images/player_sprite.png', 128, 150, 7],
        ['button-finish', 'assets/images/button-finish.png', 350, 75],
        ['button-levelone', 'assets/images/button-levelone.png', 350, 75],
        ['button-leveltwo', 'assets/images/button-leveltwo.png', 350, 75],
		['button-levelthree', 'assets/images/button-levelthree.png', 350, 75],
		['button-start', 'assets/images/button-getstart.png', 350, 75],
		['button-continue', 'assets/images/button-continue.png', 180, 180],
		['button-mainmenu', 'assets/images/button-mainmenu.png', 180, 180],
		['button-restart', 'assets/images/button-tryagain.png', 180, 180],
		['button-achievements', 'assets/images/button-achievements.png', 110, 110],
		['button-pause', 'assets/images/button-pause.png', 80, 80],
		['button-audio', 'assets/images/button-sound.png', 80, 80],
		['button-back', 'assets/images/button-back.png', 70, 70]
	],
	'audio': [
		['audio-click', ['assets/audio/audio-button.m4a','assets/audio/audio-button.mp3','assets/audio/audio-button.ogg']],
		['audio-theme', ['assets/audio/game-music.mp3','assets/audio/game-music.ogg']],
        ['counter', ['assets/audio/counter.mp3','assets/audio/counter.ogg']],
        ['laser', ['assets/audio/laser.mp3','assets/audio/laser.ogg']],
        ['explode', ['assets/audio/invaderExplode.mp3','assets/audio/invaderExplode.ogg']],
        ['backgroundStory', ['assets/audio/menu-music.mp3', 'assets/audio/menu-music.mp4', 'assets/audio/menu-music.ogg']],
        ['background', ['assets/audio/game-play-music.mp3', 'assets/audio/game-play-music.mp4', 'assets/audio/game-play-music.ogg']],
        ['prize', ['assets/audio/instant-prize-music.mp3', 'assets/audio/instant-prize-music.mp4', 'assets/audio/instant-prize-music.ogg']]
	]
};
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.state.start('MainMenu');
	}
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/