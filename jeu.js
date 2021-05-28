

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
            this.load.image('tete1', 'http://wanted.local/assets/images/tetes/tete1_mini.png');
            this.load.image('tete2', 'http://wanted.local/assets/images/tetes/tete2_mini.png');
            this.load.spritesheet('button', 'http://wanted.local/assets/buttons/button_sprite_sheet.png', {
                frameWidth: 193,
                frameHeight: 71
            });
            augmente = 0;
            positif = 1;

        }

        create() {
            var decor = this.add.image(400, 300, 'sky');
            decor.setInteractive();
            decor.on('pointerdown', () => {        //quand on clique sur l'élément PAS recherché
                this.time.addEvent({callback: badClick, callbackScope: this});
            });


            var particles = this.add.particles('red');
            this.particlesFind = this.add.particles('fire');

            var emitter = particles.createEmitter({
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
            this.tetesDepartX = new Array();
            this.tetesDepartY = new Array();


            this.tete2 = this.add.image(game.config.width - 150, 150, 'tete2');
            this.tete2.setInteractive();

            this.tete2.on('pointerdown', () => {        //quand on clique sur l'élément recherché
                this.time.addEvent({callback: actionOnClick, callbackScope: this});
            });


            for (var a = -nbTetes; a < nbTetes; a++) {
                for (var i = 0; i < 45; i++) {
                    var imgFalse = this.add.image(a * 80, 80 + (i * 80), 'tete1');

                    var value = Phaser.Math.Between(0, 10);
                    var sens = Phaser.Math.Between(0, 10);
                    if (value < 5)
                        imgFalse.rotation += 0.6;
                    if (sens < 5)
                        imgFalse.sens = 'negatif';

                    this.tetes.push(imgFalse);
                    this.tetesDepartX.push(a * 80);
                    this.tetesDepartY.push(80 + (i * 80));

                    var imgFalse = this.add.image(a * 80, 80 + (-i * 80), 'tete1');

                    var value = Phaser.Math.Between(0, 10);
                    var sens = Phaser.Math.Between(0, 10);
                    if (value < 5)
                        imgFalse.rotation += 0.6;
                    if (sens < 5)
                        imgFalse.sens = 'negatif';


                    this.tetes.push(imgFalse);
                    this.tetesDepartX.push(a * 80);
                    this.tetesDepartY.push(80 + (-i * 80));
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

           // console.log(userConnected, 'joachim');
            this.tete2.rotation += 0.01;
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

                    var tetesDepartX = this.tetesDepartX[i];
                    var tetesDepartY = this.tetesDepartY[i];


                    tete.x += 2;
                    if (positif == 3)//donc jamais car normalement c'est 1 pour faire sinusoidale
                        tete.y += 2;
                    else
                        tete.y -= 2;

                    if (tete.x > 800 + tetesDepartX) {
                        tete.x = tetesDepartX;
                        tete.y = tetesDepartY;
                    }
                }
            }


            this.tete2.x -= 3 + levelNiveau;
            if (positif == 1)
                this.tete2.y += 2;
            else
                this.tete2.y -= 2;

            if (this.tete2.x < 0) {
                this.tete2.x = game.config.width - 50;
                var value = Phaser.Math.Between(0, 600);
                this.tete2.y = value;
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
    }