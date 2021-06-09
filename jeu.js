

class jeu extends Phaser.Scene {
    constructor() {
        super({
            key: 'jeu'
        });
    }

    preload() {
        //this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('fond1', 'assets/images/decors/fond1.jpg');
        this.load.image('fond2', 'assets/images/decors/fond2.jpg');
        this.load.image('fond3', 'assets/images/decors/fond3.jpg');
        this.load.image('fond4', 'assets/images/decors/fond4.jpg');
        this.load.image('fond5', 'assets/images/decors/fond5.jpg');
        this.load.image('time', 'assets/images/time.png');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('tete_map', 'assets/images/map/tete_map.png');
        //this.load.image('logo', 'assets/sprites/phaser.png');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('red', 'assets/particles/red.png');
        this.load.image('fire', 'assets/particles/lit-smoke.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('particuleDollars', 'assets/particles/flame1.png');
        this.load.image('particlesPepite', 'assets/particles/smoke-puff.png');
        this.load.image('dollars', 'assets/images/tetes/dollars.png');
        this.load.image('pepite', 'assets/images/pepite.png');
        this.load.image('pepite_mini', 'assets/images/tetes/pepite.png');
        this.load.image('bandit', 'assets/images/tetes/bandit.png');
        this.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', {
            frameWidth: 193,
            frameHeight: 71
        });
        augmente = 0;
        positif = 1;

    }

    create() {

        //on passe par la pour les dollars car il ne doit pas réapparaitre tout de suite
        this.emitterEventDollars = new Phaser.Events.EventEmitter();
        this.emitterEventDollars.on('restartDollars', this.restartDollars, this);

        var fond = Phaser.Math.Between(1, 5);
        var decor = this.add.image(400, 400, 'fond'+fond);
        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 50, 'return').setInteractive()
            .on('pointerdown', () => {
                if( userInBdd.level < 10 )
                    this.scene.start("map");
                else
                    this.scene.start("map2");
            });
        decor.setInteractive();
        decor.on('pointerdown', () => {        //quand on clique sur l'élément PAS recherché
            if( currentHealth > 0 && nextLevel < 10 )
                this.time.addEvent({callback: badClick, callbackScope: this});
            else{
                var pepiteBonus = Math.trunc(currentHealth / 10);

                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    userInBdd.level,
                    userInBdd.score,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd,
                    userInBdd.recompenseAdd,
                    userInBdd.vitesseEnMoins,
                    userInBdd.pepite + this.catchPepite + pepiteBonus,
                    userInBdd.entreeChariot
                );
                if( userInBdd.level < 10 )
                    this.scene.start("map");
                else
                    this.scene.start("map2");
            }
        });


        var particles = this.add.particles('red');
        this.particlesFind = this.add.particles('fire');
        this.particlesDollars = this.add.particles('particuleDollars');
        this.particlesPepite = this.add.particles('particlesPepite');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: {start: 1, end: 0},
            blendMode: 'ADD'
        });

        this.emitterDollars = this.particlesDollars.createEmitter({
            speed: 100,
            scale: {start: 1, end: 0},
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        for( var i = 1; i<= nbBandit; i++ ) {
            this.physics.add.image(300 + i*150, i*150+100, 'bandit').setVelocity(100+i*150, 200+i*150)
                .setBounce(1, 1)
                .setCollideWorldBounds(true)
                .setInteractive()
                .on('pointerdown', () => {        //quand on clique sur le bandit game over direct
                    if( nextLevel < 10 )
                        currentHealth = 0;
            });
        }

        emitter.startFollow(logo);

        this.tetes = new Array();
        this.falseTetes = new Array();

        for(var a = 0; a < totalTetes.length; a++) {
            var falseTete = this.add.image(game.config.width - 150*a, 300+250*a, 'tete'+totalTetes[a]);
            falseTete.direction = 0;
            this.falseTetes.push(falseTete);
        }
            this.teteWanted = this.add.image(game.config.width - 150, 150, teteWanted);
        this.teteWanted.direction = 0;
        this.teteWanted.setInteractive();

        this.teteWanted.on('pointerdown', () => {        //quand on clique sur l'élément recherché
            this.time.addEvent({callback: actionOnClick, callbackScope: this});
        });


        this.dollars = this.add.image(game.config.width - 150, 150, 'dollars');
        this.dollars.direction = 0;
        this.dollars.setInteractive();

        this.dollars.on('pointerdown', () => {        //quand on clique sur l'élément recherché
            this.time.addEvent({callback: actionDollars, callbackScope: this});
        });
        this.emitterDollars.startFollow(this.dollars);
////////////////////
        this.catchPepite = 0;//ajout de la pépite seulement si le niveau est fini
            this.time.addEvent({    //Apparition des pepites, une seule par partie
            delay: Phaser.Math.Between(3000, currentHealth*1000),
            //delay: Phaser.Math.Between(3000, 3001),
            callback: () => {
                if( nextLevel != 10 && currentHealth > 0 && levelNiveau > 1 ) {

                    this.emitterPepite = this.particlesPepite.createEmitter({
                        speed: 100,
                        scale: {start: 1, end: 0},
                        blendMode: 'ADD'
                    });

                    var dir = Phaser.Math.Between(0, 1);
                    var posXdepart = 0;
                    if (dir == 1)
                        posXdepart = 50;
                    else
                        posXdepart = game.config.width - 50;
                    this.pepite = this.add.image(posXdepart, Phaser.Math.Between(50, game.config.height - 50), 'pepite_mini');
                    this.pepite.direction = dir;
                    this.pepite.setInteractive();

                    this.pepite.on('pointerdown', () => {        //quand on clique sur l'élément recherché
                        this.time.addEvent({callback: actionPepite, callbackScope: this});
                    });
                    this.emitterPepite.startFollow(this.pepite);
                    this.emitterPepite.on = true;
                }
            },
            loop: false
        });


        if( levelNiveau == 0 || levelNiveau == 1  ) {
            var distanceTetesX = 320;
            var distanceTetesY = 324;
            var nbTetesX       = 3;
            var nbTetesY       = 4;
        }else if( levelNiveau == 2 || levelNiveau == 3 ) {
            var distanceTetesX = 160;
            var distanceTetesY = 162;
            var nbTetesX       = 6;
            var nbTetesY       = 8;
        }else if( levelNiveau == 4 || levelNiveau == 5 ) {
            var distanceTetesX = 120;
            var distanceTetesY = 121;
            var nbTetesX       = 8;
            var nbTetesY       = 11;
        }else if( levelNiveau == 6 || levelNiveau == 7 ) {
            var distanceTetesX = 100;
            var distanceTetesY = 101;
            var nbTetesX       = 9;
            var nbTetesY       = 13;
        }
        else {
            var distanceTetesX = 80;
            var distanceTetesY = 81;
            var nbTetesX       = 11;
            var nbTetesY       = 16;
        }

        if( levelNiveau%2 == 0 ) {
            var v = -15;
            var d = 0;
        }
        else {//sinusoidal
            var v = 0;
            var d = -5;
        }

        for (var a = v; a < nbTetesX; a++) {
            for (var i = d; i < nbTetesY; i++) {
                var imgFalse = this.add.image(a * distanceTetesX, distanceTetesY + (i * distanceTetesY), teteNotWanted);

                var value = Phaser.Math.Between(0, 10);
                var sens = Phaser.Math.Between(0, 10);
                if (value < 5)
                    imgFalse.rotation += 0.6;
                if (sens < 5)
                    imgFalse.sens = 'negatif';

                imgFalse.departX = a * distanceTetesX;
                imgFalse.departY = distanceTetesY + (i * distanceTetesY);

                this.tetes.push(imgFalse);
            }
        }

        //timer

        //  So we can see how much health we have left

        text = this.add.text(10, 10, currentHealth,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
            .setShadow(2, 2, cssColors.navy, 8);

        nextLevelText = this.add.text(this.cameras.main.width -120, 10, nextLevel,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
            .setShadow(2, 2, cssColors.navy, 8);

        dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
            userInBdd = snapshot.val();
            scoreDisplay = this.add.text(this.cameras.main.width / 2 - 70, 10, userInBdd.score,
                {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
                .setShadow(2, 2, cssColors.navy, 8);
            pepiteDisplay = this.add.text(120, this.cameras.main.height - 80, userInBdd.pepite,
                {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
                .setShadow(2, 2, cssColors.navy, 8);
        });
        timedEvent = this.time.addEvent({delay: 500, callback: reduceHealth, callbackScope: this, loop: true});
        var time = this.add.image(130, 40, 'time');
        var tete_map = this.add.image(game.config.width - 40, 40, 'tete_map');
        var gold = this.add.image(this.cameras.main.width /2 -120, 40, 'gold');
        var pepite = this.add.image(50, this.cameras.main.height -50, 'pepite');
        var wantedTete = this.add.image(game.config.width/2, game.config.height - 80, bigTeteWanted);
        wantedTete.alpha = 0.5;


    }


    update() {
        if (currentHealth == 0) {
            if( this.emitterDollars.on == true ){
                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    userInBdd.level,
                    userInBdd.score,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd,
                    userInBdd.recompenseAdd,
                    userInBdd.vitesseEnMoins,
                    0,
                    userInBdd.entreeChariot
                );
                this.emitterDollars.on = false;
                pepiteDisplay.setText(0);
                pepiteDisplay.setFill('red');
            }
            this.add.text(game.config.width / 2 - 150, game.config.height / 2, 'GAME OVER', {
                fontSize: '52px',
                fill: '#fff'
            }).setInteractive()
                .on('pointerdown', () => {
                    if( userInBdd.level < 10 )
                        this.scene.start("map");
                    else
                        this.scene.start("map2");
                });
            this.teteWanted.destroy();
            for (var a = 0; a < this.falseTetes.length; a++)
                this.falseTetes[a].destroy();

        }
        if (nextLevel == 10) {
            this.emitterDollars.on = false;

            this.add.text(game.config.width / 2 - 150, game.config.height / 2, 'NEXT LEVEL', {
                fontSize: '52px',
                fill: '#fff'
            });
            this.teteWanted.destroy();
            timedEvent.remove();
            for (var a = 0; a < this.falseTetes.length; a++)
                this.falseTetes[a].destroy();

        }

        text.setText(currentHealth).setShadow(2, 2, cssColors.navy, 8);

        if (grossirText != null) {  //quand un score est modifié
            if (grossir == 1) {
                grossirText.setFontSize(fontScore + 2);
                fontScore = fontScore + 2;
            } else {
                grossirText.setFontSize(fontScore - 2);
                fontScore = fontScore - 2;
            }
            if (fontScore >= fontScoreDepart + 14)//pas trop sinon jeu ralenti et doit être pair
                grossir = 0;
            if (grossir == 0 && fontScore == fontScoreDepart) {
                grossirText = null;
                grossir = 1;
            }
        }

        this.teteWanted.rotation += 0.01;
        this.dollars.rotation += 0.2;
        //console.log(this.tetes[0].x);
        for (var i = 0; i < this.tetes.length; i++) {
            var tete = this.tetes[i];
            if (currentHealth == 0 || nextLevel == 10) {
                tete.destroy();
                this.teteWanted.destroy();
                this.dollars.destroy();
            } else {
                if (tete.rotation != 0) {
                    if (tete.sens == 'negatif')
                        tete.rotation -= 0.1;
                    else
                        tete.rotation += 0.1;
                }

                tete.x += 2;
                if (levelNiveau % 2 == 0)
                    var pattern = 3;//tout droit
                else
                    var pattern = 1;//sinusoidal
                if (positif == pattern)
                    tete.y += 2;
                else
                    tete.y -= 2;

                if (tete.x > 800 && levelNiveau % 2 == 1) {
                    tete.x = -80;
                    tete.y = tete.departY;
                }
                if (tete.y < 0 && levelNiveau % 2 == 0) {

                    tete.x = tete.departX;
                    tete.y = game.config.height + 240;

                }
            }
        }
        var vitesseTete = userInBdd.vitesseEnMoins + 3 + levelNiveau;
        if( vitesseTete < 3 )
            vitesseTete = 3;
        for (var a = 0; a < this.falseTetes.length; a++) {
            if (this.falseTetes[a].direction == 0)
                this.falseTetes[a].x -= vitesseTete;
            else
                this.falseTetes[a].x += vitesseTete;
        }

        if( this.teteWanted.direction == 0 )
            this.teteWanted.x -= vitesseTete;
        else
            this.teteWanted.x += vitesseTete;

        if( this.dollars.direction == 0 )
            this.dollars.x -= 6 + levelNiveau;
        else
            this.dollars.x += 6 + levelNiveau;

        if(  this.pepite && this.pepite.direction == 0 )
            this.pepite.x -= 7;
        else if( this.pepite && this.pepite.direction == 1 )
            this.pepite.x += 7;

        if (positif == 1) {
            this.dollars.y -= 2;
            this.teteWanted.y += 2;
            if( this.pepite )
                this.pepite.y -= 2;
        }
        else {
            this.dollars.y += 2;
            this.teteWanted.y -= 2;
            if( this.pepite )
                this.pepite.y += 2;
        }

        for (var a = 0; a < this.falseTetes.length; a++) {
            if (this.falseTetes[a].x < 0 || this.falseTetes[a].x > game.config.width) {
                var value1 = Phaser.Math.Between(0, 10);

                if (value1 >= 5) {
                    this.falseTetes[a].direction = 0;
                    this.falseTetes[a].x = game.config.width - 50;
                } else {
                    this.falseTetes[a].direction = 1;
                    this.falseTetes[a].x = 50;
                }

                var value = Phaser.Math.Between(0, 600);
                this.falseTetes[a].y = value;
            }
        }

        if (this.teteWanted.x < 0 ||  this.teteWanted.x > game.config.width ) {
            var value1 = Phaser.Math.Between(0, 10);

            if( value1 >= 5 ) {
                this.teteWanted.direction = 0;
                this.teteWanted.x = game.config.width - 50;
            }
            else {
                this.teteWanted.direction = 1;
                this.teteWanted.x = 50;
            }

            var value = Phaser.Math.Between(0, 600);
            this.teteWanted.y = value;
        }

        if (this.dollars.x < 0 ||  this.dollars.x > game.config.width ) {
            this.emitterEventDollars.emit('restartDollars');
            this.emitterEventDollars.off('restartDollars', this.restartDollars, this);
        }

        if (this.pepite && (this.pepite.x < 0 ||  this.pepite.x > game.config.width) ) {
            this.pepite.destroy();
            this.emitterPepite.on = false;
        }


        if (positif == 1)
            augmente++;

        if (positif == 0)
            augmente--;

        if (augmente >= 65)
            positif = 0;


        if (augmente <= -60)
            positif = 1;

    }

    restartDollars(){
        this.time.addEvent({
            delay: 15000,
            callback: ()=>{
                this.emitterDollars.on = true;
                this.dollars.visible = true;
                var value1 = Phaser.Math.Between(0, 10);

                if( value1 >= 5 ) {
                    this.dollars.direction = 0;
                    this.dollars.x= game.config.width-50;
                }
                else {
                    this.dollars.direction = 1;
                    this.dollars.x = 50;
                }

                var value = Phaser.Math.Between(0, 600);
                this.dollars.y= value;
                //on remet le listener
                this.emitterEventDollars.on('restartDollars', this.restartDollars, this);
            },
            loop: false,

        });
    }
}