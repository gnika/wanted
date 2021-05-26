
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.plugin('FractalPlugin', 'http://localhost/fractalplugin/dist/FractalPlugin.js');

    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('fire', 'assets/particles/lit-smoke.png');
    this.load.image('tete1', 'http://wanted.local/assets/images/tetes/tete_1.png');
    this.load.image('tete2', 'http://wanted.local/assets/images/tetes/tete_2.png');
    this.load.spritesheet('button', 'http://wanted.local/assets/buttons/button_sprite_sheet.png', {
        frameWidth: 193,
        frameHeight: 71
    });
    augmente = 0;
    positif = 1;

}

function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');
    this.particlesFind = this.add.particles('fire');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

    var nbTetes = game.config.width/50;


    this.tetes = new Array();
    this.tetesDepartX = new Array();
    this.tetesDepartY = new Array();


    this.tete2 = this.add.image(game.config.width - 150, 150, 'tete2');
    this.tete2.setInteractive();
    this.tete2.on('pointerdown', () => {
        var findSpark = this.particlesFind.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
        findSpark.startFollow(this.tete2);
        this.tete2.destroy();
        this.time.addEvent({ delay: 1000, callback: actionOnClick, callbackScope: this });

        //this.time.add(1000, function () {this.particlesFind.destroy()});
        //actionOnClick();
    });

    for( a = -nbTetes; a < nbTetes; a++){
        for( i = 0; i<45; i++ ){
            this.tetes.push( this.add.image(a*50, 50 + (i*50), 'tete1') );
            this.tetesDepartX.push(a*50);
            this.tetesDepartY.push(50 + (i*50));
        }
    }

}

function update()
{
    this.tete2.rotation += 0.01;
    for( i = 0; i<this.tetes.length; i++ ){
        var tete = this.tetes[i];
        var tetesDepartX = this.tetesDepartX[i];
        var tetesDepartY = this.tetesDepartY[i];
        tete.x += 2;
        if( positif == 3 )//donc jamais car normalement c'est 1 pour faire sinusoidale
            tete.y += 2;
        else
            tete.y -= 2;

        if( tete.x > 800 + tetesDepartX ){
            tete.x= tetesDepartX;
            tete.y= tetesDepartY;
        }
    }

    /*
        this.tete2.x -= 5;
        if( positif == 1 )
        this.tete2.y += 2;
        else
        this.tete2.y -= 2;
        */
    if( this.tete2.x <  0 ){
        this.tete2.x= game.config.width-50;
        this.tete2.y= 0;
    }


    if( positif == 1)
        augmente++;

    if( positif == 0 )
        augmente--;

    if( augmente >=65 )
        positif = 0;


    if( augmente <= -60 )
        positif = 1;

}

function actionOnClick () {

    this.tweens.add({
        targets: this.particlesFind,
        alpha: 0,
        duration: 300,
        ease: 'Power2'
    }, this);

    this.particlesFind.destroy();

}