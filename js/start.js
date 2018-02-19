var Invaders = Invaders || {};

if(Phaser.Device.ie) //Checks that internet explorer is being used
{
    if(Phaser.Device.ieVersion < 10) //Check for old version
    {
        var error = document.createElement("DIV");
        error.setAttribute("id", "ieError");
        document.body.appendChild(error);
        document.getElementById("ieError").innerHTML = "Please upgrade your Browser <br><br> <a href = 'https://www.microsoft.com/en-ca/download/internet-explorer.aspx'>Internet Explorer</a><br><a href='https://www.google.com/chrome/browser/desktop/index.html'>Chrome</a><br><a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>";
    
    }
    else
    {
        Invaders.game = new Phaser.Game(640, 960, Phaser.AUTO);

        Invaders.game.state.add('Cache', Invaders.CacheState);
        Invaders.game.state.add('Boot', Invaders.BootState); 
        Invaders.game.state.add('Preload', Invaders.PreloadState); 
        Invaders.game.state.add('Game', Invaders.GameState);
        Invaders.game.state.add('MainMenu', Invaders.MainMenuState);
        Invaders.game.state.add('Story', Invaders.StoryState);

        Invaders.game.state.start('Cache'); 
    }
}
else
{
    Invaders.game = new Phaser.Game(640, 960, Phaser.AUTO);

    Invaders.game.state.add('Cache', Invaders.CacheState);
    Invaders.game.state.add('Boot', Invaders.BootState); 
    Invaders.game.state.add('Preload', Invaders.PreloadState); 
    Invaders.game.state.add('Game', Invaders.GameState);
    Invaders.game.state.add('MainMenu', Invaders.MainMenuState);
    Invaders.game.state.add('Story', Invaders.StoryState);

    Invaders.game.state.start('Cache');
}
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/