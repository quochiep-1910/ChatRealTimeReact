import React, { useState } from "react";
import Attachment from "./svg/Attachment";
const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  const [image, setImage] = useState(null);
  const onImageChange = (event) => {
    if (event) {
      setImage(URL.createObjectURL(event));
    }
  };

  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <div style={{ position: "relative", bottom: "100px", left: "100px" }}>
        {image && (
          <img
            src={image}
            className="message_from-image"
            id="image"
            width="100px"
            height="100px"
            onClick={(e) => {
              setImg(null);
              setImage(null);
            }}
          />
        )}
      </div>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => {
          setImg(e.target.files[0]);
          onImageChange(e.target.files[0]);
        }}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button
          disabled={!text}
          className={"btn" + (text ? "" : " btn-send-disable")}
          onClick={(e) => setImage("")}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
