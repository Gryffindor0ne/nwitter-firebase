import React, { useEffect, useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { authService, dbService } from "fbase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Nweet from "components/Nweet";

const Profile = ({ userObj, refreshUser }) => {
  const [myDocs, setMyDocs] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
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

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <section>
        <div>{newDisplayName}'s Nweets</div>
        {myDocs &&
          myDocs.map((doc, idx) => (
            <Nweet
              key={idx}
              nweetObj={doc}
              isOwner={doc.creatorId === userObj.uid}
            />
          ))}
      </section>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
