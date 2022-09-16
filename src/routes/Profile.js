import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { authService, dbService } from "fbase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Nweet from "components/Nweet";

const Profile = ({ userObj }) => {
  const [myDocs, setMyDocs] = useState([]);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const myNweets = querySnapshot.docs.map((doc) => ({
      // console.log(doc.id, " => ", doc.data());
      ...doc.data(),
    }));
    setMyDocs(myNweets);
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      {myDocs &&
        myDocs.map((doc) => (
          <Nweet
            key={doc.id}
            nweetObj={doc}
            isOwner={doc.creatorId === userObj.uid}
          />
        ))}
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
