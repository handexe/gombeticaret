import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlices";
import { Form, Button, Alert } from "react-bootstrap";


function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login({ email, password }))
    .then(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess();  // Başarılı girişten sonra modal'ı kapatmak için onSuccess çağrılıyor
      }
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  };

  return (
    <div className="mt-5">
      <h2 className="text-center">Giriş Yap</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="text-start">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3 text-start">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="mt-4 w-100"
          disabled={loading}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş"}
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
}

export default Login;
