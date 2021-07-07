


class map4 extends Phaser.Scene {
    constructor() {
        super({
            key: 'map4'
        });
    }

    preload() {
        this.load.image('map4', 'assets/images/map/map4.png');
        this.load.image('level', 'assets/images/map/level.png');
        this.load.image('level_done', 'assets/images/map/level_done.png');
        this.load.image('level_precedent', 'assets/images/map/level_precedent.png');
        this.load.image('tete_map', 'assets/images/map/tete_map.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('saloon', 'assets/images/map/saloon.png');
        this.load.image('store', 'assets/images/map/store.png');
        this.load.image('store_open', 'assets/images/map/store_open.png');
        this.load.image('saloon_open', 'assets/images/map/saloon_open.png');
        this.load.image('chariot', 'assets/images/map/chariot.png');
        this.load.image('chariot_open', 'assets/images/map/chariot_open.png');
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('spark0', 'assets/particles/blue.png');
        this.load.image('spark1', 'assets/particles/red.png');
        this.load.image('pepite', 'assets/images/pepite.png');
        this.load.image('fond_or', 'assets/images/fond_or.png');
        this.load.image('next_off', 'assets/images/map/next_off.png');
        this.load.image('next_on', 'assets/images/map/next_on.png');

    }

    create() {
        const dbRef = firebase.database().ref();
        dbRef.child("users").child(userConnected.uid).on('value', (snapshot) => {
            if (snapshot.exists()) {
                userInBdd = snapshot.val();
            }
        });

        var decor = this.add.image(game.config.width/2, game.config.height/2, 'map4');
        var decor = this.add.image( 250, 120, 'fond_or');

        scoreDisplay = this.add.text(270, 85, userInBdd.score,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52});

        var gold = this.add.image(this.cameras.main.width /2 - 300, 125, 'gold');
        pepiteDisplay = this.add.text(120, this.cameras.main.height - 80, userInBdd.pepite,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
            .setShadow(2, 2, cssColors.navy, 8);
        var pepite = this.add.image(50, this.cameras.main.height -50, 'pepite');

        this.shopHover = this.add.image(350, 400, 'store_open').setInteractive()
            .on('pointerdown', () => {
                if( userInBdd.entreeMagasin2 < 2 ) {
                    var dialog = this.rexUI.add.dialog({
                        x: 400,
                        y: 300,

                        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

                        title: this.rexUI.add.label({
                            background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                            text: this.add.text(50, 0, 'Store', {
                                fontSize: '24px', fontFamily: "Luckiest Guy"
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),

                        content:
                            this.add.text(0, 0, '80000 gold to enter', {fontSize: '24px', fontFamily: "Luckiest Guy"})

                        ,

                        actions: [], // Assing an empty array instead of `undefined`

                        space: {
                            title: 25,
                            content: 25,
                            action: 15,

                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },

                        align: {
                            actions: 'right', // 'center'|'left'|'right'
                        },

                        expand: {
                            content: false, // Content is a pure text object
                        }
                    })
                        .addAction([
                            createLabel(this, 'Yes'),
                            createLabel(this, 'No'),
                        ])
                        .layout()
                        // .drawBounds(this.add.graphics(), 0xff0000)
                        .popUp(1000);
                    dialog
                        .on('button.click', function (button, groupName, index) {
                            //this.print.text += index + ': ' + button.text + '\n';
                            if (index == 0) {//yes
                                if (userInBdd.score >= 80000) {
                                    writeUserData(
                                        userConnected.uid,
                                        userConnected.displayName,
                                        userConnected.email,
                                        userConnected.photoURL,
                                        userInBdd.level,
                                        userInBdd.score - 80000,
                                        userInBdd.entreeSaloon,
                                        userInBdd.timeAdd,
                                        userInBdd.recompenseAdd,
                                        userInBdd.vitesseEnMoins,
                                        userInBdd.pepite,
                                        userInBdd.entreeChariot,
                                        2,
                                        userInBdd.dynamite,
                                        userInBdd.vie,
                                        userInBdd.onetouchtwomatch
                                    );
                                    scoreDisplay.setText(userInBdd.score);

                                    userInBdd.entreeMagasin2 = 2;
                                    dialog.visible = false;
                                    var emitter0 = this.add.particles('spark0').createEmitter({
                                        x: 350,
                                        y: 400,
                                        speed: {min: -800, max: 800},
                                        angle: {min: 0, max: 360},
                                        scale: {start: 0.5, end: 0},
                                        blendMode: 'SCREEN',
                                        //active: false,
                                        lifespan: 600,
                                        gravityY: 800
                                    });

                                    var emitter1 = this.add.particles('spark1').createEmitter({
                                        x: 350,
                                        y: 400,
                                        speed: {min: -800, max: 800},
                                        angle: {min: 0, max: 360},
                                        scale: {start: 0.3, end: 0},
                                        blendMode: 'SCREEN',
                                        //active: false,
                                        lifespan: 300,
                                        gravityY: 800
                                    });

                                    this.time.addEvent({
                                        delay: 300,
                                        callback: () => {
                                            emitter0.on = false;
                                            emitter1.on = false;
                                        },
                                        loop: false
                                    });

                                } else {
                                    //TweenHelper.flashElement(this, scoreDisplay);
                                    scoreDisplay.setStyle({fill: 'red'})
                                    scoreDisplay.setFontSize(60);
                                    this.time.addEvent({
                                        delay: 300,
                                        callback: () => {
                                            scoreDisplay.setFontSize(52);
                                            scoreDisplay.setStyle({fill: cssColors.yellow})
                                        },
                                        loop: false
                                    });
                                }
                            } else {
                                dialog.visible = false;
                            }
                        }, this)
                        .on('button.over', function (button, groupName, index) {
                            button.getElement('background').setStrokeStyle(1, 0xffffff);
                        })
                        .on('button.out', function (button, groupName, index) {
                            button.getElement('background').setStrokeStyle();
                        });
                }else{
                    this.scene.start("shop4");
                }

            })
            .on('pointerover', () => this.shop4)
            .on('pointerout', () => this.shop4.visible = true);

        this.shop4 = this.add.image(350, 400, 'store').setInteractive()
            .on('pointerover', () => this.shop4.visible = false);


        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 50, 'return').setInteractive()
            .on('pointerdown', () => this.scene.start("map3"));

        currentHealth = 50 + userInBdd.timeAdd;
        nextLevel     = 0;


        for (var i = 30; i <= 39; i++){
            if( userInBdd.level >= i )
                var img = 'level_done';
            else
                var img = 'level';

            var Xlevel = 0;
            var Ylevel = 0;
            var bandits = 0;

            if( i == 30 ){
                Xlevel = game.config.width / 2 + 135;
                Ylevel = game.config.height - 120;
                var bandits = 2;
                this.pointMap0 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 31 ){
                Xlevel = game.config.width / 2 - 50;
                Ylevel = game.config.height - 130;
                var bandits = 3;
                this.pointMap1 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 32 ){
                Xlevel = 180;
                Ylevel = game.config.height - 200;
                var bandits = 3;
                this.pointMap2 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 33 ){
                Xlevel = 280;
                Ylevel = game.config.height - 340;
                var bandits = 3;
                this.pointMap3 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 34 ){
                Xlevel = 430;
                Ylevel = game.config.height - 430;
                var bandits = 4;
                this.pointMap4 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 35 ){
                Xlevel = 310;
                Ylevel = game.config.height - 490;
                var bandits = 4;
                this.pointMap5 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 36 ){
                Xlevel = 190;
                Ylevel = game.config.height - 700;
                var bandits = 4;
                this.pointMap6 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 37 ){
                Xlevel = 500;
                Ylevel = game.config.height - 700;
                var bandits = 5;
                this.pointMap7 = this.add.image(Xlevel, Ylevel, img);
            }

            if( i == 38 ){
                Xlevel = 600;
                Ylevel = game.config.height - 850;
                var bandits = 5;
                this.pointMap8 = this.add.image(Xlevel , Ylevel, img);
            }

            if( i == 39 ){
                Xlevel = 445;
                Ylevel = game.config.height - 860;
                var bandits = 6;
                this.pointMap9 = this.add.image(Xlevel, Ylevel, img);
            }

            if( userInBdd.level == i ) {
                var niveau = i;
                var banditsParam = bandits;
                this.teteHead = this.add.image(Xlevel, Ylevel, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {
                        this.passWanted(banditsParam, niveau);
                    })
                    .on('pointerover', () => this.enterPointHoverState(this.teteHead))
                    .on('pointerout', () => this.enterPointRestState(this.teteHead));
            }

            if( userInBdd.level - 10 -1 == i ) {
                var niveauPrecedent = i + 10;
                var banditsParamPrecedent = bandits;
                this.teteHead = this.add.image(Xlevel, Ylevel, 'level_precedent')
                    .setInteractive()
                    .on('pointerdown', () => {
                        this.passWanted(banditsParamPrecedent, niveauPrecedent);
                    });
            }

        }


    }

    update() {

    }

    passWanted( nbBanditParam, levelNiveauParam) {
        nbBandit = nbBanditParam;
        levelNiveau = levelNiveauParam - 10;
        teteBonus            = 0;
        if( userInBdd.level == levelNiveauParam ||  userInBdd.level -1 == levelNiveauParam )
            this.scene.start("wanted2");
    }

    enterPointHoverState(button) {
        button.rotation += 0.6;
    }

    enterPointRestState(button) {
        button.rotation = 0;
    }
}