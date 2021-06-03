//STORE-UPDATE DATABASE USER
function writeUserData(userId, name, email, imageUrl, level, score, entreeSaloon, timeAdd, recompenseAdd, vitesseEnMoins, pepite, entreeChariot) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        level: level,
        score: score,
        profile_picture : imageUrl,
        entreeSaloon : entreeSaloon,
        timeAdd : timeAdd,
        recompenseAdd : recompenseAdd,
        vitesseEnMoins : vitesseEnMoins,
        pepite : pepite,
        entreeChariot : entreeChariot
    });
}

function reduceHealth ()
{
    currentHealth --;

    if (currentHealth <= 0)
    {
        currentHealth = 0;
        //  Stop the timer
        timedEvent.remove();
    }
}

function badClick ()
{
    if( currentHealth > 0 && nextLevel < 10 ) {
        currentHealth = currentHealth - 10;

        text.setFill('red');

        this.time.addEvent({
            delay: 200,
            callback: () => {
                text.setFill(cssColors.aqua);
            },
            loop: false
        });

        if (currentHealth <= 0) {
            currentHealth = 0;

            //  Stop the timer
            timedEvent.remove();
        }
    }
}

function actionOnClick () { //quand on clique sur la tête qu'on doit trouver
    var findSpark = this.particlesFind.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });
    findSpark.startFollow(this.teteWanted);
    this.teteWanted.visible = false;
    nextLevel++;

    dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
        userInBdd = snapshot.val();

        var ptVictoire = headScore + userInBdd.score;

        scoreDisplay.setText(ptVictoire);
        grossirText = scoreDisplay;


        //console.log(scoreDisplay.fontSize);

        if( nextLevel == 10 && levelNiveau == userInBdd.level )
            userInBdd.level++;

        writeUserData(
            userConnected.uid,
            userConnected.displayName,
            userConnected.email,
            userConnected.photoURL,
            userInBdd.level,
            ptVictoire,
            userInBdd.entreeSaloon,
            userInBdd.timeAdd,
            userInBdd.recompenseAdd,
            userInBdd.vitesseEnMoins,
            userInBdd.pepite,
            userInBdd.entreeChariot
        );

    });

    nextLevelText.setText(nextLevel).setShadow(2, 2, cssColors.navy, 8);

    this.time.addEvent({
        delay: 500,
        callback: ()=>{
            findSpark.on = false;
            this.teteWanted.visible = true;
            this.teteWanted.x= game.config.width-50;
            var value = Phaser.Math.Between(0, 600);
            this.teteWanted.y= value;
        },
        loop: false
    });

    //add 10 au temps
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10,( userInBdd.timeAdd + 50) );

    text.setFill('green');

    this.time.addEvent({
        delay: 200,
        callback: ()=>{
            text.setFill(cssColors.aqua);
        },
        loop: false
    });

}

function actionDollars  () { //quand on clique sur les dollars

    this.dollars.visible = false;
    this.emitterDollars.on = false;

    grossirText = scoreDisplay;

    dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
        userInBdd = snapshot.val();

        var ptVictoire = userInBdd.level;
        if( ptVictoire == 0 )
            ptVictoire = 1;

        ptVictoire = userInBdd.recompenseAdd + ptVictoire * 20 + userInBdd.score;

        scoreDisplay.setText(ptVictoire);
        this.time.addEvent({
            delay: 100,
            callback: ()=>{
                scoreDisplay.setSize('40px');
            },
            loop: false
        });

        writeUserData(
            userConnected.uid,
            userConnected.displayName,
            userConnected.email,
            userConnected.photoURL,
            userInBdd.level,
            ptVictoire,
            userInBdd.entreeSaloon,
            userInBdd.timeAdd,
            userInBdd.recompenseAdd,
            userInBdd.vitesseEnMoins,
            userInBdd.pepite,
            userInBdd.entreeChariot
        );

    });

    this.time.addEvent({
        delay: 15000,
        callback: ()=>{
            this.emitterDollars.on = true;
            this.dollars.visible = true;
            this.dollars.x= game.config.width-50;
            var value = Phaser.Math.Between(0, 600);
            this.dollars.y= value;
        },
        loop: false
    });

}

function actionPepite  () { //quand on clique sur les dollars
    this.catchPepite = 1;
    this.pepite.visible = false;
    this.emitterPepite.on = false;

    grossirText = pepiteDisplay;

    dbRef.child("users").child(userConnected.uid).get().then((snapshot) => {
        userInBdd = snapshot.val();



        pepiteDisplay.setText(userInBdd.pepite + 1);
        this.time.addEvent({
            delay: 100,
            callback: ()=>{
                pepiteDisplay.setSize('40px');
            },
            loop: false
        });

    });

}

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
}

var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}

class TweenHelper {
    static flashElement(scene, element, repeat = true, easing = 'Linear', overallDuration = 1500, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 0,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: visiblePauseDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 0,
                        ease: easing,
                        onComplete: () => {
                            if (repeat === true) {
                                this.flashElement(scene, element);
                            }
                        }
                    }
                ]
            });
        }
    }
}