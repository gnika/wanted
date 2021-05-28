

    class jeu extends Phaser.Scene {
        constructor() {
            super({
                key: 'jeu'
            });
        }

        preload() {

            this.load.plugin('rexfadeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfadeplugin.min.js', true);

            this.load.setBaseURL('http://labs.phaser.io');

            this.load.image('sky', 'assets/skies/space3.png');
            this.load.image('logo', 'assets/sprites/phaser3-logo.png');
            this.load.image('red', 'assets/particles/red.png');
            this.load.image('fire', 'assets/particles/lit-smoke.png');
            this.load.image('particuleDollars', 'assets/particles/flame1.png');
            this.load.image('tete1', 'http://wanted.local/assets/images/tetes/tete1_mini.png');
            this.load.image('tete2', 'http://wanted.local/assets/images/tetes/tete2_mini.png');
            this.load.image('dollars', 'http://wanted.local/assets/images/tetes/dollars.png');
            this.load.spritesheet('button', 'http://wanted.local/assets/buttons/button_sprite_sheet.png', {
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

            var decor = this.add.image(400, 300, 'sky');
            decor.setInteractive();
            decor.on('pointerdown', () => {        //quand on clique sur l'élément PAS recherché
                this.time.addEvent({callback: badClick, callbackScope: this});
            });


            var particles = this.add.particles('red');
            this.particlesFind = this.add.particles('fire');
            this.particlesDollars = this.add.particles('particuleDollars');

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

            emitter.startFollow(logo);

            var nbTetes = game.config.width / 50;


            this.tetes = new Array();


            this.tete2 = this.add.image(game.config.width - 150, 150, 'tete2');
            this.tete2.setInteractive();

            this.tete2.on('pointerdown', () => {        //quand on clique sur l'élément recherché
                this.time.addEvent({callback: actionOnClick, callbackScope: this});
            });


            this.dollars = this.add.image(game.config.width - 150, 150, 'dollars');
            this.dollars.setInteractive();

            this.dollars.on('pointerdown', () => {        //quand on clique sur l'élément recherché
                this.time.addEvent({callback: actionDollars, callbackScope: this});
            });

            this.emitterDollars.startFollow(this.dollars);


            for (var a = -nbTetes; a < nbTetes; a++) {
                for (var i = 0; i < 45; i++) {
                    var imgFalse = this.add.image(a * 80, 80 + (i * 80), 'tete1');

                    var value = Phaser.Math.Between(0, 10);
                    var sens = Phaser.Math.Between(0, 10);
                    if (value < 5)
                        imgFalse.rotation += 0.6;
                    if (sens < 5)
                        imgFalse.sens = 'negatif';

                    imgFalse.departX = a * 80;
                    imgFalse.departY = 80 + (i * 80);

                    this.tetes.push(imgFalse);

                    var imgFalse = this.add.image(a * 80, 80 + (-i * 80), 'tete1');

                    var value = Phaser.Math.Between(0, 10);
                    var sens = Phaser.Math.Between(0, 10);
                    if (value < 5)
                        imgFalse.rotation += 0.6;
                    if (sens < 5)
                        imgFalse.sens = 'negatif';

                    imgFalse.departX = a * 80;
                    imgFalse.departY = 80 + (-i * 80);
                    this.tetes.push(imgFalse);
                }
            }

            //timer

            //  So we can see how much health we have left
            text = this.add.text(10, 10, ' 100', {fill: cssColors.aqua, font: 'bold 52px system-ui'})
                .setShadow(2, 2, cssColors.navy, 8);

            nextLevelText = this.add.text(this.cameras.main.width -150, 10, nextLevel, {fill: cssColors.aqua, font: 'bold 52px system-ui'})
                .setShadow(2, 2, cssColors.navy, 8);

            dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
                userInBdd = snapshot.val();
                scoreDisplay = this.add.text(this.cameras.main.width / 2, 10, userInBdd.score, {
                    fill: cssColors.aqua,
                    font: 'bold 52px system-ui'
                })
                    .setShadow(2, 2, cssColors.navy, 8);
            });
            timedEvent = this.time.addEvent({delay: 500, callback: reduceHealth, callbackScope: this, loop: true});

        }


        update() {
            if( currentHealth == 0) {
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', {
                    fontSize: '32px',
                    fill: '#fff'
                });
                this.tete2.destroy();

            }
            if( nextLevel == 10) {
                this.add.text(game.config.width / 2, game.config.height / 2, 'NEXT LEVEL', {
                    fontSize: '32px',
                    fill: '#fff'
                }).setInteractive()
                    .on('pointerdown', () => this.scene.start("map"));
                this.tete2.destroy();
                timedEvent.remove();

            }

            text.setText(currentHealth).setShadow(2, 2, cssColors.navy, 8);

            if( grossirText != null ){  //quand un score est modifié
                if( grossir == 1 ) {
                    grossirText.setFontSize(fontScore + 2);
                    fontScore = fontScore + 2;
                }else{
                    grossirText.setFontSize(fontScore - 2);
                    fontScore = fontScore - 2;
                }
                if( fontScore >= fontScoreDepart + 12)//pas trop sinon jeu ralenti et doit être pair
                    grossir = 0;
                if( grossir == 0 && fontScore == fontScoreDepart ){
                    grossirText = null;
                    grossir = 1;
                }
            }

           // console.log(userConnected, 'joachim');
            this.tete2.rotation += 0.01;
            this.dollars.rotation += 0.2;
            for (var i = 0; i < this.tetes.length; i++) {
                var tete = this.tetes[i];
                if( currentHealth == 0 || nextLevel == 10)
                    tete.destroy();
                else {
                    if (tete.rotation != 0) {
                            if( tete.sens == 'negatif' )
                                tete.rotation-= 0.1;
                            else
                                tete.rotation+= 0.1;
                    }

                    tete.x += 2;
                    if (levelNiveau%2 == 0)
                        var pattern = 3;//tout droit
                    else
                        var pattern = 1;//sinusoidal
                    if (positif == pattern)
                        tete.y += 2;
                    else
                        tete.y -= 2;

                    if (tete.x > 800 + tete.departX) {
                        tete.x = tete.departX;
                        tete.y = tete.departY;
                    }
                }
            }


            this.tete2.x -= 3 + levelNiveau;
            this.dollars.x -= 9 + levelNiveau;
            if (positif == 1) {
                this.dollars.y -= 2;
                this.tete2.y += 2;
            }
            else {
                this.dollars.y += 2;
                this.tete2.y -= 2;
            }

            if (this.tete2.x < 0) {
                this.tete2.x = game.config.width - 50;
                var value = Phaser.Math.Between(0, 600);
                this.tete2.y = value;
            }

            if (this.dollars.x < 0) {
                this.emitterEventDollars.emit('restartDollars');
                this.emitterEventDollars.off('restartDollars', this.restartDollars, this);
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
                    this.dollars.x= game.config.width-50;
                    var value = Phaser.Math.Between(0, 600);
                    this.dollars.y= value;
                    //on remet le listener
                    this.emitterEventDollars.on('restartDollars', this.restartDollars, this);
                },
                loop: false,

            });
        }
    }