import React, { useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbService, "nteets"), {
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

  return (
    <div>
      <form>
        <input
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
        />
        <input onClick={onSubmit} type="submit" value="Nweet" />
      </form>
    </div>
  );
};

export default Home;
