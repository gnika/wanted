


class wanted extends Phaser.Scene {
    constructor() {
        super({
            key: 'wanted'
        });
    }

    preload() {
        this.load.image('bigtete1', 'http://wanted.local/assets/images/tetes/tete1.png');
        this.load.image('bigtete2', 'http://wanted.local/assets/images/tetes/tete2.png');
        this.load.image('bigtete3', 'http://wanted.local/assets/images/tetes/tete3.png');
        this.load.image('bigtete4', 'http://wanted.local/assets/images/tetes/tete4.png');
        this.load.image('tete1', 'http://wanted.local/assets/images/tetes/tete1_mini.png');
        this.load.image('tete2', 'http://wanted.local/assets/images/tetes/tete2_mini.png');
        this.load.image('tete3', 'http://wanted.local/assets/images/tetes/tete3_mini.png');
        this.load.image('tete4', 'http://wanted.local/assets/images/tetes/tete4_mini.png');
        this.load.image('fondWanted', 'assets/images/wanted/fond_wanted.png');
        this.load.image('wanted', 'assets/images/wanted/wanted.png');
    }

    create() {

        var tetRechercheeNumber  = Phaser.Math.Between(1, 4);//A MODIFIER SELON LE NOMBRE DE TETE DISPOS
        var toutesLesTetes = [1, 2, 3, 4];//A MODIFIER SELON LE NOMBRE DE TETE DISPOS

        for( var i = 0; i < toutesLesTetes.length; i++){
            if ( toutesLesTetes[i] === tetRechercheeNumber) {
                toutesLesTetes.splice(i, 1);
            }
        }

        var tetRecherchee        = 'bigtete'+tetRechercheeNumber;
        var notWanted        = get_random(toutesLesTetes);

        for( var i = 0; i < toutesLesTetes.length; i++){
            if ( toutesLesTetes[i] === notWanted) {
                toutesLesTetes.splice(i, 1);
            }
        }
        notWanted            = 'tete'+notWanted;
        var decor = this.add.image(400, 300, 'fondWanted')
            .setInteractive()
            .on('pointerdown', () => {this.scene.start("jeu")}
            );
        this.add.image(game.config.width / 2, game.config.height / 2, tetRecherchee);
        this.addWanted = 0;
        this.widthWanted = 640;
        this.heightWanted = 637;

        teteWanted = 'tete'+tetRechercheeNumber;
        bigTeteWanted = tetRecherchee;
        teteNotWanted = notWanted;
        totalTetes = toutesLesTetes;

        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.addWanted = 1;
                this.imageWanted  =  this.add.sprite(game.config.width / 2, game.config.height / 2, 'wanted');
            },
            loop: false
        });



    }

    update() {
        if( this.addWanted == 1){


            if( this.widthWanted > 550 ) {
                this.widthWanted--;
                this.heightWanted--;
                this.imageWanted.displayWidth =this.widthWanted ;
                this.imageWanted.displayHeight =this.heightWanted ;
            }
        }
    }
}