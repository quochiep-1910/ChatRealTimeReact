import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { auth, db } from "../firebase/config";
import LogoutIcon from "@mui/icons-material/Logout";
import messengerImage from "../assets/images/messenger.png";
const Navbar = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const handleSignout = async () => {
    //update status
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });

    await signOut(auth);
    history.replace("/login");
  };

  return (
    <nav className="nav-top">
      <h3>
        <Link className="navbar-hover" to="/">
          <img
            src={messengerImage}
            width="30px"
            className="messengerImageTop"
          />
          Messages
        </Link>
      </h3>

      {user && <span>Welcome: {auth.currentUser.email} </span>}

      <div>
        {user ? (
          <>
            <Link className="navbar-hover" to="/profile">
              Profile
            </Link>

            <LogoutIcon
              className="navbar-hover"
              style={{ cursor: "pointer", margin: "-7px" }}
              onClick={handleSignout}
            />
          </>
        ) : (
          <>
            <Link className="navbar-hover" to="/register">
              Register
            </Link>
            <Link className="navbar-hover" to="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
