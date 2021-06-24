class intro extends Phaser.Scene    {

    constructor(){
        super({
            key: 'intro',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
            });
    }
    preload () {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);
        var WebFontConfig = {
            google: {
                families: ['Luckiest Guy']
            }
        };

        this.load.rexWebFont(WebFontConfig);
        this.load.image('intro', 'assets/images/intro.jpg');

    }
    create () {
        const decors = this.add.image(400, 500, 'intro');

        //  Get a random color
        var red = Phaser.Math.Between(50, 255);
        var green = Phaser.Math.Between(50, 255);
        var blue = Phaser.Math.Between(50, 255);

        this.cameras.main.fade(3000, red, green, blue);
        this.cameras.main.on('camerafadeoutcomplete', function () {

            this.scene.start("MainScene");
        }, this);




    }
    update () {

    }

}