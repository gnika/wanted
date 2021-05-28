

class MainScene extends Phaser.Scene    {

    constructor(){
        super({key: 'MainScene' });
    }
    preload () {
        this.load.image('decors', 'assets/images/decors/street.png');
        this.load.plugin('rexfirebaseplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfirebaseplugin.min.js', true);


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

        //var userList    = this.plugins.get('rexfirebaseplugin').add.onlineUserList(firebaseConfig);

        //var leaderBoard = this.plugins.get('rexfirebaseplugin').add.leaderBoard(firebaseConfig);

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
                if( userConnected != null) {
                    this.clickButton = this.add.text(screenCenterX - 70, screenCenterY, 'JOUER', {fill: 'brown', font: 'bold 52px system-ui'})
                        .setInteractive()
                        .on('pointerdown', () => this.passMap())
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton));

                    this.clickButton2 = this.add.text(screenCenterX - 170, screenCenterY + 70, 'SE DECONNECTER', {fill: 'brown', font: 'bold 52px system-ui'})
                        .setInteractive()
                        .on('pointerdown', () => this.deconnect(this.scene))
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton2))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton2));
                }else{
                    this.clickButton3 = this.add.text(screenCenterX /2, screenCenterY, 'SE CONNECTER', {fill: 'brown', font: 'bold 52px system-ui'})
                        .setInteractive()
                        .on('pointerdown', () => this.connect(this.scene))
                        .on('pointerover', () => this.enterButtonHoverState(this.clickButton3))
                        .on('pointerout', () => this.enterButtonRestState(this.clickButton3));

                }

                //userlist je ne sais pas le faire marcher, le tableau renvoyé est vide

            },
            //args: [],
            callbackScope: this,
            loop: false
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
                    0//score
                );
                userInBdd        = userConnected;
                userInBdd.level  = 0;
                userInBdd.score  = 0;
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