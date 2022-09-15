import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const nweetsCollectionRef = collection(dbService, "nweets");

  const getNweets = async () => {
    const q = query(nweetsCollectionRef);
    const data = await getDocs(q);

    const newData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setNweets(newData);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbService, "nweets"), {
        nweet,
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
    getNweets();
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
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
