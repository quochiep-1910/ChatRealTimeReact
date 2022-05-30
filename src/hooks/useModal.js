import { useState } from "react";

// Centralizes modal control
const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const openImage = () => setModalOpen(true);

  return { modalOpen, close, openImage };
};

export default useModal;
