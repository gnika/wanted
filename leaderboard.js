


class leaderboard extends Phaser.Scene {
    constructor() {
        super({
            key: 'leaderboard'
        });
    }

    preload() {
        this.load.image('fondboard', 'assets/images/boardgame/fond.jpg');
        this.load.image('return', 'assets/images/return.png');
    }

    create() {
        var decor = this.add.image(400, 500, 'fondboard');
        var iconReturn = this.add.image(game.config.width - 100, game.config.height - 250, 'return').setInteractive()
            .on('pointerdown', () => this.scene.start("MainScene"));
        var starCountRef = firebase.database().ref('users').orderByChild('score');
        var place = 1;
        var stopCounting = 0;
        starCountRef.on('value', (snapshot) => {

            this.usersBoard = [];

            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                this.usersBoard.push(childData);
            });
            this.usersBoard.reverse();
            this.texts = [];

            for(var i =0; i < this.usersBoard.length; i++){
                if( userInBdd != null ){
                    if( this.usersBoard[i].username.length > 0) {
                        console.log(this.usersBoard[i].username, userInBdd.username);
                        if (this.usersBoard[i].username == userInBdd.username) {
                            stopCounting = 1;
                        }
                    }
                }
                if( stopCounting == 0 )
                    place ++;
            }

            if( userInBdd != null ){
                this.add.text(
                    100,
                    100,
                    'You are '+place+' on '+this.usersBoard.length+' with the score : '+userInBdd.score,
                    {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 25});
            }


            for(var i =0; i < 10; i++){//this.usersBoard.length
                if( this.usersBoard[i] != null ){
                    var textAdd = this.add.text(
                        100,
                        200 + 50*i,
                        (i+1)+' - '+this.usersBoard[i].username+' - score : '+this.usersBoard[i].score,
                        {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 25});
                    this.texts.push(textAdd);
                }
            }
        });

    }

    update() {

    }
}