import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const Profile = () => {

  return (
    <main style={{ width: '100%', height: '100%', display: "flex",  alignItems: "center", flexDirection: 'column'}}>

      <div style={{height: '10%', justifyContent: "center", width: '100%', alignItems: "center", display: "flex", marginTop: '10px'}}>
        <h1 style ={{fontSize: 50}}>Profile</h1>
      </div>

      <img src={auth.currentUser.photoURL} width={200} height={200} class="circle-image"/>

      <h1 style={{textAlign: 'center', padding: '10px'}}>{auth.currentUser.displayName}</h1>

      <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
        <h2 style={{marginRight: "4px"}}>Season Awards:</h2>

        <img src="/icons/Emerald.gif" alt="Pixel Art" class="pixel-art" width={30} height={30}/>
        <img src="/icons/Diamond.gif" alt="Pixel Art" class="pixel-art" width={30} height={30}/>
        <img src="/icons/Fire.gif" alt="Pixel Art" class="pixel-art" width={30} height={30}/>
        <img src="/icons/Skull.gif" alt="Pixel Art" class="pixel-art" width={30} height={30}/>

      </div>

      <h2 style={{fontSize: 17, textAlign: 'center', width: "90%", color: '#dfabff', paddingTop: '10px'}}>These icons reflect your acomplishments this season! This feature is yet to be implemented!</h2>
      
      <h2 style={{marginRight: "4px", paddingTop: '10px', marginBottom: '10px'}}>Season Stats:</h2> 

      <div class = "stats">
        <img src="/easy.gif" alt="Pixel Art" class="pixel-art" width={20} height={20}/>
        <t style={{fontSize: 25, marginRight: 10, marginLeft: 10}}>EAS:</t>
        <t style={{color: '#19ffaf', fontSize: 20}}>❚❚❚❚❚❚❚</t>
        <t style={{ color: 'white', fontSize: 20, marginRight: 10}}>❚❚❚❚❚❚❚</t>
        <t style={{fontSize: 25}}>7/14 </t>
      </div>

      <div class = "stats">
        <img src="/med.gif" alt="Pixel Art" class="pixel-art" width={20} height={20}/>
        <t style={{fontSize: 25, marginRight: 10, marginLeft: 10}}>MED:</t>
        <t style={{color: '#f2ff00', fontSize: 20}}>❚❚❚❚❚❚❚</t>
        <t style={{ color: 'white', fontSize: 20, marginRight: 10}}>❚❚❚❚❚❚❚</t>
        <t style={{fontSize: 25}}>7/14 </t>
      </div>     

      <div class = "stats">
        <img src="/hard.gif" alt="Pixel Art" class="pixel-art" width={20} height={20}/>
        <t style={{fontSize: 25, marginRight: 10, marginLeft: 10}}>HRD:</t>
        <t style={{color: '#ff197d', fontSize: 20, }}>❚❚❚❚❚❚❚</t>
        <t style={{ color: 'white', fontSize: 20, marginRight: 10}}>❚❚❚❚❚❚❚</t>
        <t style={{fontSize: 25}}>7/14 </t>
      </div>
        
    </main>
  );
};

export default Profile;