import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AnimatePresence } from "framer-motion";
import {
  collection,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import useModal from "../hooks/useModal";
import Modal from "./loadingImage/Modal";

const Message = ({ msg, currentUser, chat }) => {
  //auto scroll
  const scrollRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Modal state
  const { modalOpen, close, openImage } = useModal();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  //remove message
  const getMessage = (msg) => {
    const messageRecipient = chat.uid;
    const id =
      currentUser > messageRecipient
        ? `${currentUser + messageRecipient}`
        : `${messageRecipient + currentUser}`;
    const msgsRef = collection(db, "messages", id, "chat");

    //delete message When you click
    const queryFindMess = query(msgsRef, where("text", "==", msg));
    onSnapshot(queryFindMess, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().text) {
          deleteDoc(doc.ref);
        }
      });
    });
  };
  return (
    <>
      <div style={{ float: "right" }}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          style={{ color: "white" }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem>
            <span onClick={(e) => getMessage(msg.text)}>Delete Message</span>
          </MenuItem>
        </Menu>
      </div>
      <div
        className={`message_wrapper ${msg.from === currentUser ? "own" : ""}`}
        ref={scrollRef}
      >
        <p className={msg.from === currentUser ? "me" : "friend"}>
          {msg.media ? (
            <img
              src={msg.media}
              className="image-Message"
              alt={msg.text}
              onClick={() => (modalOpen ? close() : openImage())}
            />
          ) : null}
          {msg.text}
          <br />
          <AnimatePresence
            // Disable any initial animations on children that
            // are present when the component is first rendered
            initial={false}
            // Only render one component at a time.
            // The exiting component will finish its exit
            // animation before entering component is rendered
            exitBeforeEnter={true}
            // Fires when all exiting nodes have completed animating out
            onExitComplete={() => null}
          >
            {modalOpen && (
              <Modal
                modalOpen={modalOpen}
                handleClose={close}
                imgUrl={msg.media}
              />
            )}
          </AnimatePresence>

          <small>
            <Moment fromNow>{msg.createdAt.toDate()}</Moment>
          </small>
        </p>
      </div>
    </>
  );
};

export default Message;
