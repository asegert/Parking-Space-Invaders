var Invaders = Invaders || {};

Invaders.GameState = {
    create: function ()
    {
        this.score = 0;
        this._time = 10;
        this.gamePaused = false;
        this.runOnce = false;
        this.runLevelTwoOnce = false;
        this.runLevelThreeOnce = false;

        this.levelDone = false;
        this.levelOneCompleted = false;
        this.levelTwoCompleted = false;
        this.levelThreeCompleted = false;

        //prep some sounds
        this.laserSfx = this.add.audio('laser');
        this.laserSfx.volume = 0.1;
        this.explodeSfx = this.add.audio('explode');
        this.explodeSfx.volume = 0.1;
        this.counterSfx = this.add.audio('counter');
        this.counterSfx.volume = 0.1;



        //start physics for overlapping/collision
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.spaceBg = this.add.sprite(0, 0, 'space');

        this.invaderGrid = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
    	];

        this.invaders = this.game.add.physicsGroup();

        this.invaders.x = 80;
        this.invaders.y = 80;

        this.invaderTypes = [
            'enemy1',
            'enemy2',
            'enemy3',
            'enemy4'
        ];

        //Grab the weigh and height of the invaders (assumes same size for all tiles)
        this.tileWidth = this.game.cache.getImage('enemy1').width / 2;
        this.tileHeight = this.game.cache.getImage('enemy1').height;

        //setup emmitter gun
        this.bullets;
        this.fireRate = 100;
        this.nextFire = 0;

        this.buildCannon();

        this.game.physics.enable(this.spaceShip, Phaser.Physics.ARCADE);
        this.spaceShip.body.allowRotation = false;

        var fontGameplay = { font: "32px Arial", fill: "#000" };

        this.setTime();
        this.initUI();
        this.initInvaders();

        this.camera.resetFX();
        this.camera.flash(0x000000, 500, false);
    },
    setTime: function ()
    {
        this._time = 15;

        this.currentTimer = this.game.time.create();
        this.currentTimer.loop(Phaser.Timer.SECOND, function ()
        {
            this._time--;
            if (this._time)
            {
                this.textTime.setText('Time:' + (this._time));
            }
            else
            {
                this.timecheckLevelComplete();
            }
        }, this);
        this.currentTimer.start();
    },

    initInvaders: function ()
    {
        Invaders.music.stop();
        Invaders.music.volume = 1;
        Invaders.music = this.add.audio('background');
        Invaders.music.play('', 0, 1, true);

        /*this.massKill = this.add.button(0, 0, 'enemy1b', function ()
        {
        var enemy1Arr = [];
        var enemy2Arr = [];
        var enemy3Arr = [];
        var enemy4Arr = [];
        this.invaders.forEach(function (enemy)
        {
        if (enemy.key == 'enemy1')
        {
        enemy1Arr[enemy1Arr.length] = enemy;
        }
        else if (enemy.key == 'enemy2')
        {
        enemy2Arr[enemy2Arr.length] = enemy;
        }
        else if (enemy.key == 'enemy3')
        {
        enemy3Arr[enemy3Arr.length] = enemy;
        }
        else if (enemy.key == 'enemy4')
        {
        enemy4Arr[enemy4Arr.length] = enemy;
        }
        }, this);

        if (enemy2Arr.length > 0)
        {
        enemy2Arr.forEach(function (enemy)
        {
        this.directHit(null, enemy);
        }, this);
        }
        else if (enemy3Arr.length > 0)
        {
        enemy3Arr.forEach(function (enemy)
        {
        this.directHit(null, enemy);
        }, this);
        }
        else if (enemy4Arr.length > 0)
        {
        enemy4Arr.forEach(function (enemy)
        {
        this.directHit(null, enemy);
        }, this);
        }
        else if (enemy1Arr.length > 0)
        {
        enemy1Arr.forEach(function (enemy)
        {
        this.directHit(null, enemy);
        }, this);
        }
        this.score = this.score - 1000;
        }, this);
        this.massKill.alpha = 0;*/


        //Loop through each column in the grid
        for (var i = 0; i < this.invaderGrid.length; i++)
        {

            //Loop through each position in a specific column, starting from the top
            for (var j = 0; j < this.invaderGrid[i].length; j++)
            {
                var x = j;
                if (j > Math.floor((this.invaderGrid[i].length - 1) / 2))
                {
                    x = (10 + Math.floor((this.invaderGrid[i].length - 1) / 2)) - j;
                }
                //Add the tile to the game at this grid position
                if (x != j)
                {
                    var tile = this.addTile(i, x, false);
                }
                else
                {
                    var tile = this.addTile(i, x, true);
                }
            }
        }
        this.aliveInvadersCount = this.invaders.length;
        // console.log(this.aliveInvadersCount);

        this.game.input.enabled = false;
        var style =
        {
            font: '150px Arial',
            fill: '#ffffff'
        };
        var countdown = this.add.text(this.spaceShip.x, this.spaceShip.y, '', style);
        countdown.anchor.setTo(0.5, 0.5);
        var count = 0;
        var timer = this.time.events.loop(Phaser.Timer.SECOND, function ()
        {
            count++;
            if (count == 5)
            {
                this.game.input.enabled = true;
                this.textTime.alpha = 1;
                countdown.destroy();
            }
            else if (count == 4)
            {
                countdown.setText("Shoot");
            }
            else
            {
                countdown.setText(4 - count);
            }
        }, this);
    },

    addTile: function (x, y, top)
    {
        //Choose a random tile to add
        if (y === 0)
        {
            var innt = 3;
        }
        else if (y >= 1 && y < 4)
        {
            var innt = 0;
        }
        else if (y <= 8)
        {
            var innt = 1;
        }
        else
        {
            var innt = 2;
        }
        var tileToAdd = this.invaderTypes[innt];
        //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
        var tile = this.invaders.create((x * this.tileWidth) + this.tileWidth / 2, 0, tileToAdd);

        //Animate the tile into the correct vertical position
        this.game.add.tween(tile).to({ y: y * this.tileHeight + (this.tileHeight / 2) }, 500, Phaser.Easing.Linear.In, true)

        //Set the tiles anchor point to the center
        tile.anchor.setTo(0.5, 0.5);

        if (innt == 0)
        {
            tile.animations.add('lights');
            tile.animations.play('lights', 7, true);

            this.setTween(tile, 0, false);
        }
        else if (innt == 1)
        {
            tile.animations.add('blink');
            tile.animations.play('blink', 2, true);

            this.setTween(tile, 1, false);
        }
        else if (innt == 2)
        {
            tile.animations.add('waddle');
            tile.animations.play('waddle', 10, true);

            this.setTween(tile, 2, false);
        }
        else
        {
            tile.animations.add('open');
            tile.animations.play('open', 4, true);

            this.setTween(tile, 3, false);
        }

        this.invaders.add(tile);
        return tile;

    },
    setTween: function (tile, tween, remove)
    {
        if (remove)
        {
            if (tile.tween.timer != undefined)
            {
                tile.tween.timer.stop();
            }
            else
            {
                tile.tween.stop();
            }
        }
        /*if (tween === 0)//lights
        {
        var num = 2000 + Math.floor(Math.random() * 1000);
        var upDown = this.game.add.tween(tile).to({ y: 6 * this.tileHeight + (this.tileHeight / 2) }, num, "Linear", true, 0, -1); //Start at 2
        upDown.yoyo(true, num);

        tile.tween = upDown;
        }*/
        if (tween === 1 || tween === 2)//blink + runner
        {
            var fadeIn = this.game.add.tween(tile).to({ alpha: 1 }, 2000, "Linear", true);
            fadeIn.onComplete.add(function ()
            {
                this.game.time.events.repeat(Phaser.Timer.SECOND * Math.round(Math.random() + 4), 10, function ()
                {
                    tile.y = Math.round(Math.random() + 7) * this.tileHeight + (this.tileHeight / 2);
                    tile.x = Math.round(Math.random() * 5) * this.tileWidth + (this.tileWidth / 2);
                }, this, tile);
            }, this);
            tile.tween = fadeIn;
        }
        /*else if (tween === 2)//runner
        {
        var x = tile.x / this.tileWidth - 0.5;
        if (x > 2)
        {
        tile.origX = x * this.tileWidth + this.tileWidth / 2;
        var sideToSide = this.game.add.tween(tile).to({ x: 980 }, (670 * (x + 1)), "Linear", true);
        sideToSide.onComplete.add(function (tile)
        {
        tile.x = -20;
        var returnSideToSide = this.game.add.tween(tile).to({ x: tile.origX }, (670 * 3), "Linear", true);
        returnSideToSide.onComplete.add(function ()
        {
        sideToSide.start();
        }, this);
        }, this);
        }
        else
        {
        tile.origX = x * this.tileWidth + this.tileWidth / 2;
        var sideToSide = this.game.add.tween(tile).to({ x: -20 }, (670 * (x - 2)), "Linear", true);
        sideToSide.onComplete.add(function (tile)
        {
        tile.x = 980;
        var returnSideToSide = this.game.add.tween(tile).to({ x: tile.origX }, (670 * 3), "Linear", true);
        returnSideToSide.onComplete.add(function ()
        {
        sideToSide.start();
        }, this);
        }, this);
        }
        tile.tween = sideToSide;
        }*/
        else//open + lights     
        {
            var x = tile.x / this.tileWidth - 0.5;
            if (x > 2)
            {
                tile.x = -20;
                tile.y = 300;
            }
            else
            {
                tile.x = 980;
                tile.y = 300;
            }
            var goTween = this.game.add.tween(tile).to({ x: (x * this.tileWidth + 0.5), y: 0 }, 2000, "Linear", true, 0, -1);
            goTween.yoyo(true, 500);

            tile.tween = goTween;
        }
    },
    buildCannon: function ()
    {

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'photon');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        this.spaceShip = this.add.sprite(this.world.width / 2, this.world.height / 2, 'ship');
        this.spaceShip.anchor.x = 0.5;
        this.spaceShip.anchor.y = 0.5;

        this.physics.enable(this.spaceShip, Phaser.Physics.ARCADE);
        this.spaceShip.body.allowGravity = false;
        this.spaceShip.body.allowRotation = true;
    },

    fire: function ()
    {
        if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            // gun sound
            this.laserSfx.play('', 0, 1, false);

            this.nextFire = this.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.spaceShip.x - 8, this.spaceShip.y - 8);

            this.game.physics.arcade.moveToPointer(bullet, 1200);
        }

    },

    directHit: function (bullet, invader)
    {
        this.explodeSfx.play('', 0, 1, false);

        // update score text
        if (invader.key == 'enemy1')
        {
            invader.loadTexture('enemy4');
            this.add.tween(invader).to({ y: ((Math.floor((this.invaderGrid.length - 1) / 2) + 1) * invader.texture.height) }, 4000, Phaser.Easing.Bounce.Out, true);
            if (bullet == null)
            {
                this.score += 10;
            }
            else
            {
                this.score += 20;
            }
            invader.animations.add('open');
            invader.animations.play('open', 4, true);

            this.setTween(invader, 3, true);
        } else if (invader.key == 'enemy2')
        {
            invader.loadTexture('enemy1');
            if (bullet == null)
            {
                this.score += 15;
            }
            else
            {
                this.score += 30;
            }
            invader.animations.add('lights');
            invader.animations.play('lights', 7, true);
            this.setTween(invader, 0, true);
        } else if (invader.key == 'enemy3')
        {
            invader.loadTexture('enemy2');
            if (bullet == null)
            {
                this.score += 5;
            }
            else
            {
                this.score += 10;
            }
            invader.animations.add('blink');
            invader.animations.play('blink', 10, true);
            this.setTween(invader, 1, true);
        } else
        {
            if (bullet == null)
            {
                this.score += 20;
            }
            else
            {
                this.score += 40;
            }
            invader.loadTexture('goo');
            this.tween = this.add.tween(invader).to({ y: invader.y + 5 }, 500, "Linear", true);
            this.tween.onComplete.add(function ()
            {
                invader.destroy();
                this.aliveInvadersCount = this.invaders.length;
            }, this);
            this.setTween(invader, 2, true);
        }

        this.textScore.setText('Score:' + this.score);

        if (bullet != null)
        {
            bullet.kill();
        }

    },

    initUI: function ()
    {
        var fontScore = { font: "32px Press Start 2P", fill: "#fff" };
        var fontScoreWhite = { font: "32px Press Start 2P", fill: "#E3F908", align: "center" };
        this.textScore = this.add.text(30, this.world.height - 20, 'Score:' + this.score, fontScore);
        this.textScore.anchor.set(0, 1);

        this.textTime = this.add.text(this.world.width - 30, this.world.height - 20, 'Time:' + (this._time + 5), fontScore);
        this.textTime.anchor.set(1, 1);
        this.textTime.alpha = 0;

        var fontTitle = { font: "48px Press Start 2P", fill: "#E3F908", stroke: "#FFF", align: "center" };
        var fontUnlocked = { font: "24px Press Start 2P", fill: "#E3F908", stroke: "#FFF", align: "center" };


        //  From http://glslsandbox.com/e#18043.4
        var fragmentSrc = [
                            "precision mediump float;",
                            "uniform float     time;",
                            "uniform vec2      resolution;",
                            "uniform vec2      mouse;",
                            "// Posted by Trisomie21",
                            "// modified by @hintz",
                            "// from http://glsl.heroku.com/e#5248.0",
                            "#define BLADES 6.0",
                            "#define BIAS 0.1",
                            "#define SHARPNESS 3.0",

                            "vec3 star(vec2 position, float t)",
                            "{",
                                "float d2D = 4.0 / length(position) + t * 5.0;",
                                "float a2D = atan(position.y, position.x);",
                                "float qq = d2D * 0.1 + sin(d2D) * 0.2 * cos(a2D * 3.0) + sin(d2D * 0.2) * 0.3 * cos(a2D * 8.0)",
                                "+ max(0.0, sin(d2D * 0.1 + 10.0) - 0.5) * cos(a2D * 20.0 + sin(d2D * 0.2) * 5.0)",
                                "+ max(0.0, sin(d2D * 0.03 + 18.0) - 0.5) * cos(a2D * 5.0 + sin(d2D * 0.2) * 5.0);",
                                "vec3 color = vec3(sin(qq * 2.0), sin(qq * 3.0), sin(qq * 5.0));",
                                "color = color * 0.2;",
                                "float blade = clamp(pow(sin(atan(position.y,position.x )*BLADES)+BIAS, SHARPNESS), 0.0, 1.0);",
                                "color += mix(vec3(-0.34, -0.5, -1.0), vec3(0.0, -0.5, -1.0), (position.y + 1.0) * 0.25);",
                                "color += (vec3(0.95, 0.65, 0.30) * 1.0 / distance(vec2(0.0), position) * 0.075);",
                                "color += vec3(0.95, 0.45, 0.30) * min(1.0, blade *0.7) * (1.0 / distance(vec2(0.0, 0.0), position)*0.075);",
                                "return color;",
                            "}",
                            "// Tweaked from http://glsl.heroku.com/e#4982.0",
                            "float hash(float n) { return fract(sin(n)*43758.5453); }",

                            "float noise(in vec2 x)",
                            "{",
                                "vec2 p = floor(x);",
                                "vec2 f = fract(x);",
                                "f = f*f*(3.0-2.0*f);",
                                "float n = p.x + p.y*57.0;",
                                "float res = mix(mix(hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+57.0), hash(n+58.0),f.x),f.y);",

                                "return res;",
                            "}",

                            "vec3 cloud(vec2 p)",
                            "{",
                                "float f = 0.0;",
                                "f += 0.50000*noise(p*1.0*10.0);",
                                "f += 0.25000*noise(p*2.0*10.0);",
                                "f += 0.12500*noise(p*4.0*10.0);",
                                "f += 0.06250*noise(p*8.0*10.0);",
                                "f *= f;",

                                "return vec3(f*.65, f*.45, f)*.6;",
                            "}",
                            "const float LAYERS = 7.0;",
                            "const float SPEED  = 0.005;",
                            "const float SCALE  = 8.0;",
                            "const float DENSITY    = 0.5;",
                            "const float BRIGHTNESS = 2.0;",
                            "vec2 ORIGIN    = resolution.xy*.5;",
                            "float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }",

                            "void main(void)",
                            "{",
                                "vec2   pos = gl_FragCoord.xy - ORIGIN;",
                                "float dist = length(pos) / resolution.y;",
                                "vec2 coord = vec2(pow(dist, 0.1), atan(pos.x, pos.y) / (3.1415926*2.0));",
                                "// Nebulous cloud",
                                "vec3 color = cloud(pos/resolution);",

                                "// Background stars",
                                "float a = pow((1.0-dist), 20.0);",
                                "float t = time*-0.05;",
                                "float r = coord.x - (t*SPEED);",
                                "float c = fract(a+coord.y + 0.0*0.543);",
                                "vec2  p = vec2(r, c*0.5)*4000.0;",
                                "vec2 uv = fract(p)*2.0-1.0;",
                                "float m = clamp((rand(floor(p))-0.9)*BRIGHTNESS, 0.0, 1.0);",
                                "color +=  clamp((1.0-length(uv*2.0))*m*dist, 0.0, 1.0);",

                                "// Flying stars into black hole",
                                "for (float i = 1.0; i < (LAYERS+1.0); ++i)",
                                "{",
                                    "float a = pow((1.0-dist),20.0);",
                                    "float t = i*10.0 + time*i*i;",
                                    "float r = coord.x - (t*SPEED);",
                                    "float c = fract(a+coord.y + i*.543);",
                                    "vec2  p = vec2(r, c*.5)*SCALE*(LAYERS/(i*i));",
                                    "vec2 uv = fract(p)*2.0-1.0;",
                                    "float m = clamp((rand(floor(p))-DENSITY/i)*BRIGHTNESS, 0.0, 1.0);",
                                    "color +=  clamp(star(uv*0.5, time+i*10.0)*m*dist, 0.0, 1.0);",
                            "}",
                            "gl_FragColor = vec4(color, 1.0);",
                        "}"
                        ];

        filter = new Phaser.Filter(this, null, fragmentSrc);
        filter.setResolution(800, 600);

        this.Bg = this.add.sprite();
        this.Bg.width = Invaders.game.width;
        this.Bg.height = Invaders.game.height;

        this.Bg.filters = [filter];


        this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedText = this.add.text(this.world.width * 0.5, 100, 'Paused', fontTitle);
        this.screenPausedText.anchor.set(0.5, 0);
        this.buttonAudio = this.add.button(this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
        this.buttonAudio.anchor.set(1, 0);
        this.screenPausedBack = this.add.button(150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        this.screenPausedBack.anchor.set(0, 1);
        this.screenPausedContinue = this.add.button(this.world.width - 150, this.world.height - 100, 'button-continue', this.managePause, this, 1, 0, 2);
        this.screenPausedContinue.anchor.set(1, 1);
        this.screenPausedGroup.add(this.screenPausedBg);
        this.screenPausedGroup.add(this.screenPausedText);
        this.screenPausedGroup.add(this.buttonAudio);
        this.screenPausedGroup.add(this.screenPausedBack);
        this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.visible = false;


        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverText = this.add.text(this.world.width * 0.5, 100, 'Game over', fontTitle);
        this.screenGameoverText.anchor.set(0.5, 0);
        this.screenGameoverBack = this.add.button(150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        this.screenGameoverBack.anchor.set(0, 1);
        this.screenGameoverRestart = this.add.button(this.world.width - 150, this.world.height - 100, 'button-restart', this.stateRestart, this, 1, 0, 2);
        this.screenGameoverRestart.anchor.set(1, 1);
        this.screenGameoverScore = this.add.text(this.world.width * 0.5, 300, 'Score: ' + this.score, fontScoreWhite);
        this.screenGameoverScore.anchor.set(0.5, 0.5);
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverText);
        this.screenGameoverGroup.add(this.screenGameoverBack);
        this.screenGameoverGroup.add(this.screenGameoverRestart);
        this.screenGameoverGroup.add(this.screenGameoverScore);
        this.screenGameoverGroup.visible = false;


        //level One complete overlay
        this.screenLevelOneGroup = this.add.group();
        this.screenLevelOneBg = this.Bg;
        this.screenLevelOneText = this.add.text(this.world.width * 0.5, 100, 'LEVEL ONE\nCOMPLETE', fontTitle);
        this.screenLevelOneText.anchor.set(0.5, 0);
        this.screenLevelOneTextUnlocked = this.add.text(this.world.width * 0.5, 400, 'Congratulations!!!\nYou have unlocked', fontUnlocked);
        this.screenLevelOneTextUnlocked.anchor.set(0.5, 0);
        this.screenLevelOneTextUnlocked.alpha = 0;
        // change this to play next level button
        this.screenLevelOneBtn = this.add.button(this.world.width / 2, this.world.height - 150, 'button-leveltwo', this.startLevelTwo, this, 1, 0, 2);
        this.screenLevelOneBtn.anchor.set(0.5);
        this.screenLevelOneBtn.alpha = 0;
        this.screenLevelOneScore = this.add.text(this.world.width * 0.5, 300, 'Score:' + this.score, fontScoreWhite);
        this.screenLevelOneScore.anchor.set(0.5, 0.5);
        this.dealerCoupon = this.add.sprite(this.world.width / 2, 500, 'coupon-hundred');
        this.dealerCoupon.anchor.set(0.5, 0);
        this.dealerCoupon.alpha = 0;

        this.screenLevelOneGroup.add(this.screenLevelOneBg);
        this.screenLevelOneGroup.add(this.dealerCoupon);
        this.screenLevelOneGroup.add(this.screenLevelOneText);
        this.screenLevelOneGroup.add(this.screenLevelOneTextUnlocked);
        this.screenLevelOneGroup.add(this.screenLevelOneBtn);
        this.screenLevelOneGroup.add(this.screenLevelOneScore);
        this.screenLevelOneGroup.visible = false;

        //level Two complete overlay
        this.screenLevelTwoGroup = this.add.group();
        this.screenLevelTwoBg = this.add.sprite(0, 0, 'overlay');
        this.screenLevelTwoText = this.add.text(this.world.width * 0.5, 100, 'LEVEL TWO\nCOMPLETE', fontTitle);
        this.screenLevelTwoText.anchor.set(0.5, 0);
        this.screenLevelTwoTextUnlocked = this.add.text(this.world.width * 0.5, 400, 'Congratulations!!!\nYou have unlocked', fontUnlocked);
        this.screenLevelTwoTextUnlocked.anchor.set(0.5, 0);
        this.screenLevelTwoTextUnlocked.alpha = 0;
        // change this to play next level button
        this.screenLevelThreeBtn = this.add.button(this.world.width / 2, this.world.height - 150, 'button-levelthree', this.startLevelThree, this, 1, 0, 2);
        this.screenLevelThreeBtn.anchor.set(0.5);
        this.screenLevelThreeBtn.alpha = 0;
        this.screenLevelTwoScore = this.add.text(this.world.width * 0.5, 300, 'Score:' + this.score, fontScoreWhite);
        this.screenLevelTwoScore.anchor.set(0.5, 0.5);
        this.dealerCouponTwo = this.add.sprite(this.world.width / 2, 500, 'coupon-five');
        this.dealerCouponTwo.anchor.set(0.5, 0);
        this.dealerCouponTwo.alpha = 0;

        this.screenLevelTwoGroup.add(this.screenLevelTwoBg);
        this.screenLevelTwoGroup.add(this.dealerCouponTwo);
        this.screenLevelTwoGroup.add(this.screenLevelTwoText);
        this.screenLevelTwoGroup.add(this.screenLevelTwoTextUnlocked);
        this.screenLevelTwoGroup.add(this.screenLevelThreeBtn);
        this.screenLevelTwoGroup.add(this.screenLevelTwoScore);
        this.screenLevelTwoGroup.visible = false;

        //level Three complete overlay
        this.screenLevelThreeGroup = this.add.group();
        this.screenLevelThreeBg = this.add.sprite(0, 0, 'overlay');
        this.screenLevelThreeText = this.add.text(this.world.width * 0.5, 100, 'LEVEL THREE\nCOMPLETE', fontTitle);
        this.screenLevelThreeText.anchor.set(0.5, 0);
        this.screenLevelThreeTextUnlocked = this.add.text(this.world.width * 0.5, 400, 'Congratulations!!!\nYou have unlocked', fontUnlocked);
        this.screenLevelThreeTextUnlocked.anchor.set(0.5, 0);
        this.screenLevelThreeTextUnlocked.alpha = 0;
        // change this to play next level button
        this.collectPointsBtn = this.add.button(this.world.width / 2, this.world.height - 150, 'button-finish', this.finishGame, this, 1, 0, 2);
        this.collectPointsBtn.anchor.set(0.5);
        this.collectPointsBtn.alpha = 0;
        this.screenLevelThreeScore = this.add.text(this.world.width * 0.5, 300, 'Score:' + this.score, fontScoreWhite);
        this.screenLevelThreeScore.anchor.set(0.5, 0.5);
        this.dealerCouponThree = this.add.sprite(this.world.width / 2, 500, 'coupon-thousand');
        this.dealerCouponThree.anchor.set(0.5, 0);
        this.dealerCouponThree.alpha = 0;

        this.screenLevelThreeGroup.add(this.screenLevelThreeBg);
        this.screenLevelThreeGroup.add(this.dealerCouponThree);
        this.screenLevelThreeGroup.add(this.screenLevelThreeText);
        this.screenLevelThreeGroup.add(this.screenLevelThreeTextUnlocked);
        this.screenLevelThreeGroup.add(this.collectPointsBtn);
        this.screenLevelThreeGroup.add(this.screenLevelThreeScore);
        this.screenLevelThreeGroup.visible = false;
    },

    finishGame: function ()
    {
        //submit form
        $('#player_score').val(this.score);
        $('#form1').submit();

    },

    timecheckLevelComplete: function ()
    {

        this.levelDone = true;

        if (this.levelOneCompleted == false)
        {
            this.levelOneCompleted = true;
            this.levelOneDone();
        } else if (this.levelOneCompleted == true && this.levelTwoCompleted == false)
        {
            this.levelTwoCompleted = true;
            this.levelTwoDone();
        } else if (this.levelOneCompleted == true && this.levelTwoCompleted == true && this.levelOneCompleted == true)
        {
            this.levelThreeCompleted = true;
            this.levelThreeDone();
        }
    },


    checkLevelComplete: function ()
    {

        this.levelDone = true;

        if (this.levelOneCompleted == false)
        {
            this.levelOneCompleted = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.levelOneDone, this);
        } else if (this.levelOneCompleted == true && this.levelTwoCompleted == false)
        {
            this.levelTwoCompleted = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.levelTwoDone, this);
        } else if (this.levelOneCompleted == true && this.levelTwoCompleted == true && this.levelOneCompleted == true)
        {
            this.levelThreeCompleted = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.levelThreeDone, this);
        }
    },

    levelOneDone: function ()
    {
        Invaders.music.volume = 0.5;
        var prizeSound = this.add.audio('prize');
        prizeSound.play();

        this.stateStatus = 'levelOneOver';
    },
    levelTwoDone: function ()
    {
        Invaders.music.volume = 0.5;
        var prizeSound = this.add.audio('prize');
        prizeSound.play();

        this.stateStatus = 'levelTwoOver';
    },
    levelThreeDone: function ()
    {
        Invaders.music.volume = 0.5;
        var prizeSound = this.add.audio('prize');
        prizeSound.play();

        this.stateStatus = 'levelThreeOver';
    },
    startLevelTwo: function ()
    {
        this.redAlien.destroy();
        this.greenAlien.destroy();
        this.screenLevelTwoGroup.remove(this.screenLevelTwoBg);
        this.screenLevelTwoGroup.addChildAt(this.Bg, 0);
        this.currentTimer.destroy();
        this._time = 10;
        this.textTime.setText('Time:' + (this._time + 5));
        this.setTime();

        this.screenLevelOneGroup.visible = false;

        //need to reload the invaders group with a new grid
        //new grid with mor einvaders
        this.invaderGrid = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ];
        this.initInvaders();
        this.levelDone = false;
    },
    startLevelThree: function ()
    {
        this.redAlien.destroy();
        this.greenAlien.destroy();
        this.blueAlien.destroy();
        this.screenLevelThreeGroup.remove(this.screenLevelThreeBg);
        this.screenLevelThreeGroup.addChildAt(this.Bg, 0);
        this.currentTimer.destroy();
        this._time = 10;
        this.textTime.setText('Time:' + (this._time + 5));
        this.setTime();

        this.screenLevelTwoGroup.visible = false;
        //need to reset the clock
        //need to reload the invaders group with a new grid
        //new grid with mor einvaders
        this.invaderGrid = [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null]
        ];
        this.initInvaders();
        this.levelDone = false;
    },

    update: function ()
    {
        /*if (this.score > 1000 || this.tweenedPoints > 1000)
        {
        this.massKill.input.enabled = true;
        this.massKill.alpha = 1;
        }
        else
        {
        this.massKill.input.enabled = false;
        this.massKill.alpha = 0;
        }*/
        // called every udpdate to see if enemy hit by torpedo
        this.game.physics.arcade.overlap(this.bullets, this.invaders, this.directHit, null, this);

        this.spaceShip.rotation = this.game.physics.arcade.angleToPointer(this.spaceShip);

        if (this.game.input.activePointer.isDown)
        {
            this.fire();
        }

        if (this.aliveInvadersCount < 1 && this.levelDone == false)
        {
            this.checkLevelComplete();
        }

        switch (this.stateStatus)
        {
            case 'paused':
                {
                    if (!this.runOnce)
                    {
                        this.statePaused();
                        this.runOnce = true;
                    }
                    break;
                }
            case 'gameover':
                {
                    if (!this.runOnce)
                    {
                        this.stateGameover();
                        this.runOnce = true;
                    }
                    break;
                }
            case 'levelOneOver':
                {
                    if (!this.runOnce)
                    {
                        this.levelOneComplete();
                        this.runOnce = true;
                    }
                    break;
                }
            case 'levelTwoOver':
                {

                    if (!this.runLevelTwoOnce)
                    {

                        this.levelTwoComplete();
                        this.runLevelTwoOnce = true;
                    }
                    break;
                }
            case 'levelThreeOver':
                {
                    if (!this.runLevelThreeOnce)
                    {
                        this.levelThreeComplete();
                        this.runLevelThreeOnce = true;
                    }
                    break;
                }
            case 'playing':
                {
                    this.statePlaying();
                }
            default:
                {
                }
        }
    },
    managePause: function ()
    {
        this.gamePaused = !this.gamePaused;
        if (this.gamePaused)
        {
            this.stateStatus = 'paused';
        }
        else
        {
            this.stateStatus = 'playing';
            this.runOnce = false;
        }
    },
    statePlaying: function ()
    {
        this.screenPausedGroup.visible = false;
        this.currentTimer.resume();
    },
    statePaused: function ()
    {
        this.screenPausedGroup.visible = true;
        this.currentTimer.pause();
    },
    stateGameover: function ()
    {
        this.screenGameoverGroup.visible = true;
        //this.massKill.destroy();
        this.currentTimer.stop();
        this.gameoverScoreTween();
    },
    levelOneComplete: function ()
    {
        this.screenLevelOneGroup.visible = true;
        this.alienAnimation(1);
        //this.massKill.destroy();
        this.invaders.forEach(function (c) { c.kill(); });
        this.currentTimer.stop();
        this.screenLevelOneScore.setText('Score: ' + this.score);
        this.levelOneScoreTween();
    },
    levelTwoComplete: function ()
    {
        this.screenLevelTwoGroup.visible = true;
        this.alienAnimation(2);
        //this.massKill.destroy();
        this.invaders.forEach(function (c) { c.kill(); });
        this.currentTimer.stop();
        this.screenLevelTwoScore.setText('Score: ' + this.score);
        this.levelTwoScoreTween();
    },
    levelThreeComplete: function ()
    {
        this.screenLevelThreeGroup.visible = true;
        this.alienAnimation(3);
        //this.massKill.destroy();
        this.invaders.forEach(function (c) { c.kill(); });
        this.currentTimer.stop();
        this.screenLevelThreeScore.setText('Score: ' + this.score);
        this.levelThreeScoreTween();
    },
    alienAnimation: function (level)
    {
        //new
        this.redAlien = this.add.sprite(-100, 650, 'enemy3');
        this.redAlien.scale.setTo(4, 4);
        this.redAlien.animations.add('waddle');
        this.redAlien.animations.play('waddle', 10, true);
        this.rightTween = this.add.tween(this.redAlien).to({ x: 700 }, 2000, "Linear");
        this.leftTween = this.add.tween(this.redAlien).to({ x: -400 }, 2000, "Linear");
        this.leftTween.chain(this.rightTween);
        this.rightTween.chain(this.leftTween);
        this.rightTween.start();

        this.greenAlien = this.add.sprite(0, 550, 'enemy2');
        this.greenAlien.scale.setTo(4, 4);
        this.greenAlien.rotation += 2;
        this.greenAlien.animations.add('blink');
        this.greenAlien.animations.play('blink', 2, true);
        this.inTween = this.add.tween(this.greenAlien).to({ rotation: 2 }, 4000, "Quart.easeOut");
        this.outTween = this.add.tween(this.greenAlien).to({ rotation: 0.5 }, 4000, "Quart.easeOut");
        this.inTween.chain(this.outTween);
        this.outTween.chain(this.inTween);
        this.outTween.start();
        if (level > 1)
        {
            this.blueAlien = this.add.sprite(0, 0, 'enemy4');
            this.blueAlien.scale.setTo(3.5, 3.5);
            this.blueAlien.alpha = 0;
            this.blueAlien.animations.add('open');
            this.blueAlien.animations.play('open', 2, true);
            this.fadeTween = this.add.tween(this.blueAlien).to({ alpha: 1 }, 2000, "Linear", true, 0, -1);
            this.fadeTween.yoyo(true, 2000);
        }
        if (level > 2)
        {
            this.purpleAlien = this.add.sprite(300, 0, 'enemy1');
            this.purpleAlien.scale.setTo(4, 4);
            this.purpleAlien.animations.add('lights');
            this.purpleAlien.animations.play('lights', 2, true);
            this.dropTween = this.add.tween(this.purpleAlien).to({ y: 400 }, 2000, "Linear", true, 0, -1);
            this.dropTween.yoyo(true, 2000);
        }
    },
    addPoints: function ()
    {
        this.score += 10;
        this.textScore.setText('Score: ' + this.score);
        var randX = this.rnd.integerInRange(200, this.world.width - 200);
        var randY = this.rnd.integerInRange(200, this.world.height - 200);
        var pointsAdded = this.add.text(randX, randY, '+10',
			{ font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
        pointsAdded.anchor.set(0.5, 0.5);
        this.add.tween(pointsAdded).to({ alpha: 0, y: randY - 50 }, 1000, Phaser.Easing.Linear.None, true);

        this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
    },
    levelOneScoreTween: function ()
    {
        this.screenLevelOneScore.setText('Score:0');
        if (this.score >= 0)
        {

            this.tweenedPoints = 0;
            var pointsTween = this.add.tween(this);
            pointsTween.onStart.add(this.playCounter, this);
            pointsTween.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function ()
            {
                this.screenLevelOneScore.setText('Score:' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function ()
            {
                this.counterSfx.stop();
                this.explodeSfx.play('', 0, 1, false);
                this.screenLevelOneScore.setText('Score:' + this.score);
                this.spawnEmitter(this.screenLevelOneScore, 'particle', 20, 300);
                //tween in coupon and next button

                this.add.tween(this.screenLevelOneTextUnlocked).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.dealerCoupon).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 500);
                this.add.tween(this.screenLevelOneBtn).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 1000);
            }, this);
            pointsTween.start();
        }
    },
    levelTwoScoreTween: function ()
    {
        this.screenLevelTwoScore.setText('Score:0');
        if (this.score)
        {

            this.tweenedPoints = 0;
            var pointsTweenTwo = this.add.tween(this);
            pointsTweenTwo.onStart.add(this.playCounter, this);
            pointsTweenTwo.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTweenTwo.onUpdateCallback(function ()
            {
                this.screenLevelTwoScore.setText('Score:' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTweenTwo.onComplete.addOnce(function ()
            {
                this.counterSfx.stop();
                this.explodeSfx.play('', 0, 1, false);
                this.screenLevelTwoScore.setText('Score:' + this.score);
                this.spawnEmitter(this.screenLevelTwoScore, 'particle', 20, 300);
                //tween in coupon and next button

                this.add.tween(this.screenLevelTwoTextUnlocked).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.dealerCouponTwo).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 500);
                this.add.tween(this.screenLevelThreeBtn).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 1000);
            }, this);
            pointsTweenTwo.start();
        }
    },
    levelThreeScoreTween: function ()
    {
        this.screenLevelThreeScore.setText('Final Score:0');
        if (this.score)
        {

            this.tweenedPoints = 0;
            var pointsTweenThree = this.add.tween(this);
            pointsTweenThree.onStart.add(this.playCounter, this);
            pointsTweenThree.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTweenThree.onUpdateCallback(function ()
            {
                this.screenLevelThreeScore.setText('Final Score:' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTweenThree.onComplete.addOnce(function ()
            {
                this.counterSfx.stop();
                this.explodeSfx.play('', 0, 1, false);
                this.screenLevelThreeScore.setText('Final Score:' + this.score);
                this.spawnEmitter(this.screenLevelThreeScore, 'particle', 20, 300);
                //tween in coupon and next button

                this.add.tween(this.screenLevelThreeTextUnlocked).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
                this.add.tween(this.dealerCouponThree).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 500);
                this.add.tween(this.collectPointsBtn).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 1000);
            }, this);
            pointsTweenThree.start();
        }
    },
    playCounter: function ()
    {
        this.counterSfx.play('', 0, 1, true);
    },
    gameoverScoreTween: function ()
    {
        this.screenGameoverScore.setText('Score: 0');
        if (this.score)
        {
            this.tweenedPoints = 0;
            var pointsTween = this.add.tween(this);
            pointsTween.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function ()
            {
                this.screenGameoverScore.setText('Score: ' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function ()
            {
                this.screenGameoverScore.setText('Score: ' + this.score);
                this.spawnEmitter(this.screenGameoverScore, 'particle', 20, 300);
            }, this);
            pointsTween.start();
        }
    },
    spawnEmitter: function (item, particle, number, lifespan, frequency, offsetX, offsetY, gravity)
    {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        lifespan = lifespan || 2000;
        frequency = frequency || 0;
        var emitter = this.game.add.emitter(item.x + offsetX, item.y + offsetY, number);
        emitter.maxParticles = number;
        emitter.makeParticles(particle);
        emitter.setXSpeed(-500, 500);
        emitter.setYSpeed(-700, 300);
        emitter.setScale(4, 1, 4, 1, 500, Phaser.Easing.Linear.None);
        emitter.gravity = gravity || 250;
        emitter.start(false, lifespan, frequency, number);
    },
    clickAudio: function ()
    {
    },
    stateRestart: function ()
    {
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.restart(true);
    },
    stateBack: function ()
    {
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.start('MainMenu');
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/