import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import Img from "../assets/images/avataDefault.jpg";
import Camera from "../components/svg/Camera";
import { auth, db, storage } from "../firebase/config";
import Trash from "../components/svg/Trash";
import { useHistory } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/loadingImage/Modal";
import useModal from "../hooks/useModal";
const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const history = useHistory("");
  // Modal state
  const { modalOpen, close, openImage } = useModal();

  const [toast, setToast] = useState(false);
  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            //delete last img
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setToast(true);
          const toast = setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const handleDeleteImage = async () => {
    try {
      const confirm = window.confirm("Do you want to delete avatar now?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });

        history.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };
  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img
            src={user.avatar || Img}
            alt="avatar"
            onClick={() => (modalOpen ? close() : openImage())}
          />

          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Trash deleteImage={handleDeleteImage} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
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
              imgUrl={user.avatar}
            />
          )}
        </AnimatePresence>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createAt.toDate().toDateString()} </small>
        </div>
      </div>
      {toast && (
        <Snackbar open={toast} autoHideDuration={3000} onClose={handleClose}>
          <Alert severity="success">Change image in profile success!</Alert>
        </Snackbar>
      )}
    </section>
  ) : null;
};

export default Profile;
