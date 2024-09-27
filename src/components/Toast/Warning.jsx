// components/Toast/Warning.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

const Warning = ({ toast, setShowToast }) => {
  const [showToast, setLocalShowToast] = useState(toast);

  // Prop değiştiğinde local state'i günceller
  useEffect(() => {
    setLocalShowToast(toast);
  }, [toast]);

  return (
    <ToastContainer position="top-center">
      <Toast
        onClose={() => {
          setLocalShowToast(false);
          setShowToast(false); // Parent component state'ini de günceller
        }}
        show={showToast}
        bg="danger"
        delay={6000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Dikkat !</strong>
        </Toast.Header>
        <Toast.Body>
          Kullanıcı Bulunamadı. Lütfen Giriş Yapınız!
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Warning;
