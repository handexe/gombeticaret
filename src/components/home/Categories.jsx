import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterByCategory,
} from "../../redux/slices/productSlices";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteButton from "../favorites/favorite";
import ImageCarousel from "../product/ImageCarousel";
import CategoryComponent from "./CategoryComponents";
import HandleAddToCart from "../../helpers/HandleAddToCart";
import Warning from "../Toast/Warning"; // Warning bileşeni import edilmiştir

const CategoryPage = () => {
  const dispatch = useDispatch();

  const [showToast, setShowToast] = useState(false); // Toast state

  const user = useSelector((state) => state.auth.uid);
  const products = useSelector((state) => state.items.filteredProducts);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

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
    return <Card
    data-bs-theme="dark"
    style={{
      backgroundColor: "#101415", // Koyu tema için arka plan rengi
      color: "#fff", // Text color
      height: "100%",
      borderRadius: "1rem",
      padding: "2rem",
      textDecoration: "none",
      width: "90%",
    }}>Hata: {error}</Card>;
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
        <CategoryComponent />
        <Col lg={9}>
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Col
                  key={product.id}
                  className=" my-5 d-flex align-items-stretch">
                  <Card style={{ width: "18rem" }} border="light">
                    <Card.Body>
                      <ImageCarousel product={product} />
                      <Card.Title>
                        {" "}
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
                          Eklenme Tarihi:{" "}
                          {new Date(product.addedDate).toLocaleDateString()}
                        </small>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        onClick={() =>
                          HandleAddToCart(
                            product,
                            dispatch,
                            user,
                            showToast,
                            setShowToast
                          )
                        }>
                        Sepete Ekle
                      </Button>
                      
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <div>Şu anlık burası boş görünüyor.</div>
            )}{/* Warning Toast mesajı */}
                      <Warning toast={showToast} setShowToast={setShowToast} />
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CategoryPage;
