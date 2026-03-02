"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const backdropClass =
  "fixed top-0 left-0 z-[9999] w-screen h-screen bg-black/60 flex justify-center items-center";

const modalClass =
  "relative max-w-[90vw] max-h-[90vh] rounded-lg bg-gray-300 p-6 text-black";

const closeButtonClass =
  "absolute top-2 right-2 w-8 h-8 rounded bg-transparent border-none text-[20px] leading-none text-[#333] cursor-pointer flex items-center justify-center p-0";

export const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal
      className={backdropClass}
    >
      <div className={modalClass}>
        <button
          className={closeButtonClass}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
