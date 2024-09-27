import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Modal,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { BsHeart, BsBasket, BsPersonCircle } from "react-icons/bs";
import LoginSignin from "../../pages/LogInSignIn";
import { logout } from "../../redux/slices/authSlices";
import { useDispatch } from "react-redux";
import SearchForm from "./SearchForm";

const MainNavbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.uid);
  const categories = ["Hırdavat", "Elektrik", "Su Malzemeleri"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleCategory = (category) => {
    setSelectedCategory(category);
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
          <Navbar.Brand href="/">Gömbe Ticaret</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/yeni-gelenler">Yeni Gelenler</Nav.Link>
              <Nav.Link href="/indirim">İndirim</Nav.Link>
              <NavDropdown title="Çeşitlerimiz" id="collapsible-nav-dropdown">
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category}
                    href={`/kategori/${selectedCategory}`}
                    onClick={() => handleCategory(category)}>
                    {category}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link href="/admin">Admin </Nav.Link>
            </Nav>
            <SearchForm />
          </Navbar.Collapse>
          <Button className="text-light mx-1" variant="link" href="/favoriler">
            <BsHeart size={20} />
          </Button>

          <Button variant="link" href="/sepet">
            <BsBasket size={20} className="text-light" />
          </Button>

          {!user ? (
            <Button variant="secondary" className="ms-3" onClick={handleShow}>
              Giriş Yap
            </Button>
          ) : (
            <>
              <Button variant="secondary" className="ms-3 me-2">
                <BsPersonCircle size={20} />
              </Button>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
            </>
          )}
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Giriş Yap/Kayıt Ol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginSignin onSuccess={handleClose} />{" "}
          {/* Başarılı işlem sonrası modal kapanır */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MainNavbar;
