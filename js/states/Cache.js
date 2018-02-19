var Invaders = Invaders || {};

Invaders.CacheState = {

    create: function ()
    {
        //Clears the Cache before anything needs to be loaded
        this.cache = new Phaser.Cache(this);
        this.load.reset();
        this.load.removeAll();

        this.state.start('Boot');
    }
}
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/