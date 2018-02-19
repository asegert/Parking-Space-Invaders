var Invaders = Invaders || {};

Invaders.StoryState = {
    create: function ()
    {
        this.instructionBg = this.game.add.image(0, 0, 'instructions-background');
        this.instructionText = this.game.add.image(this.world.width / 2, 180, 'instructions');
        this.instructionText.anchor.x = 0.5;
        this.instructionText.scale.x = 0.1;
        this.instructionText.scale.y = 0.1;

        var buttonContinue = this.add.button(this.world.width - 20, this.world.height - 150, 'button-levelone', this.clickContinue, this, 1, 0, 2);

        buttonContinue.anchor.set(0.5);
        buttonContinue.x = this.world.width + buttonContinue.width + 20;

        this.add.tween(this.instructionText.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Exponential.Out, true, 500);
        this.add.tween(buttonContinue).to({ x: this.world.width / 2 }, 500, Phaser.Easing.Exponential.Out, true, 750);

        this.camera.flash(0x000000, 500, false);
    },
    clickContinue: function ()
    {
        this.camera.fade(0x000000, 200, false);
        this.time.events.add(200, function ()
        {
            this.game.state.start('Game');
        }, this);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/