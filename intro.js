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


        this.time.addEvent({
            delay: 2000,
            loop: false,
            callback: () => {
                this.scene.start("MainScene");
            }
        })


    }
    update () {

    }

}