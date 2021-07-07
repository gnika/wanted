

class jeu2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'jeu2'
        });
    }

    preload() {
        //this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('fond1', 'assets/images/decors/fond6.png');
        this.load.image('fond2', 'assets/images/decors/fond7.jpg');
        this.load.image('fond3', 'assets/images/decors/fond8.jpg');
        this.load.image('fond4', 'assets/images/decors/fond9.jpg');
        this.load.image('fond5', 'assets/images/decors/fond10.jpg');
        this.load.image('time', 'assets/images/time.png');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('tete_map', 'assets/images/map/tete_map.png');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('red', 'assets/particles/red.png');
        this.load.image('particulegold', 'assets/particles/green.png');
        this.load.image('fire', 'assets/particles/lit-smoke.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('particuleDollars', 'assets/particles/flame1.png');
        this.load.image('particlesPepite', 'assets/particles/smoke-puff.png');
        this.load.image('dollars', 'assets/images/tetes/dollars.png');
        this.load.image('pepite', 'assets/images/pepite.png');
        this.load.image('pepite_mini', 'assets/images/tetes/pepite.png');
        this.load.image('bonus_gold', 'assets/images/bonus_gold.png');
        this.load.image('bonus_pepite', 'assets/images/bonus_pepite.png');
        this.load.image('bandit', 'assets/images/tetes/bandit.png');
        this.load.image('interdit', 'assets/images/interdit.png');
        this.load.image('dynamite', 'assets/images/dynamite.png');
        this.load.image('sherif', 'assets/images/sherif.png');
        this.load.image('interdit', 'assets/images/interdit.png');
        this.load.audio('bonus', 'assets/music/bonus.wav');
        this.load.audio('wrong', 'assets/music/wrong.mp3');
        this.load.audio('clock', 'assets/music/clock.mp3');
        this.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', {
            frameWidth: 193,
            frameHeight: 71
        });
        augmente = 0;
        positif = 1;

    }

    create() {

        clock = this.sound.add('clock');
        clock.loop = true;
        clock.play();
        if( isMute == 0 )
            game.sound.setMute(false);

        //on passe par la pour les dollars car il ne doit pas réapparaitre tout de suite
        this.emitterEventDollars = new Phaser.Events.EventEmitter();
        this.emitterEventDollars.on('restartDollars', this.restartDollars, this);
        this.vies = userInBdd.vie;

        var fond = Phaser.Math.Between(1, 5);
        var decor = this.add.image(400, 400, 'fond'+fond);
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0xffff00, 0xffff00, 0xff0000, 0xff0000, 1);
        graphics.fillRect(0, 700, game.config.width, 400);


        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 50, 'return').setInteractive()
            .on('pointerdown', () => {
                clock.stop();
                if( userInBdd.level >= 10 && userInBdd.level < 20 )
                    this.scene.start("map2");
                else if( userInBdd.level >= 20 && userInBdd.level < 30 )
                    this.scene.start("map3");
                else if( userInBdd.level >= 30 )
                    this.scene.start("map4");
            });
        iconReturn.visible = false;

        decor.setInteractive();
        decor.on('pointerdown', () => {        //quand on clique sur le decors
            if( currentHealth == 0 || nextLevel >= 25 ){

                var pepiteBonus = teteBonus;
                var scoreBonus = teteBonus * 10;
                if( this.catchPepite == 1 ){
                    var pepites = userInBdd.pepite + this.catchPepite + pepiteBonus;
                    var score = userInBdd.score;
                }else{
                    var pepites = userInBdd.pepite;
                    var score = userInBdd.score + scoreBonus;
                }

                if( nextLevel >= 25 ) {
                    if(userInBdd.level == 39) {
                        userInBdd.level = 0;
                        userInBdd.entreeChariot = 0;
                        userInBdd.entreeMagasin2 = 0;
                        userInBdd.onetouchtwomatch = 0;
                        userInBdd.timeAdd = 0;
                        userInBdd.vitesseEnMoins = 0;
                        userInBdd.dynamite = 0;
                    }
                    else
                        userInBdd.level++;
                }

                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    userInBdd.level,
                    score,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd,
                    userInBdd.recompenseAdd,
                    userInBdd.vitesseEnMoins,
                    pepites,
                    userInBdd.entreeChariot,
                    userInBdd.entreeMagasin2,
                    userInBdd.dynamite,
                    userInBdd.vie,
                    userInBdd.onetouchtwomatch
                );
                clock.stop();
                if( userInBdd.level < 10)
                    this.scene.start("map");
                else if( userInBdd.level >= 10 && userInBdd.level < 20 )
                    this.scene.start("map2");
                else if( userInBdd.level >= 20 && userInBdd.level < 30 )
                    this.scene.start("map3");
                else if( userInBdd.level >= 30 )
                    this.scene.start("map4");
            }
        });

        var particles = this.add.particles('red');
        this.particlesFind = this.add.particles('fire');
        this.particlesFindBonus = this.add.particles('particulegold');
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

        emitter.startFollow(logo);

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
            delay: Phaser.Math.Between(3000, 10000),
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
            var nbTetesX       = 10;
            var nbTetesY       = 16;
        }

        this.tetes = [];
        var mainGame = this;

        this.life = [];
        for (var a = 0; a < userInBdd.vie; a++) {
            this.life[a] = this.add.image(50, a * 150 + 200 , 'sherif');
        }

        for (var a = 1; a < nbTetesX; a++) {
            var tetRechercheeNumber  = 'tete'+Phaser.Math.Between(1, 4);
            var distanceTetesX2 = 10;
            this.tetes[a] = this.add.image(a * distanceTetesX + distanceTetesX2, Phaser.Math.Between(-500, 50), tetRechercheeNumber);
            this.tetes[a].teteOver = tetRechercheeNumber;
            this.tetes[a].number = a;
            this.tetes[a].setInteractive();

            this.tetes[a].on('pointerdown', function () {         //quand on clique sur une tete

                var tete = this;

                if( this.teteOver == teteWanted ) {
                    currentHealth = 0;
                    var wrong = game.sound.add('wrong');
                    wrong.play();
                }
                else if( this.teteOver == 'tete'+bonusTete ) {

                    var bonus = game.sound.add('bonus');
                    bonus.play();
                    teteBonus++;
                }else{
                    var pistol = game.sound.add('pistol');
                    pistol.play();
                }

                if( userInBdd.onetouchtwomatch == 1 ) { //on en prends 2 pour 1 mais ca n'incremente pas les pv les bonus et l'argent
                    var next = tete.number + 1;

                    if( touteslestetes.length > next ) {

                        mainGame.time.addEvent({
                            callback: () => {

                                var findSpark = mainGame.particlesFind.createEmitter({
                                    speed: 100,
                                    scale: {start: 1, end: 0},
                                    blendMode: 'ADD'
                                });

                                findSpark.startFollow(touteslestetes[next]);
                                touteslestetes[next].visible = false;

                                mainGame.time.addEvent({
                                    delay: 500,
                                    callback: () => {
                                        findSpark.on = false;
                                        touteslestetes[next].visible = true;
                                        touteslestetes[next].x = tete.departX;
                                        touteslestetes[next].y = Phaser.Math.Between(-500, 100);
                                    },
                                    loop: false
                                });


                            }, callbackScope: this
                        });
                    }

                }
                mainGame.time.addEvent({callback: ()=>{

                        if( this.teteOver == 'tete'+bonusTete )
                            var findSpark = mainGame.particlesFindBonus.createEmitter({
                                speed: 100,
                                scale: { start: 1, end: 0 },
                                blendMode: 'ADD'
                            });
                        else
                            var findSpark = mainGame.particlesFind.createEmitter({
                                speed: 100,
                                scale: { start: 1, end: 0 },
                                blendMode: 'ADD'
                            });

                        findSpark.startFollow(tete);
                        tete.visible = false;
                        nextLevel++;

                        nextLevelText.setText(nextLevel).setShadow(2, 2, cssColors.navy, 8);

                        mainGame.time.addEvent({
                            delay: 500,
                            callback: ()=>{
                                findSpark.on = false;
                                tete.visible = true;
                                tete.x= tete.departX;
                                tete.y= Phaser.Math.Between(-500, 100);
                            },
                            loop: false
                        });

                        var ptVictoire = headScore + userInBdd.score;

                        scoreDisplay.setText(ptVictoire);
                        grossirText = scoreDisplay;
                        writeUserData(
                            userConnected.uid,
                            userConnected.displayName,
                            userConnected.email,
                            userConnected.photoURL,
                            userInBdd.level,
                            ptVictoire,
                            userInBdd.entreeSaloon,
                            userInBdd.timeAdd,
                            userInBdd.recompenseAdd,
                            userInBdd.vitesseEnMoins,
                            userInBdd.pepite,
                            userInBdd.entreeChariot,
                            userInBdd.entreeMagasin2,
                            userInBdd.dynamite,
                            userInBdd.vie,
                            userInBdd.onetouchtwomatch
                        );

                    }, callbackScope: this});


            });

            var value = Phaser.Math.Between(0, 10);
            var sens = Phaser.Math.Between(0, 10);
            if (value < 5)
                this.tetes[a].rotation += 0.6;
            if (sens < 5)
                this.tetes[a].sens = 'negatif';

            this.tetes[a].departX = a * distanceTetesX;
            this.tetes[a].departY = 0;

        }

        var touteslestetes = this.tetes;
        this.dynamite = [];
        for (var a = 0; a < userInBdd.dynamite; a++) {//-15000, 50
            this.dynamite[a] = this.add.image(Phaser.Math.Between(50, this.cameras.main.width), Phaser.Math.Between(-15000, 50) , 'dynamite');
            this.dynamite[a].setInteractive();

            this.dynamite[a].on('pointerdown', function () {         //quand on clique sur une dynamite

                var bonus = game.sound.add('bonus');
                bonus.play();

                var findSpark = mainGame.particlesFind.createEmitter({
                    speed: 100,
                    scale: { start: 10, end: 0 },
                    blendMode: 'ADD'
                });

                findSpark.startFollow(this);
                this.visible = false;

                for (var i = 1; i < touteslestetes.length; i++) {
                    var tete = touteslestetes[i];
                    if( tete.y > 50 ) {
                        tete.x = tete.departX;
                        tete.y = Phaser.Math.Between(-500, 100);

                        nextLevel++;

                        nextLevelText.setText(nextLevel);
                        if( tete.teteOver == 'tete'+bonusTete )
                            teteBonus ++;
                    }
                }

                mainGame.time.addEvent({
                    delay: 500,
                    callback: ()=>{
                        findSpark.on = false;
                    },
                    loop: false
                });

            });
        }



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


        var tete_map = this.add.image(game.config.width - 40, 40, 'tete_map');
        var gold = this.add.image(this.cameras.main.width /2 -120, 40, 'gold');
        var pepite = this.add.image(50, this.cameras.main.height -50, 'pepite');
        var interdit = this.add.image(game.config.width/2, game.config.height - 80, 'interdit');
        interdit.alpha = 0.5;
        var wantedTete = this.add.image(game.config.width/2, game.config.height - 80, bigTeteWanted);
        wantedTete.alpha = 0.5;

        this.gamover = this.add.text(game.config.width / 2 - 150, game.config.height / 2, 'GAME OVER', {
            fontFamily: "Luckiest Guy", fontSize: 52,
            fill: '#fff'
        });

        this.nextlevel = this.add.text(game.config.width / 2 - 150, game.config.height / 2 + 100, 'NEXT LEVEL', {
            fontFamily: "Luckiest Guy", fontSize: 52,
            fill: '#fff'
        });

        this.bonusPepite = this.add.text(game.config.width / 2 - 150, game.config.height / 2, 'BONUS', {
            fontFamily: "Luckiest Guy", fontSize: 52,
            fill: '#fff'
        });
        this.bonusPepiteImage = this.add.image(game.config.width / 2 + 80, game.config.height / 2 + 30, 'bonus_pepite');
        this.bonusGoldImage = this.add.image(game.config.width / 2 + 80, game.config.height / 2 + 30, 'bonus_gold');
        this.bonusPepite2 = this.add.text(game.config.width / 2 + 150, game.config.height / 2, 'X', {
            fontFamily: "Luckiest Guy", fontSize: 52,
            fill: '#fff'
        });

        this.gamover.visible = false;
        this.nextlevel.visible = false;
        this.bonusPepite.visible = false;
        this.bonusPepiteImage.visible = false;
        this.bonusGoldImage.visible = false;
        this.bonusPepite2.visible = false;

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
                    userInBdd.entreeChariot,
                    userInBdd.entreeMagasin2,
                    userInBdd.dynamite,
                    userInBdd.vie,
                    userInBdd.onetouchtwomatch
                );
                this.emitterDollars.on = false;
                pepiteDisplay.setText(0);
                pepiteDisplay.setFill('red');
            }
            this.gamover.visible = true;

        }
        if (nextLevel >= 25) {
            this.emitterDollars.on = false;

            this.nextlevel.visible = true;

            var pepiteBonus = teteBonus;
            var scoreBonus = teteBonus * 10;
            this.bonusPepite.visible = true;
            this.bonusPepite2.visible = true;
            if( this.catchPepite == 1) {
                this.bonusPepiteImage.visible = true;
                this.bonusPepite2.setText('X ' + pepiteBonus);
            }
            else {
                this.bonusGoldImage.visible = true;
                this.bonusPepite2.setText('X ' + scoreBonus);
            }

        }


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


        this.dollars.rotation += 0.2;

        var vitesseTete = userInBdd.vitesseEnMoins + 3 + levelNiveau - 10;
        if( vitesseTete < 3 )
            vitesseTete = 3;


        for (var i = 0; i < this.dynamite.length; i++) {
            var dynamite = this.dynamite[i];
            dynamite.y += vitesseTete;
            if (dynamite.y > game.config.height)
                dynamite.y = game.config.height+100;
        }

        for (var i = 1; i < this.tetes.length; i++) {
            var tete = this.tetes[i];
            if (currentHealth == 0 || nextLevel >= 25) {
                tete.destroy();
                this.dollars.destroy();
            } else {
                if (tete.rotation != 0) {
                    if (tete.sens == 'negatif')
                        tete.rotation -= 0.1;
                    else
                        tete.rotation += 0.1;
                }

                tete.y += vitesseTete;

                if (tete.y > game.config.height && tete.visible == true ) {
                    if( tete.teteOver != teteWanted ) {
                        if( this.vies > 0){
                            this.vies--;
                            this.life[0].visible = false;
                            this.life.shift();
                            tete.y = tete.departY;
                        }else {
                            currentHealth = 0;
                        }
                    }
                    else
                        tete.y = tete.departY;

                }
            }
        }

        var vitesseDollars = userInBdd.vitesseEnMoins + 6 + levelNiveau - 10;
        if( vitesseDollars < 5)
            vitesseDollars = 5;
        if( this.dollars.direction == 0 ){
            this.dollars.x -= vitesseDollars;
        }
        else {
            this.dollars.x += vitesseDollars;
        }

        if(  this.pepite && this.pepite.direction == 0 )
            this.pepite.x -= 7;
        else if( this.pepite && this.pepite.direction == 1 )
            this.pepite.x += 7;

        if (positif == 1) {
            this.dollars.y -= 2;
            if( this.pepite )
                this.pepite.y -= 2;
        }
        else {
            this.dollars.y += 2;
            if( this.pepite )
                this.pepite.y += 2;
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