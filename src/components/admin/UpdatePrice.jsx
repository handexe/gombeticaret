import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProductPrice,
  fetchProducts,
} from "../../redux/slices/productSlices";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const UpdatePrice = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);

  const [form, setForm] = useState({
    id: "",
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
  const [originalItem, setOriginalItem] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectItem = (event) => {
    const itemId = Number(event.target.value);

    const selectedItem = items.find((item) => item.id === itemId);

    if (selectedItem) {
      setForm({ ...selectedItem });
      setOriginalItem(selectedItem);
    } else {
      console.error("Selected item not found.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedProduct = {
      id: form.id,
      name: form.name || originalItem?.name,
      price: form.price || originalItem?.price,
      image: form.image || originalItem?.image,
      favorites: originalItem?.favorites,
      category: form.category || originalItem?.category,
    };

    dispatch(updateProductPrice(updatedProduct)).then(() => {
      // Güncelleme işlemi tamamlandığında ürünleri yeniden yükleyin
      dispatch(fetchProducts());
    });
  };

  return (
    <Container 
      data-bs-theme="dark"
      style={{
        backgroundColor: "#101415", // Koyu tema için arka plan rengi
        borderRadius:"1rem",
        padding: "2rem",
        marginTop: "1rem"
      }}>
      <h2 className="my-4" style={{color: "#fff"}} >Ürün Güncelleme</h2>
      <Form onSubmit={handleSubmit} 
      style={{color : "#fff"}}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="selectItem">
              <Form.Label>Ürün Seç</Form.Label>
              <Form.Control as="select" onChange={handleSelectItem}>
                <option value="">Ürün Seç</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ürün İsmi"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPrice">
              <Form.Label>Fiyat</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Fiyat"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="formImage">
              <Form.Label>Görsel URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Görsel URL"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCategory">
              <Form.Label>Kategori</Form.Label>
              <Form.Control
                as="select"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }>
                <option value="">Kategori Seç</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-4">
          Ürünü Güncelle
        </Button>
      </Form>
      <Container className="mt-5">
        <Row>
          <Col>
            <h3 style={{color: "#fff"}} >Ürün Listesi</h3>
            <div
              style={{
                width: "100%",
                height: "300px", // Sabit yükseklik
                overflowY: "scroll", // Yatay kaydırma için "overflowX" kullanılabilir
                border: "1px solid #ccc", // Kenarlık ekleyebilirsiniz
                padding: "15px", // İç boşluk
                borderRadius: "0.5rem", // Köşeleri yuvarla
                color: '#fff' // Arka plan rengi
              }}
            >
              <ul>
                {items.map((item) => (
                  <li key={item.id} style={{ marginBottom: "10px" }}>
                    {item.id} - {item.name} - {item.price} - {item.category}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default UpdatePrice;
