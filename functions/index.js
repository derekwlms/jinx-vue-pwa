const functions = require('firebase-functions');
const admin = require('firebase-admin');

const TWO_DAYS_MILLISECS = 2 * 24 * 60 * 60 * 1000;

admin.initializeApp();

// TODO Make cleanups a batch / cron job instead of onCreate hooks?

exports.onGameCreate = functions.firestore
    .document('jinxGames/{userId}')
    .onCreate((snap, context) => { 
        console.log('New jinxGame added, deleting outdated games...');
        oldTimestamp = Date.now() - TWO_DAYS_MILLISECS;
        const ref = admin.firestore().collection('jinxGames')
                        .where('timestamp', '<', oldTimestamp);
        ref.onSnapshot(snapshot => {  
            console.log('Deleting ' + snapshot.size + ' old jinxGame(s)');
            snapshot.forEach((doc) => {
                const gameId = doc.data().gameId;
                doc.ref.delete().then(() => {
                    console.log('Game successfully deleted', gameId);
                    return 0;
                }).catch((error) => {
                    console.log('Error removing game', gameId, error);
                    return 0;
                });
                return 0;
            });
        });        
    });

exports.onGuessesCreate = functions.firestore
    .document('jinxGuesses/{userId}')
    .onCreate((snap, context) => { 
        console.log('New jinxGuesses added, deleting outdated guesses...');
        oldTimestamp = Date.now() - TWO_DAYS_MILLISECS;
        const ref = admin.firestore().collection('jinxGuesses')
                        .where('timestamp', '<', oldTimestamp);
        ref.onSnapshot(snapshot => {  
            console.log('Deleting ' + snapshot.size + ' old jinxGuesses');
            snapshot.forEach((doc) => {
                const gameId = doc.data().gameId;
                doc.ref.delete().then(() => {
                    console.log('Guesses successfully deleted', gameId);
                    return 0;
                }).catch((error) => {
                    console.log('Error removing guesses', gameId, error);
                    return 0;
                });
                return 0;
            });
        });        
    });    
