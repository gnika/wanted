


class map extends Phaser.Scene {
    constructor() {
        super({
            key: 'map'
        });
    }

    preload() {
        this.load.image('map', 'http://wanted.local/assets/images/map/map.png');
        this.load.image('tete_map', 'http://wanted.local/assets/images/map/tete_map.png');
    }

    create() {
        var decor = this.add.image(game.config.width/2, game.config.height/2, 'map');

        for (var i = 0; i <= userInBdd.level; i++){
            if( i == 0)
                this.pointMap0 = this.add.image(game.config.width/2 - 10, game.config.height - 120, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 0; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap0))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap0));
            if( i == 1)
                this.pointMap1 = this.add.image(game.config.width/1.5 + 20 , game.config.height - 160, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 1; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap1))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap1));
            if( i == 2)
                this.pointMap2 = this.add.image(game.config.width/2  + 30, game.config.height - 190, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 2; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap2))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap2));
            if( i == "3")
                this.pointMap3 = this.add.image(game.config.width/2 -40, game.config.height - 240, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 3; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap3))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap3));
            if( i == "4")
                this.pointMap4 = this.add.image(game.config.width/3 - 40, game.config.height - 260, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 4; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
                    .on('pointerover', () => this.enterPointHoverState(this.pointMap4))
                    .on('pointerout', () => this.enterPointRestState(this.pointMap4));
            if( i == "5")
                this.pointMap5 = this.add.image(game.config.width/2 -25, game.config.height - 320, 'tete_map')
                    .setInteractive()
                    .on('pointerdown', () => {levelNiveau = 5; currentHealth = 100; nextLevel = 0; this.scene.start("wanted")})
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