import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterByCategory,
} from "../../redux/slices/productSlices";
import { addToCart } from "../../redux/slices/cartSlices";
import { Button, Card, Col, Row, Image, ListGroup } from "react-bootstrap";
import { BsHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.items.filteredProducts);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);
  const categories = [
    "El Çantaları",
    "Omuz Çantaları",
    "Sırt Çantaları",
    "Cüzdanlar",
  ]; // Örnek kategoriler

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
  const handleFavoriteClick = () => {};
  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token");
    let userId;

    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.userId; // JWT'den userId'yi alın
    } else {
      // Eğer token yoksa, kullanıcı oturumu yoktur, hata işleyebilirsiniz
      console.error("User is not authenticated");
      alert("Lütfen giriş yapınız");
      return null;
    }

    dispatch(
      addToCart({
        productId: item.id,
        quantity: 1,
        userId: userId, 
        name: item.name,
        image: item.image,
        price: item.price,
      })
    );
    alert(`${item.name} sepete eklendi`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Card
      data-bs-theme="dark"
      style={{
        backgroundColor: "#101415", // Koyu tema için arka plan rengi
        color: "#fff", // Text color
        height: "100%",

        borderRadius: "1rem",
        padding: "2.5rem",
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
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Col
                  key={product.id}
                  className="mx-2 my-5 d-flex align-items-stretch">
                  <Card style={{ width: "13rem" }}>
                    <Link
                      to={`/item/${product.id}`}
                      className="link-light link-underline-opacity-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="card-img-top"
                        style={{
                          height: "13rem",
                          objectFit: "scale-down",
                          backgroundColor: "white",
                        }}
                      />
                    </Link>
                    <Card.Body>
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
                          <Button variant="link">
                            <BsHeart
                              onClick={handleFavoriteClick}
                              size={20}
                              className="text-light"
                            />
                          </Button>
                        </div>
                      </Card.Title>
                      <Card.Text>
                        Fiyat: {product.price} ₺
                        <br />
                        Kategori: {product.category}
                        <br />
                        <small>
                          {" "}
                          Tarih :{" "}
                          {new Date(product.addeddate).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      <Button onClick={() => handleAddToCart(product)}>
                        Sepete Ekle
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <div>No products available.</div>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CategoryPage;
