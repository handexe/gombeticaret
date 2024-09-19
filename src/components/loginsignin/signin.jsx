import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/slices/authSlices';
import { Form, Button,  Alert } from 'react-bootstrap';


const Register = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');  // Hata mesajını temizleyin
    
        dispatch(register({ name, surname, number, email, password }))
        .then(() => {
          setLoading(false);
          if (onSuccess) {
            onSuccess();  // Başarılı kayıt işleminden sonra modal'ı kapatmak için onSuccess çağrılıyor
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    };
    

    return (
        <div className="mt-5">
            <>
                <>
                    <h2 className="text-center">Kayıt Ol</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName" className="text-start">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formSurname" className="mt-3 text-start">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumber" className="mt-3 text-start">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="0(5XX)-XXX-XXXX"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3 text-start">
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
                        <Button variant="primary" type="submit" className="mt-4 w-100" disabled={loading}>
                            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
                        </Button>
                    </Form>
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </>
            </>
        </div>
    );
};

export default Register;
