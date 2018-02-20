var Invaders = Invaders || {};

Invaders.MainMenuState = {
    create: function ()
    {
        Invaders.music = this.add.audio('backgroundStory');
        Invaders.music.play('', 0, 1, true);

        this.add.sprite(0, 0, 'start-bg');
        var title = this.add.sprite(this.world.width * 0.5, (this.world.height - 300) * 0.5, 'logo');
        title.anchor.set(0.5);
        title.scale.x = 0.1;
        title.scale.y = 0.1;
        this.add.tween(title.scale).to({ x: 1, y: 1 }, 2000, "Linear", true);

        var buttonStart = this.add.button(this.world.width / 2, this.world.height - 150, 'button-start', this.clickStart, this, 1, 0, 2);
        buttonStart.anchor.set(0.5);

        this.camera.flash(0x000000, 500, false);

        //Battle Scene
        this.makeBullets = true;

        this.enemyShip = this.add.sprite(350, 0, 'enemyShip');
        this.enemyShip.scale.setTo(3, 3);
        this.enemyShip.animations.add('capture');
        this.enemyShip.animations.play('capture', 0.5, true);
        this.add.tween(this.enemyShip).to({ y: 600 }, 1000, "Linear", true);
        this.time.events.add(Phaser.Timer.SECOND * 6, function ()
        {
            this.add.tween(this.enemyShip).to({ y: -3000 }, 1000, "Linear", true);
        }, this);

        this.man = this.add.sprite(0, 870, 'man');
        this.man.scale.setTo(0.5, 0.5);
        this.man.animations.add('walking');
        this.man.animations.play('walking', 10, true);
        this.run = this.add.tween(this.man).to({ x: 420 }, 2000, "Linear", true);
        this.run.onComplete.add(function ()
        {
            this.taken = this.add.tween(this.man).to({ y: 770 }, 2000, "Linear", true);
            this.taken.onComplete.add(function ()
            {
                this.man.destroy();
                this.downTween = this.add.tween(this.heroShip).to({ x: 300, y: 300 }, 2000, "Quart.easeOut", true);

                this.time.events.loop(Phaser.Timer.SECOND / 8, function ()
                {
                    if (this.makeBullets)
                    {
                        var bullet = this.add.sprite(this.heroShip.x + 70, this.heroShip.y + 150, 'photon');
                        bullet.rotation = -this.heroShip.rotation;
                        var tween = this.add.tween(bullet).to({ x: this.enemyShip.x + 90, y: this.enemyShip.y + 90 }, 500, "Linear", true);
                        tween.onComplete.add(function ()
                        {
                            bullet.kill();
                        }, this);
                    }
                }, this);
                this.downTween.onComplete.add(function ()
                {
                    this.makeBullets = false;
                    this.heroShip.rotation -= 1.4;
                    this.add.tween(this.heroShip).to({ x: 450, y: -200 }, 3000, "Quart.easeOut", true);
                }, this);
                this.add.tween(this.heroShip.scale).to({ x: 2, y: 2 }, 3000, "Linear", true);
            }, this);
        }, this);

        this.heroShip = this.add.sprite(-50, 0, 'ship');
        this.heroShip.rotation += 0.7;
        //Tween run when man taken above
    },
    clickStart: function ()
    {
        this.camera.fade(0x000000, 200, false);
        this.time.events.add(200, function ()
        {
            this.game.state.start('Story');
        }, this);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/