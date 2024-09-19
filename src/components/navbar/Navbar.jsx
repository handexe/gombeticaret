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
import { useSelector } from "react-redux";
import { BsSearch, BsHeart, BsBasket, BsPersonCircle } from "react-icons/bs";
import LoginSignin from "../../pages/LogInSignIn";
import { logout } from "../../redux/slices/authSlices";
import { useDispatch } from "react-redux";


const MainNavbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.uid);
  const categories = ["Hırdavat", "Elektrik", "Su Malzemeleri"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };
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
                  <NavDropdown.Item key={category} href={`/kategori/${category}`} onClick={() => handleCategory(category)}>
                    
                      {category}
                    
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link href="/admin">Admin </Nav.Link>
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
          <Button className="text-light mx-1" variant="link" href="/favoriler">
            <BsHeart size={20} />
          </Button>
          <div className="position-relative">
            <Button variant="link" href="/sepet">
              <BsBasket size={20} className="text-light" />
            </Button>

            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </div>
          {!user ? (
            <Button variant="secondary" className="ms-3" onClick={handleShow}>
              Giriş Yap
            </Button>
          ) : (
            <>
              {" "}
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
