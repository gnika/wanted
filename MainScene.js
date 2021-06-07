class MainScene extends Phaser.Scene    {

    constructor(){
        super({
            key: 'MainScene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
            });
    }
    preload () {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);
        var WebFontConfig = {
            google: {
                families: ['Luckiest Guy']
            }
        };

        this.load.rexWebFont(WebFontConfig);
        this.load.image('decors', 'assets/images/decors/street.png');
        this.load.image('return', 'assets/images/return.png');
        this.load.image('menu1', 'assets/images/main/menu1.png');
        this.load.image('menu2', 'assets/images/main/menu2.png');
        this.load.image('menu3', 'assets/images/main/menu3.png');

    }
    create () {

        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyCbHGEAhnqMtcJbpYU9jdjqc75bnGO23-Y",
            authDomain: "wanted-314813.firebaseapp.com",
            databaseURL: "https://wanted-314813-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "wanted-314813",
            storageBucket: "wanted-314813.appspot.com",
            messagingSenderId: "348028017682",
            appId: "1:348028017682:web:3d771c865cd77e62c00ccb"
        };
        // Initialize Firebase
        if( firebaseApp == null )
            firebaseApp = firebase.initializeApp(firebaseConfig);

        dbRef = firebase.database().ref();
        database =  firebase.database();

        //leaderboard = firestore pas database : https://phaser.discourse.group/t/plugin-leaderboard-error/9691/6
        //var leaderBoard = this.plugins.get('rexfirebaseplugin').add.leaderBoard({
          //  root: 'users',
          //  pageItemCount: 3
        //})

        const decors = this.add.image(400, 300, 'decors');
        this.tweens.add({
            targets: decors,
            x: 100,
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0,
            duration: 3000
        });

        this.cameras.main.fadeIn(3000);

        screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //firebaseApp.auth().signOut();
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {

                userConnected = firebase.auth().currentUser;

                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                //console.log(displayName + '(' + uid + '): ' + email);
            }
        });

        this.cameras.main.on('camerafadeoutcomplete', function () {

            this.scene.start("map");

        }, this);

        this.time.addEvent({
            delay: 3000,                // 3000 ms
            callback: ()=>{

                this.add.image(screenCenterX, screenCenterY - 165, 'menu1');
                this.add.image(screenCenterX, screenCenterY +160, 'menu3');

                if( userConnected != null) {

                    this.add.image(screenCenterX, screenCenterY , 'menu2');
                    this.clickButton = this.add.text(screenCenterX - 70 , screenCenterY - 200, 'PLAY', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
                        .setInteractive()
                        .on('pointerdown', () => this.passMap())
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton));

                    this.clickButton2 = this.add.text(screenCenterX - 100, screenCenterY -40, 'LOGOUT', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
                        .setInteractive()
                        .on('pointerdown', () => this.deconnect(this.scene))
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton2))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton2));
                }else{
                    this.clickButton3 = this.add.text(screenCenterX - 170 , screenCenterY - 200, 'LOGIN', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
                        .setInteractive()
                        .on('pointerdown', () => this.connect(this.scene))
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton3))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton3));

                }

                this.clickButton4 = this.add.text(screenCenterX /2 + 110, screenCenterY + 120, 'RANK', {fill: 'brown', fontFamily: "Luckiest Guy", fontSize: 52})
                    .setInteractive()
                    .on('pointerdown', () => this.scene.start("leaderboard"))
                    .on('pointerover', () => this.enterButtonHoverState(this.clickButton4))
                    .on('pointerout', () => this.enterButtonRestState(this.clickButton4));

            },
            //args: [],
            callbackScope: this,
            loop: false
        });

         //raccourci pour aller directement aux scenes que l'on code
        var iconReturn = this.add.image(game.config.width - 200, game.config.height - 250, 'return').setInteractive()
            .on('pointerdown', () => {
                const dbRef = firebase.database().ref();
                dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        userInBdd = snapshot.val();
                    } else {
                        //on créé l'utilisateur
                        writeUserData(
                            userConnected.uid,
                            userConnected.displayName,
                            userConnected.email,
                            userConnected.photoURL,
                            0,//level
                            0,//score
                            0,//entreeSaloon
                            0,
                            0,
                            0,
                            0,
                            0
                        );
                        userInBdd        = userConnected;
                        userInBdd.level  = 0;
                        userInBdd.score  = 0;
                        userInBdd.entreeSaloon  = 0;
                        userInBdd.timeAdd  = 0;
                        userInBdd.recompenseAdd  = 0;
                        userInBdd.vitesseEnMoins  = 0;
                        userInBdd.pepite  = 0;
                        userInBdd.entreeChariot  = 0;
                    }
                }).catch((error) => {
                    console.error(error);
                });
                this.scene.start("map");
            });


    }
    update () {

    }

    deconnect(sceneContext) {
        firebaseApp.auth().signOut();
        userConnected = null;
        sceneContext.restart();
    }

    connect(sceneContext) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebaseApp.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            if( user != null ) {
                sceneContext.restart();
            }
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...

            console.log(errorMessage);
        });
    }

    passMap() {
        const dbRef = firebase.database().ref();
        dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                userInBdd = snapshot.val();
            } else {
                //on créé l'utilisateur
                writeUserData(
                    userConnected.uid,
                    userConnected.displayName,
                    userConnected.email,
                    userConnected.photoURL,
                     0,//level
                     0,//score
                0,//entreeSaloon
                   0,
              0,
               0,
                    0,
                    0
                );
                userInBdd        = userConnected;
                userInBdd.level  = 0;
                userInBdd.score  = 0;
                userInBdd.entreeSaloon  = 0;
                userInBdd.timeAdd  = 0;
                userInBdd.recompenseAdd  = 0;
                userInBdd.vitesseEnMoins  = 0;
                userInBdd.pepite  = 0;
                userInBdd.entreeChariot  = 0;
            }
        }).catch((error) => {
            console.error(error);
        });

        //  Get a random color
        var red = Phaser.Math.Between(50, 255);
        var green = Phaser.Math.Between(50, 255);
        var blue = Phaser.Math.Between(50, 255);

        this.cameras.main.fade(2000, red, green, blue);
    }

    enterButtonHoverState(button) {
        //textMenu = '#ff0';
        button.setStyle({ fill: '#ff0'});
    }

    enterButtonRestState(button) {
        //textMenu = 'brown';
        button.setStyle({ fill: 'brown'});
    }
}