import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  addProduct,
  removeProduct,
} from "../../redux/slices/productSlices";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

function ProductActions() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    favorites: 0,
    category: "",
  });
  const categories = [
    "El Çantaları",
    "Omuz Çantaları",
    "Sırt Çantaları",
    "Cüzdanlar",
  ];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(form));
    setForm({ name: "", price: "", image: "", favorites: 0, category: "" });
  };

  const handleDelete = (id) => {
    dispatch(removeProduct(id));
  };

  return (
    <Container data-bs-theme="dark" style={{
      backgroundColor: "#101415", // Koyu tema için arka plan rengi
      borderRadius:"1rem",
      padding: "2rem",
      marginTop: "1rem"
    }}>
      <h2 style={{color: "#fff"}}>Ürün Ekle / Çıkar</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Col md={3}>
            <Form.Control
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL"
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Kategori Seç</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary">
              Ürün Ekle
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <Container className="mt-4">
        <Row>
          <Col>
            <div
              style={{
                width: "100%",
                height: "300px", // Sabit yükseklik
                overflowY: "scroll", // Yatay kaydırma için "overflowX" kullanılabilir
                border: "1px solid #ccc", // Kenarlık ekleyebilirsiniz
                padding: "15px", // İç boşluk
                borderRadius: "0.5rem", // Köşeleri yuvarla
              }}
            >
              <ListGroup>
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      {item.id} - {item.name} - {item.price} - {item.category}
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Sil
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default ProductActions;
