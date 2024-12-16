const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// FIREBASE STUFFFFF 

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { doc, setDoc, onSnapshot, getDoc, updateDoc, collection} = require('firebase/firestore');
const { copyFileSync, access } = require("fs");

const diffs = {
    E: "easy",
    M: "medium",
    H: "hard"
  };

const ops = {
    "R": "B",
    "B": "R"
}

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_STUFF",
    authDomain: "YOUR_FIREBASE_STUFF",
    projectId: "YOUR_FIREBASE_STUFF",
    storageBucket: "YOUR_FIREBASE_STUFF",
    messagingSenderId: "YOUR_FIREBASE_STUFF",
    appId: "YOUR_FIREBASE_STUFF",
    measurementId: "YOUR_FIREBASE_STUFF"
};

const app2 = initializeApp(firebaseConfig);
const db = getFirestore(app2);
const docRef = doc(db, "games", "TIC-TAC-TOE");

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getRandomColor(){

    accent = (Math.floor(Math.random() * (255 - 0) + 0)).toString(16).toUpperCase();

    if(accent.length == 1){
        accent = "0".concat(accent)
    }

    bytes = [accent.substring(0,3), '00', 'FF']

    for (let i = bytes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bytes[i], bytes[j]] = [bytes[j], bytes[i]];
    }

    return bytes.join("")
}

function getRandomTeam() {
    if(Math.floor(Math.random() * 2) == 0){
        return "Red"
    } else{
        return "Blue"
    }
}

function fixUsername(username){
    const lastWhitespaceIndex = username.indexOf(' ');

    if (lastWhitespaceIndex === -1) {
        return username;
    }

    // Get the substring from the beginning to the last whitespace
    return username.substring(0, lastWhitespaceIndex);
}

async function checkUserExists(data){
    try{
        const userRef = doc(db, "users", data.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
            console.log("User is already registered!");
        } else{
            
            console.log(data.email, " is not registered!");
            console.log("Creating user!");

            getRandomColor();

            await setDoc(doc(db, "users", data.uid), {
                comp_chal: {
                    easy: [],
                    medium: [],
                    hard: []
                },
                display_name: fixUsername(data.displayName),
                color: getRandomColor(),
                total_moves: 0,
                moves: 0,
                team: getRandomTeam()
            });
        }
    } catch(error){
        console.error("Error getting document:", error);
        return null;
    }
}

async function addChal(data){
    try{
        const userRef = doc(db, "users", data.user.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
           
            if(!(userSnap.data().comp_chal[diffs[data.chal[0]]].includes(data.chal)) ){
                console.log("User does NOT have this challenge");
                const newChalls = userSnap.data().comp_chal[diffs[data.chal[0]]];
                const moves = userSnap.data().moves;

                newChalls.push(data.chal);

                if(data.chal[0] == "E"){
                    await updateDoc(userRef, {
                        "comp_chal.easy": newChalls,
                        moves: moves + 1
                    })

                } else if(data.chal[0] == "M"){
                    await updateDoc(userRef, {
                        "comp_chal.medium": newChalls,
                        moves: moves + 2
                    })

                } else if(data.chal[0] == "H"){
                    await updateDoc(userRef, {
                        "comp_chal.hard": newChalls,
                        moves: moves + 3
                    })
                }
                
            } else{
                console.log("User already has this challenge")
            }
        } else{
            console.log("Ermmm this user doesn't exist, i honestly dont know how but just incase");
        }
    } catch(error){
        console.error("Error getting document:", error);
        return null;
    }
}

async function getBoard() {
    
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().board;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}

async function getAffectedCells(board, data){
    const dir = [-1,0,1,0,-1]

    affectedCoords = []

    for(let i = 0; i < 4; i++){

        dirX = data.x+dir[i]
        dirY = data.y+dir[i+1]
        
        possAffected = []

        while (( dirX >= 0 && dirX <= 7) && (dirY >= 0 && dirY <= 7)){
            if(board[dirY][dirX] == ops[data.team]){
                possAffected.push([dirX, dirY])
            } else if(board[dirY][dirX] == data.team){
                for(x in possAffected){
                    if(possAffected[x] != []){
                        affectedCoords.push(possAffected[x]);
                    }
                }
                break
            } else{
                break
            }
            
            dirX += dir[i]
            dirY += dir[i+1]
        }
    }

    return affectedCoords;
}

async function updateCount(board){
    red = 0
    blue = 0 
    for(i in board){
        for(j in board[i]){
            if(board[i][j] == "R"){
                red += 1;
            } else if(board[i][j] == "B"){
                blue += 1
            }
        }
    }
    updateDoc(docRef, {
        BlueScore: blue,
        RedScore: red
    })

}

async function setPossible(board){
    
    for(let y = 0; y < board.length; y++){
        for(let x = 0; x < board[y].length; x++){

            if(board[y][x] == "R" || board[y][x] == "B"){

                const dir = [-1,0,1,0,-1]

                for(let i = 0; i < dir.length-1; i++){
                    
                    dirX = x + dir[i]
                    dirY = y + dir[i+1]

                    if(( dirX >= 0 && dirX <= 7) && (dirY >= 0 && dirY <= 7)){
                        
                        if(board[dirY][dirX] == "W"){
                            board[dirY] = board[dirY].replaceAt(dirX,"P")
                        }
                    }
                }
            }
        }
    }

    return board;
}
async function setBoard(board, data){

    const newBoard = board
    
    const userRef = doc(db, "users", data.user.uid);
    const userSnap = await getDoc(userRef);
    
    


    if((board[data.y][data.x] == "P")){

        if(userSnap.exists()){
            const moves = userSnap.data().moves;
    
            await updateDoc(userRef, {
                moves: moves - 1
            })
        } 
        
        getAffectedCells(board, data).then(flippedCells => {
            newBoard[data.y] = newBoard[data.y].replaceAt(data.x, data.team);
            for(x in flippedCells){
                newBoard[flippedCells[x][1]] = newBoard[flippedCells[x][1]].replaceAt(flippedCells[x][0], data.team);
            }

            setPossible(board).then(updatedMoves => {
                updateDoc(docRef, {
                    board: updatedMoves
                });
                updateCount(newBoard);
            })
        });

    } else{
        console.log("Cant place here :P")
    }
}

app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "YOUR_SERVER_STUFF"],
        methods: ["GET", "POST"],
    },
});


app.get('/', function (req, res) {
    res.render('index', {});
});

io.on("connection", (socket) => {
    
    socket.on("place_cell", (data) => {
        console.log(data)
        getBoard().then(board => {
            if(board !== null && (data.moves > 0)){
                setBoard(board, data);
            }

        });
    })

    socket.on("signed_in", (data) => {
        console.log("User signed in - UID:", data.uid, "Email:", data.email, "Display Name:", data.displayName);
        checkUserExists(data);
    })

    socket.on("guess_correct", (data) => {
        addChal(data);
    })
})


server.listen(process.env.PORT || 3001, () => {
    console.log("Server running yahaaaao");
})