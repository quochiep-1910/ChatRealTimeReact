import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase/config";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Message from "../components/Message";
import { Thanos } from "react-thanos";
import { height } from "@mui/system";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [snap, setSnap] = useState(null);

  const currentUser = auth.currentUser.uid;
  useEffect(() => {
    const usersRef = collection(db, "users");
    //create query object

    const q = query(usersRef, where("uid", "not-in", [currentUser]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const selectUser = async (user) => {
    setChat(user);
    //get messages when you click user
    const messageRecipient = user.uid;
    const id =
      currentUser > messageRecipient
        ? `${currentUser + messageRecipient}`
        : `${messageRecipient + currentUser}`;
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });

      setMsgs(msgs);
    });

    // check stuff unread is true =>  update read message when you click message
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    if (docSnap.data() && docSnap.data().from !== currentUser) {
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const messageRecipient = chat.uid;
    const id =
      currentUser > messageRecipient
        ? `${currentUser + messageRecipient}`
        : `${messageRecipient + currentUser}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: currentUser,
      to: messageRecipient,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });
    // const cityRef = collection(db, "messages", id, "chat");

    //create last message
    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: currentUser,
      to: messageRecipient,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
    setText("");
    setImg("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            currentUser={currentUser}
            chat={chat}
          />
        ))}
      </div>

      <div className="messages_container">
        {chat ? (
          <>
            <div style={{ height: "1px" }}>
              <Thanos
                onSnap={() => setSnap(true)}
                onSnapReverse={() => setSnap(false)}
              />
            </div>
            <div className="messages_user">
              <h3>{chat.name}</h3>
            </div>
            <div className={`${snap ? "hiddenThanos messages" : " messages"}`}>
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message
                      key={i}
                      msg={msg}
                      currentUser={currentUser}
                      chat={chat}
                    />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start converstion</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
