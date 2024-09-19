import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  addProduct,
  removeProduct,
} from "../../redux/slices/productSlices";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../api/api"; // assuming api.js exports your Firebase storage instance

function ProductActions() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: [],
    favorites: 0,
    category: "",
    oldprice: 0,
    addedDate: today,
  });
  // Dosya input alanı için ref oluştur
  const fileInputRef = useRef(null);

  const categories = ["Hırdavat", "Elektrik", "Su Malzemeleri"];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const handleImageUpload = async (e) => {
    try {
      const files = e.target.files;
      if (files.length === 0) {
        console.error("No files selected");
        return;
      }

      let uploadedImages = [];
      alert("Lütfen resim yüklenirken bir sonraki uyarıya kadar bekleyin");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgRef = ref(storage, `images/${uuidv4()}`);
        const uploadResult = await uploadBytes(imgRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        uploadedImages.push(downloadURL); // add each image URL to the array
      }

      setForm(() => ({
        ...form,
        image: uploadedImages, // set the images array
      }));

      alert("Resimler yüklendi, şimdi formu gönderebilirsiniz");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      console.error("Image URL is missing. Please upload an image.");
      return;
    }
    // const currentDate = new Date().toISOString().split('T')[0];
    // setForm({
    //   ...form,
    //   addedDate: currentDate
    // })
    console.log("Submitting form:", form);

    await dispatch(addProduct(form));

    setForm({
      name: "",
      price: "",
      image: [],
      favorites: 0,
      category: "",
      oldprice: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Input alanını sıfırlar
    }
  };

  const handleDelete = (id) => {
    dispatch(removeProduct(id));
  };

  return (
    <Container
      data-bs-theme="dark"
      style={{
        backgroundColor: "#101415",
        borderRadius: "1rem",
        padding: "2rem",
        marginTop: "1rem",
      }}>
      <h2 style={{ color: "#fff" }}>Ürün Ekle / Çıkar</h2>
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
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleImageUpload}
              placeholder="Image URL"
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
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
                height: "300px",
                overflowY: "scroll",
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "0.5rem",
              }}>
              <ListGroup>
                {items.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      {item.id} - {item.name} - {item.price} - {item.category} - {item.addedDate} - {item.oldprice}
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}>
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
