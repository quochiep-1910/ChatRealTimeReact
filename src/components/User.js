import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import img from "../assets/images/avataDefault.jpg";
import { db } from "../firebase/config";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import { Avatar } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";

const User = ({ user, selectUser, currentUser, chat }) => {
  const messageRecipient = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id =
      currentUser > messageRecipient
        ? `${currentUser + messageRecipient}`
        : `${messageRecipient + currentUser}`;

    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: `${user.isOnline ? "green" : "red"}`,
      color: `${user.isOnline ? "green" : "red"}`,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  return (
    //nav
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
        style={{ borderColor: `${user.isOnline ? "green" : "red"}` }}
      >
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <img src={user.avatar || img} alt="avatar" className="avatar" />
          </StyledBadge>

          <h4 style={{ margin: "10px" }}> {user.name}</h4>
          {data?.from !== currentUser && data?.unread && (
            <MessageIcon className="unread">New</MessageIcon>
          )}
        </Stack>

        {/* <div className="user_info">
        <div className="user_detail">
          <img src={user.avatar || img} alt="avatar" className="avatar" />
          <h4> {user.name}</h4>
          {data?.from !== currentUser && data?.unread && (
            <small className="unread">New</small>
          )}
        </div>
        <div
          className={`user_status ${user.isOnline ? "online" : "offline"}`}
        ></div>
      </div> */}
        {data && (
          <p className="truncate">
            <strong>{data.from === currentUser ? "Me: " : "You: "}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
};

export default User;
