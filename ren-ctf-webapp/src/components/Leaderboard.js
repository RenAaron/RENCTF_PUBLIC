import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  doc, 
  getDocs,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import User from "./User";



const Leaderboard = () => {


    const [users, setUsers] = useState([]);

    useEffect(() => {
        
        const q = query(
        collection(db, "users"),
        // orderBy("createdAt", "desc"),
        limit(15)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {

        const fetchedUsers = [];

        QuerySnapshot.forEach((doc) => {
            fetchedUsers.push({ ...doc.data(), id: doc.id });
        });

        const sortedUsers = fetchedUsers.sort(
            (a, b) => (b.comp_chal["easy"].length + b.comp_chal["medium"].length*2 + b.comp_chal["hard"].length*3) - (a.comp_chal["easy"].length + a.comp_chal["medium"].length*2 + a.comp_chal["hard"].length*3)
        );

        setUsers(fetchedUsers);

        });

        return () => unsubscribe;

    }, []);

  return (
    <main style={{ width: '100%', height: '100%', display: "flex", flexDirection: 'column'}}>

{/* overflowX: 'auto', overflowY: 'auto', whiteSpace: 'nowrap' */}
      <div className="messages-wrapper"  style={{}}> 
        {users?.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
        
        
    </main>
  );
};

export default Leaderboard;