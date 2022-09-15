import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { dbService } from "fbase";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbService, "nweets"), {
        text: nweet,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.log(error);
    }
    setNweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  console.log(nweets);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
