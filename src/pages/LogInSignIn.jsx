import React, { useState } from "react";
import Register from "../components/loginsignin/signin";
import Login from "../components/loginsignin/login";
import { Button, Container } from "react-bootstrap";
import './Modal.css'

const LogInSignIn = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <>
        <Container  className="text-center">
          {isLogin ? (
            <>
              
              <Login />
              <Button
                variant="link"
                onClick={toggleForm}
                className="mt-3"
                style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
              >
                Eğer hesabınız yoksa, kayıt ol
              </Button>
            </>
          ) : (
            <>
              
              <Register />
              <Button
                variant="link"
                onClick={toggleForm}
                className="mt-3"
                style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
              >
                Zaten bir hesabınız var mı? Giriş yap
              </Button>
            </>
          )}
        </Container>
      </>
    </>
  );
};

export default LogInSignIn;
