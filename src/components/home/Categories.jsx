import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterByCategory,
} from "../../redux/slices/productSlices";
import { addToCart } from "../../redux/slices/cartSlices";
import { Button, Card, Col, Row, Image, ListGroup } from "react-bootstrap";

import { Link } from "react-router-dom";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../api/api";
import FavoriteButton from "../favorites/favorite";
import ImageCarousel from "../product/ImageCarousel";

const CategoryPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth);
  const products = useSelector((state) => state.items.filteredProducts);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  const categories = ["Hırdavat", "Elektrik", "Su Malzemeleri"]; // Örnek kategoriler

  const [selectedCategory, setSelectedCategory] = useState("Genel");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(filterByCategory("Genel")); // İlk açıldığında "Genel" kategorisini göster
    }
  }, [status, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(filterByCategory(category)); // Kategoriye göre filtreleme
  };

  const handleAddToCart = async (item) => {
    if (!item) {
      console.error("Ürün bilgileri bulunamadı");
      alert("Ürün bilgileri alınamadı.");
      return;
    }
    console.log("Item:", item);
    console.log("User:", user);

    if (!user) {
      console.error("Kullanıcı girişi bulunamadı");
      alert("Lütfen giriş yapınız");
      return;
    }

    let userId = user.uid; // Kullanıcının ID'sini Redux state'inden alın

    let imageUrl = item.image;

    if (!imageUrl) {
      try {
        const imageRef = ref(storage, `images/${item.id}`);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Resim alınırken hata meydana geldi ", error);
        alert("Ürün resmi alınırken bir hata oluştu.");
        return;
      }
    }

    try {
      await dispatch(
        addToCart({
          productId: item.id,
          quantity: 1,
          userId: userId,
          name: item.name,
          image: imageUrl,
          price: item.price,
        })
      );

      alert(`${item.name} sepete eklendi`);
    } catch (error) {
      console.error("Ürün sepete eklenirken bir hata oluştu: ", error);
      alert("Ürün sepete eklenirken bir hata oluştu.");
    }
  };

  if (status === "loading") {
    return (
      <Card
        data-bs-theme="dark"
        style={{
          backgroundColor: "#101415", // Koyu tema için arka plan rengi
          color: "#fff", // Text color
          height: "100%",

          borderRadius: "1rem",
          padding: "2rem",
          textDecoration: "none",
          width: "90%",
        }}>
        Yükleniyor...
      </Card>
    );
  }

  if (status === "failed") {
    return <div>Hata: {error}</div>;
  }

  return (
    <Card
      data-bs-theme="dark"
      style={{
        backgroundColor: "#101415", // Koyu tema için arka plan rengi
        color: "#fff", // Text color
        height: "100%",

        borderRadius: "1rem",
        padding: "2rem",
        textDecoration: "none",
        width: "90%",
      }}>
      <Row>
        <Col lg={3}>
          <ListGroup variant="flush" style={{ borderRadius: "1rem" }}>
            <ListGroup.Item
              onClick={() => handleCategoryChange("Genel")}
              style={{
                cursor: "pointer",
                fontWeight: selectedCategory === "Genel" ? "bold" : "normal",
              }}
              action
              variant="dark">
              Genel
            </ListGroup.Item>
            {categories.map((category) => (
              <ListGroup.Item
                key={category}
                onClick={() => handleCategoryChange(category)}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedCategory === category ? "bold" : "normal",
                }}
                action
                variant="dark">
                {category}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col lg={9}>
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Col
                  key={product.id}
                  className=" my-5 d-flex align-items-stretch">
                  <Card style={{ width: "18rem" }} border="light">
                    <Card.Body>
                      <Link
                        to={`/item/${product.id}`}
                        className="link-light link-underline-opacity-0">
                        <ImageCarousel product={product} />
                      </Link>
                      <Card.Title>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}>
                          <Link
                            to={`/item/${product.id}`}
                            className="link-light link-underline-opacity-0">
                            <h5>{product.name}</h5>
                          </Link>
                          <FavoriteButton itemId={product.id} />
                        </div>
                      </Card.Title>
                      <Card.Text>
                        Fiyat: {product.price} ₺
                        <br />
                        Kategori: {product.category}
                        <br />
                        <small>
                          {" "}
                          Eklenme Tarihi: {new Date(product.addedDate).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      </Card.Body>
                      <Card.Footer>
                      <Button onClick={() => handleAddToCart(product)}>
                        Sepete Ekle
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <div>Şu anlık burası boş görünüyor.</div>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CategoryPage;
