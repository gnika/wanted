


class map extends Phaser.Scene {
    constructor() {
        super({
            key: 'map'
        });
    }

    preload() {
        this.load.image('map', 'http://wanted.local/assets/images/map/map.png');
        this.load.image('tete_map', 'http://wanted.local/assets/images/map/tete_map.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('saloon', 'assets/images/map/saloon.png');
        this.load.image('saloon_open', 'assets/images/map/saloon_open.png');
        this.load.image('chariot', 'assets/images/map/chariot.png');
        this.load.image('chariot_open', 'assets/images/map/chariot_open.png');
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('spark0', 'assets/particles/blue.png');
        this.load.image('spark1', 'assets/particles/red.png');
        this.load.image('pepite', 'assets/images/pepite.png');

    }

    create() {
        const dbRef = firebase.database().ref();
        dbRef.child("users").child(userConnected.uid).on('value', (snapshot) => {
            if (snapshot.exists()) {
                userInBdd = snapshot.val();
            }
        });

        var decor = this.add.image(game.config.width/2, game.config.height/2, 'map');

        scoreDisplay = this.add.text(this.cameras.main.width / 2 - 70, 10, userInBdd.score,
            {fill: cssColors.aqua, fontFamily: "Luckiest Guy", fontSize: 52});

        var gold = this.add.image(this.cameras.main.width /2 -120, 40, 'gold');
        pepiteDisplay = this.add.text(120, this.cameras.main.height - 80, userInBdd.pepite,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
            .setShadow(2, 2, cssColors.navy, 8);
        var pepite = this.add.image(50, this.cameras.main.height -50, 'pepite');

        this.saloonHover = this.add.image(game.config.width - 200, game.config.height - 300, 'saloon_open').setInteractive()
            .on('pointerdown', () => {
                if( userInBdd.entreeSaloon == 0 ) {
                    var dialog = this.rexUI.add.dialog({
                        x: 400,
                        y: 300,

                        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

                        title: this.rexUI.add.label({
                            background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                            text: this.add.text(50, 0, 'Saloon', {
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
                            this.add.text(0, 0, '1000 gold to enter', {fontSize: '24px', fontFamily: "Luckiest Guy"})

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
                                if (userInBdd.score >= 1000) {
                                     writeUserData(
                                         userConnected.uid,
                                         userConnected.displayName,
                                         userConnected.email,
                                         userConnected.photoURL,
                                         userInBdd.level,
                                         userInBdd.score - 1000,
                                         1,
                                        userInBdd.timeAdd,
                                        userInBdd.recompenseAdd,
                                        userInBdd.vitesseEnMoins,
                                        userInBdd.pepite,
                                         userInBdd.entreeChariot
                                     );
                                     scoreDisplay.setText(userInBdd.score - 1000);
                                     
                                    userInBdd.entreeSaloon = 1;
                                    dialog.visible = false;
                                    var emitter0 = this.add.particles('spark0').createEmitter({
                                        x: game.config.width - 200,
                                        y: game.config.height - 300,
                                        speed: {min: -800, max: 800},
                                        angle: {min: 0, max: 360},
                                        scale: {start: 0.5, end: 0},
                                        blendMode: 'SCREEN',
                                        //active: false,
                                        lifespan: 600,
                                        gravityY: 800
                                    });

                                    var emitter1 = this.add.particles('spark1').createEmitter({
                                        x: game.config.width - 200,
                                        y: game.config.height - 300,
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
                                            scoreDisplay.setStyle({fill: cssColors.aqua})
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
                    this.scene.start("saloon");
                }

            })
            .on('pointerover', () => this.saloon)
            .on('pointerout', () => this.saloon.visible = true);

        this.saloon = this.add.image(game.config.width - 200, game.config.height - 300, 'saloon').setInteractive()
            .on('pointerover', () => this.saloon.visible = false);

        this.chariotHover = this.add.image(200, 300, 'chariot_open').setInteractive()
            .on('pointerdown', () => {
                if( userInBdd.entreeChariot == 0 ) {
                    var dialog = this.rexUI.add.dialog({
                        x: 400,
                        y: 300,

                        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

                        title: this.rexUI.add.label({
                            background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                            text: this.add.text(50, 0, 'Chariot', {
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
                            this.add.text(0, 0, '3 gold nuggets to enter', {fontSize: '24px', fontFamily: "Luckiest Guy"})

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
                                if (userInBdd.pepite >= 3) {
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
                                        userInBdd.pepite - 3,
                                         1
                                     );
                                     pepiteDisplay.setText(userInBdd.pepite);

                                    userInBdd.entreeChariot = 1;
                                    dialog.visible = false;
                                    var emitter0 = this.add.particles('spark0').createEmitter({
                                        x: 200,
                                        y: 300,
                                        speed: {min: -800, max: 800},
                                        angle: {min: 0, max: 360},
                                        scale: {start: 0.5, end: 0},
                                        blendMode: 'SCREEN',
                                        //active: false,
                                        lifespan: 600,
                                        gravityY: 800
                                    });

                                    var emitter1 = this.add.particles('spark1').createEmitter({
                                        x: 200,
                                        y: 300,
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
                                    pepiteDisplay.setStyle({fill: 'red'})
                                    pepiteDisplay.setFontSize(60);
                                    this.time.addEvent({
                                        delay: 300,
                                        callback: () => {
                                            pepiteDisplay.setFontSize(52);
                                            pepiteDisplay.setStyle({fill: cssColors.aqua})
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
                    this.scene.start("shop");
                }

            })
            .on('pointerover', () => this.chariot)
            .on('pointerout', () => this.chariot.visible = true);

        this.chariot = this.add.image(200, 300, 'chariot').setInteractive()
            .on('pointerover', () => this.chariot.visible = false);

        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 50, 'return').setInteractive()
            .on('pointerdown', () => this.scene.start("MainScene"));

        for (var i = 0; i <= userInBdd.level; i++){
            if( i == 0)
                this.pointMap0 = this.add.image(game.config.width/2 - 10, game.config.height - 120, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 0; levelNiveau = 0; currentHealth = 50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap0))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap0));
            if( i == 1)
                this.pointMap1 = this.add.image(game.config.width/1.5 + 20 , game.config.height - 160, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 1; levelNiveau = 1; currentHealth =  50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap1))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap1));
            if( i == 2)
                this.pointMap2 = this.add.image(game.config.width/2  + 30, game.config.height - 190, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 1; levelNiveau = 2; currentHealth =  50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap2))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap2));
            if( i == "3")
                this.pointMap3 = this.add.image(game.config.width/2 -40, game.config.height - 240, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 1; levelNiveau = 3; currentHealth =  50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap3))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap3));
            if( i == "4")
                this.pointMap4 = this.add.image(game.config.width/3 - 40, game.config.height - 260, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 2; levelNiveau = 4; currentHealth =  50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap4))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap4));
            if( i == "5")
                this.pointMap5 = this.add.image(game.config.width/2 -25, game.config.height - 320, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {nbBandit = 2; levelNiveau = 5; currentHealth =  50 + userInBdd.timeAdd; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap5))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap5));
        }


    }

    update() {

    }

    enterPointHoverState(button) {
        button.rotation += 0.6;
    }

    enterPointRestState(button) {
        button.rotation = 0;
    }
}