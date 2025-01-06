import React, { useEffect, useRef, useState } from "react";
import Profile from "./Profile";
import Challenges from "./Challenges";
import ChatBox from "./ChatBox";
import Tutorial from "./Tutorial";

const Layout = () => {
  


  return (
    <main>
        <div class="container">
            {/* <div class="section section-left"><ChatBox/></div>
            <div class="section section-middle"><Challenges/></div>
            <div class="section section-right"><Profile/></div> */}

            <div class="section section-left"><Tutorial/></div>
            <div class="section section-middle"><Challenges/></div>
            <div class="section section-right"><Profile/></div>
        </div>
    </main>
  );
};

export default Layout;