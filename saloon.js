


class saloon extends Phaser.Scene {
    constructor() {
        super({
            key: 'saloon'
        });
    }

    preload() {
        this.load.image('fondboard', 'http://wanted.local/assets/images/boardgame/fondboard.png');
        this.load.image('return', 'assets/images/return.png');
    }

    create() {
        var decor = this.add.image(400, 400, 'fondboard');
        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 50, 'return').setInteractive()
            .on('pointerdown', () => this.scene.start("MainScene"));
        var starCountRef = firebase.database().ref('users').orderByChild('score');
        this.texts = [];
        starCountRef.on('value', (snapshot) => {

            this.usersBoard = [];

            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                this.usersBoard.push(childData);
            });
            this.usersBoard.reverse();
            for(var i =0; i < this.texts.length; i++){
                this.texts[i].destroy();
            }
            this.texts = [];

            for(var i =0; i < 10; i++){//this.usersBoard.length
                var textAdd = this.add.text(
                    100,
                    200 + 50*i,
                    (i+1)+' - '+this.usersBoard[i].username+' - score : '+this.usersBoard[i].score,
                    {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 25});
                this.texts.push(textAdd);
            }
        });

    }

    update() {

    }
}