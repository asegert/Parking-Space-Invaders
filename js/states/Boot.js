var Invaders = Invaders || {};

Invaders.BootState = {
    create: function(){
		this.stage.backgroundColor = '#000000';
		this.load.image('loading-background', 'img/loading-background.png');
		this.load.image('loading-progress', 'img/loading-progress.png');

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('Preload');
	}
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/