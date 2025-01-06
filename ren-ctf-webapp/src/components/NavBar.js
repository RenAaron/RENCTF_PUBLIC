import React from "react";
import GoogleSignin from "../img/Google.gif";
import { auth, db} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs  } from "firebase/firestore";
import io from 'socket.io-client';

const socket = io.connect("https://renctf-server-bbb0e859baa9.herokuapp.com/");
 

// const socket = io("wss://renctf-webapp-server.glitch.me/", {
//   headers: {
//     "user-agent": "Mozilla"
//   }
// });

const NavBar = () => {

  const [user] = useAuthState(auth);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);

    signInWithPopup(auth, provider).then((result) => {
      console.log("User signed in!");
      socket.emit("signed_in", auth.currentUser);
    });
  };

  const signOut = () => {
    auth.signOut();
  };

  function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }
  

  return (
    <nav className="nav-bar">
      <div style ={{justifyContent: "center", alignItems: 'center'}}>
        <img src="icons/home.gif" alt="Pixel Art" class="pixel-art" width={50} height={50}/>
        <img src="/icons/R.gif" alt="Pixel Art" class="pixel-art" width={50} height={50}/>
      </div>
      

      <div style ={{justifyContent: "center", alignItems: 'center', display: "flex"}}>
        {/* <img src="icons/parts.gif" alt="Pixel Art" class="pixel-art" width={70} height={70}/> */}
        <img src="icons/RenCTF.gif" alt="Pixel Art" class="pixel-art" height={80}/>
        {/* <img src="icons/parts.gif" alt="Pixel Art" class="pixel-art" width={70} height={70}/> */}
      </div>

      {user ? (
          
          <button className="sign-in">
            <img
              alt="Pixel Art" 
              class="pixel-art"
              onClick={signOut}
              src="/icons/Out.gif"
              type="button"
              style = {{marginRight: 20}}
              width={40} height={40}
            />
          </button>
        
      ) : (
        
      
        <button className="sign-in">
            <img
              alt="Pixel Art" 
              class="pixel-art"
              onClick={googleSignIn}
              src="/icons/Google.gif"
              type="button"
              style = {{marginRight: 20}}
              width={100} height={40}
            />
          </button>
      )}
    </nav>
  );
};

export default NavBar;