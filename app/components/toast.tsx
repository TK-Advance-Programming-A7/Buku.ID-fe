import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 p-4 border ${
        type === "error"
          ? "bg-red-100 border-red-500 text-red-700"
          : "bg-green-100 border-green-500 text-green-700"
      } rounded`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold">
          X
        </button>
      </div>
    </div>
  );
};

export default Toast;
