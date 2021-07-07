


class wanted2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'wanted2'
        });
    }

    preload() {
        this.load.image('bigtete1', 'assets/images/tetes/tete1.png');
        this.load.image('bigtete2', 'assets/images/tetes/tete2.png');
        this.load.image('bigtete3', 'assets/images/tetes/tete3.png');
        this.load.image('bigtete4', 'assets/images/tetes/tete4.png');
        this.load.image('tete1', 'assets/images/tetes/tete1_mini.png');
        this.load.image('tete2', 'assets/images/tetes/tete2_mini.png');
        this.load.image('tete3', 'assets/images/tetes/tete3_mini.png');
        this.load.image('tete4', 'assets/images/tetes/tete4_mini.png');
        this.load.image('fondWanted', 'assets/images/wanted/fond_wanted.png');
        this.load.image('wanted', 'assets/images/wanted/wanted.png');
        this.load.image('gold', 'assets/images/gold.png');
        this.load.image('pepite', 'assets/images/tetes/pepite.png');
    }

    create() {
        game.sound.setMute(true);
        var tetRechercheeNumber  = Phaser.Math.Between(1, 4);//A MODIFIER SELON LE NOMBRE DE TETE DISPOS
        var toutesLesTetes = [1, 2, 3, 4];//A MODIFIER SELON LE NOMBRE DE TETE DISPOS

        for( var i = 0; i < toutesLesTetes.length; i++){
            if ( toutesLesTetes[i] === tetRechercheeNumber) {
                toutesLesTetes.splice(i, 1);
            }
        }

        bonusTete            = get_random(toutesLesTetes);
        teteBonus            = 0;
        var tetRecherchee    = 'bigtete'+tetRechercheeNumber;

        var decor = this.add.image(400, 600, 'fondWanted')
            .setInteractive()
            .on('pointerdown', () => {this.scene.start("jeu2")}
            );
        this.add.image(game.config.width / 2, game.config.height / 2, tetRecherchee);
        this.addWanted = 0;
        this.widthWanted = 640;
        this.heightWanted = 637;

        teteWanted = 'tete'+tetRechercheeNumber;
        bigTeteWanted = tetRecherchee;

        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.addWanted = 1;
                this.imageWanted  =  this.add.sprite(game.config.width / 2, game.config.height / 2, 'wanted');
                this.bandit = this.add.sprite(this.cameras.main.width / 2 - 100,  70, 'tete'+bonusTete);
                this.textBonus = this.add.text(50,  50, 'BONUS',
                    {fill: "brown", fontFamily: "Luckiest Guy", fontSize: 52});

                if( levelNiveau > 10 )var nbPepit = 1;else nbPepit = 0;
                this.nbPepiteDisplay = this.add.text(this.cameras.main.width / 2 + 100,  50, nbPepit,
                    {fill: "brown", fontFamily: "Luckiest Guy", fontSize: 52});
                this.pepiteDisplay = this.add.sprite(this.cameras.main.width / 2 + 200 ,  70, 'pepite');
                this.pepiteDisplay.visible = false;
                this.nbPepiteDisplay.visible = false;
                this.bandit.visible = false;
                this.textBonus.visible = false;

            },
            loop: false
        });

        var headScores = levelNiveau * 5;//recompense par tete
        if( headScores == 0 )
            headScores = 50;

        headScore = headScores + userInBdd.recompenseAdd;

        this.rewDisplay = this.add.text(this.cameras.main.width / 2 - 200, this.cameras.main.height - 200, "REWARDS :   "+headScore,
            {fill: "brown", fontFamily: "Luckiest Guy", fontSize: 52});
        this.goldDisplay = this.add.image(this.cameras.main.width / 2 + 220, this.cameras.main.height - 180, 'gold');


        this.rewDisplay.visible = false;
        this.goldDisplay.visible = false;

    }

    update() {
        if( this.addWanted == 1){


            if( this.widthWanted > 550 ) {
                this.widthWanted--;
                this.heightWanted--;
                this.imageWanted.displayWidth =this.widthWanted ;
                this.imageWanted.displayHeight =this.heightWanted ;
            }else{

                this.pepiteDisplay.visible = true;
                this.nbPepiteDisplay.visible = true;

                this.rewDisplay.visible = true;
                this.goldDisplay.visible = true;

                this.bandit.visible = true;
                this.textBonus.visible = true;

            }
        }
    }
}