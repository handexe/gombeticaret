import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Button,
  Modal,
} from "react-bootstrap";

import { BsSearch, BsHeart, BsBasket } from "react-icons/bs";
import LoginSignin from "../../pages/LogInSignIn";

const MainNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  const [query, setQuery] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        data-bs-theme="dark"
        style={{
          backgroundColor: "#101415",
          color: "#fff",
        }}>
        <Container>
          <Navbar.Brand href="/">Hande Shopping</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/yeni-gelenler">Yeni Gelenler</Nav.Link>
              <Nav.Link href="/indirim">İndirim</Nav.Link>
              <NavDropdown title="Çeşitlerimiz" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="/el-cantalari">
                  El Çantaları
                </NavDropdown.Item>
                <NavDropdown.Item href="/omuz-cantalri">
                  Omuz Çantaları
                </NavDropdown.Item>
                <NavDropdown.Item href="/sirt-cantalari">
                  Sırt Çantaları
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/cuzdanlar">Cüzdanlar</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/admin">Admin</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Arama..."
                className="me-2"
                aria-label="Arama..."
                value={query}
                onChange={handleInputChange} // Arama inputu ile arama işlemi başlatılır
              />
              <Button
                className="text-light"
                variant="outline-secondary"
                href={`/sonuclar?query=${query}`}>
                <BsSearch size={20} />
              </Button>
            </Form>

           
          </Navbar.Collapse> 
          <BsHeart size={20} className="text-light mx-3" />
            <div className="position-relative">
              <Button variant="link" href="/sepet"><BsBasket size={20} className="text-light"/></Button>
              
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </div>
          <Button
            variant="secondary"
            className="ms-3"
            href="#giris-kayit"
            onClick={handleShow}>
            Giriş Yap
          </Button>
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Giriş/Kayıt Ol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginSignin />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MainNavbar;
