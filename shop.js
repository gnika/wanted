


class shop extends Phaser.Scene {
    constructor() {
        super({
            key: 'shop'
        });
    }

    preload() {
        this.load.image('fondboard', 'assets/textures/wood_by_EricHart3d.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('pepite', 'assets/images/pepite.png');
        this.load.image('pepite_mini', 'assets/images/tetes/pepite.png');
        this.load.image('time', 'assets/images/time.png');
        this.load.image('wanted_mini', 'assets/images/wanted/wanted_mini.png');
        this.load.image('gold_mini', 'assets/images/gold_mini.png');
        this.load.image('tete1_mini', 'assets/images/tetes/tete1_mini.png');
        this.load.image('fond_or', 'assets/images/fond_or.png');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('level_done', 'assets/images/map/level_done.png');
    }

    create() {
        this.effetAchat = 0;
        this.add.image(400, 350, 'fondboard');
        this.add.image(400, 750, 'fondboard');


        this.add.image( 250, 120, 'fond_or');
        this.scoreDisplay = this.add.text(270, 85, userInBdd.score,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52});
        var gold = this.add.image(this.cameras.main.width /2 - 300, 125, 'gold');


        var r1 = this.add.rectangle(400, 300, 480, 80, 0XB45F06 );
        var r2 = this.add.rectangle(400, 400, 480, 80, 0XB45F06 );
        var r3 = this.add.rectangle(400, 500, 480, 80, 0XB45F06 );
        var r4 = this.add.rectangle(400, 600, 480, 80, 0XB45F06 );

        //premiere ligne
        this.timeAdd = this.add.text(170, 280, '+ 5 ', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(280, 300, 'time');

        this.costAdd = this.add.text(380, 270, '5 ', {fill: 'yellow', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(440, 300, 'pepite_mini');

        this.timeAcuel = this.add.text(500, 270, 50 + userInBdd.timeAdd, {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})


        if( userInBdd.timeAdd < 50 )
            this.achat1 = this.add.text(600, 250, '+', {fill: 'green', fontFamily: "Luckiest Guy", fontSize: 75}).setInteractive()
            .on('pointerdown', () => this.achat('time'))
            .on('pointerover', () => this.enterButtonHoverState(this.achat1))
            .on('pointerout', () => this.enterButtonRestState(this.achat1));




        //deuxieme ligne
        this.timeAdd = this.add.text(157, 380, '+25', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 42})
        this.add.image(245, 400, 'gold_mini');
        this.timeAdd = this.add.text(270, 380, '/', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(335, 400, 'wanted_mini');

        this.costReward = this.add.text(380, 370, '3 ', {fill: 'yellow', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(440, 400, 'pepite_mini');

        this.rewardAcuel = this.add.text(500, 370, userInBdd.recompenseAdd, {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        if( userInBdd.recompenseAdd < 10 )
            this.achat2 = this.add.text(600, 350, '+', {fill: 'green', fontFamily: "Luckiest Guy", fontSize: 75}).setInteractive()
                .on('pointerdown', () => this.achat('reward'))
                .on('pointerover', () => this.enterButtonHoverState(this.achat2))
                .on('pointerout', () => this.enterButtonRestState(this.achat2));



        //troisieme ligne
        this.timeAdd = this.add.text(161, 480, 'Slower', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 32})
        this.add.image(325, 500, 'tete1_mini');

        this.costVitesse = this.add.text(380, 470, '5 ', {fill: 'yellow', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(440, 500, 'pepite_mini');

        this.vitesseAcuel = this.add.text(500, 470, userInBdd.vitesseEnMoins, {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        if( userInBdd.vitesseEnMoins > -5 )
            this.achat3 = this.add.text(600, 450, '+', {fill: 'green', fontFamily: "Luckiest Guy", fontSize: 75}).setInteractive()
                .on('pointerdown', () => this.achat('vitesse'))
                .on('pointerover', () => this.enterButtonHoverState(this.achat3))
                .on('pointerout', () => this.enterButtonRestState(this.achat3));


        //quatrieme ligne
        this.timeAdd = this.add.text(161, 570, '- 1000', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(360, 600, 'gold_mini');
        this.timeAdd = this.add.text(431, 570, '+ 5', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        this.add.image(525, 600, 'pepite_mini');

        this.achat4 = this.add.text(600, 550, '+', {fill: 'green', fontFamily: "Luckiest Guy", fontSize: 75}).setInteractive()
            .on('pointerdown', () => this.achat('echange'))
            .on('pointerover', () => this.enterButtonHoverState(this.achat4))
            .on('pointerout', () => this.enterButtonRestState(this.achat4));

        this.levelDone = this.add.text(700, 450, '- 1', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
        this.levelDoneImg = this.add.image(700, 550, 'level_done');

        this.levelDone.visible = false;
        this.levelDoneImg.visible = false;

        this.levelDone.originY = 450;
        this.levelDoneImg.originY = 550;

        pepiteDisplay = this.add.text(120, this.cameras.main.height - 80, userInBdd.pepite,
            {fill: cssColors.yellow, fontFamily: "Luckiest Guy", fontSize: 52})
            .setShadow(2, 2, cssColors.navy, 8);
        var pepite = this.add.image(50, this.cameras.main.height -50, 'pepite');

        var iconReturn = this.add.image(600, 800, 'return').setInteractive()
            .on('pointerdown', () => this.scene.start("map"));



        this.tweens.add({
            targets: r1,
            alpha: 0.2,
            yoyo: false,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: r2,
            alpha: 0.2,
            yoyo: false,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: r3,
            alpha: 0.2,
            yoyo: false,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: r4,
            alpha: 0.2,
            yoyo: false,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });




    }

    enterButtonHoverState(button) {
        //textMenu = '#ff0';
        button.setStyle({ fill: '#56d556'});
    }

    enterButtonRestState(button) {
        //textMenu = 'brown';
        button.setStyle({ fill: 'green'});
    }

    achat( attribut ) {

        var enoughMonney = 1;
        var enoughGold   = 1;

        if( attribut == 'time'){
            if (userInBdd.pepite >= 5) {
                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    userInBdd.level,
                    userInBdd.score,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd + 5,
                    userInBdd.recompenseAdd,
                    userInBdd.vitesseEnMoins,
                    userInBdd.pepite - 5,
                    userInBdd.entreeChariot
                );
                pepiteDisplay.setText(userInBdd.pepite);
                this.timeAcuel.setText(userInBdd.timeAdd + 50);
                if( userInBdd.timeAdd >= 50 )
                    this.achat1.destroy();
            }else enoughMonney = 0;
        }

        if( attribut == 'reward'){
            if ( userInBdd.pepite >= 3 ) {
                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    userInBdd.level,
                    userInBdd.score,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd,
                    userInBdd.recompenseAdd + 25,
                    userInBdd.vitesseEnMoins,
                    userInBdd.pepite - 3,
                    userInBdd.entreeChariot
                );
                pepiteDisplay.setText(userInBdd.pepite);
                this.rewardAcuel.setText(userInBdd.recompenseAdd);
                if( userInBdd.recompenseAdd >= 10 )
                    this.achat2.destroy();
            }else enoughMonney = 0;
        }

        if( attribut == 'vitesse'){
            if (userInBdd.pepite >= 5) {
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
                    userInBdd.vitesseEnMoins - 1,
                    userInBdd.pepite - 5,
                    userInBdd.entreeChariot
                );
                pepiteDisplay.setText(userInBdd.pepite);
                this.vitesseAcuel.setText(userInBdd.vitesseEnMoins);
                if( userInBdd.vitesseEnMoins <= -5 )
                    this.achat3.destroy();
            }else enoughMonney = 0;
        }

        if( attribut == 'echange'){

            if (userInBdd.score >= 1000) {


                this.effetAchat = 1;
                var newLevel = userInBdd.level - 1;

                if( newLevel < 0 )
                    newLevel = 0;

                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                    newLevel,
                    userInBdd.score - 1000,
                    userInBdd.entreeSaloon,
                    userInBdd.timeAdd,
                    userInBdd.recompenseAdd,
                    userInBdd.vitesseEnMoins,
                    userInBdd.pepite + 5,
                    userInBdd.entreeChariot
                );
                this.scoreDisplay.setText(userInBdd.score);
                pepiteDisplay.setText(userInBdd.pepite);
            }else enoughGold = 0;
        }

        if ( enoughMonney == 0 ) {
            pepiteDisplay.setStyle({fill: 'red'})
            pepiteDisplay.setFontSize(60);
            this.time.addEvent({
                delay: 300,
                callback: () => {
                    pepiteDisplay.setFontSize(52);
                    pepiteDisplay.setStyle({fill: cssColors.yellow})
                },
                loop: false
            });
        }

        if ( enoughGold == 0 ) {
            this.scoreDisplay.setStyle({fill: 'red'})
            this.scoreDisplay.setFontSize(60);
            this.time.addEvent({
                delay: 300,
                callback: () => {
                    this.scoreDisplay.setFontSize(52);
                    this.scoreDisplay.setStyle({fill: cssColors.yellow})
                },
                loop: false
            });
        }
    }

    update() {
        if( this.effetAchat == 1 ){
            this.levelDone.visible = true;
            this.levelDoneImg.visible = true;

            this.levelDone.y = this.levelDone.y+1;

            this.levelDoneImg.y = this.levelDoneImg.y+1;
            if( this.levelDone.y >= this.levelDone.originY + 50 ){
                this.effetAchat = 0;
                this.levelDone.visible = false;
                this.levelDoneImg.visible = false;
                this.levelDone.y = this.levelDone.originY;
                this.levelDoneImg.y = this.levelDoneImg.originY;
            }
        }

    }
}