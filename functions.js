//STORE-UPDATE DATABASE USER
function writeUserData(userId, name, email, imageUrl, level, score) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        level: level,
        score: score,
        profile_picture : imageUrl
    });
}

function reduceHealth ()
{
    currentHealth--;

    if (currentHealth <= 0)
    {
        currentHealth = 0;
        //  Stop the timer
        timedEvent.remove();
    }
}

function badClick ()
{
    currentHealth = currentHealth-10;

    text.setFill('red');

    this.time.addEvent({
        delay: 200,
        callback: ()=>{
            text.setFill(cssColors.aqua);
        },
        loop: false
    });

    if (currentHealth <= 0)
    {
        currentHealth = 0;

        //  Stop the timer
        timedEvent.remove();
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

        var ptVictoire = levelNiveau;
        if( ptVictoire == 0 )
            ptVictoire = 1;

        ptVictoire = ptVictoire * 1 + userInBdd.score;

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
            ptVictoire
        );

    });
    nextLevelText.setText(nextLevel).setShadow(2, 2, cssColors.navy, 8);

    //this.plugins.get('rexfadeplugin').fadeOutDestroy(findSpark, 500);


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
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);

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

        ptVictoire = ptVictoire * 20 + userInBdd.score;

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
            ptVictoire
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

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
}