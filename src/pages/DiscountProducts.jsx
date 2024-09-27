import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,  filterDiscounted } from "../redux/slices/productSlices";
import { Button, Card, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageCarousel from "../components/product/ImageCarousel";
import HandleAddToCart from "../helpers/HandleAddToCart";
import Warning from "../components/Toast/Warning";

const DiscountedPage = () => {
  const dispatch = useDispatch();

  const discountedItems = useSelector((state) => state.items.discountedItems);
  const status = useSelector((state) => state.items.status);

  const user = useSelector((state) => state.auth.uid);

  const [showToast, setShowToast] = useState(false); // Toast state

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      await dispatch(fetchProducts());
      await dispatch(filterDiscounted());
    };
    fetchAndFilterProducts();
  }, [dispatch]);

  if (status === "loading")
    return (
      <Container className="p-4">
        <Card.Title as="h2">İndirimdekiler</Card.Title>
        <Card
          data-bs-theme="dark"
          style={{
            backgroundColor: "#101415", // Koyu tema için arka plan rengi
            color: "#fff",
            height: "100%",
            borderRadius: "1rem",
            padding: "3rem",
            marginTop: "1rem",
          }}>
          Yükleniyor...
        </Card>
      </Container>
    );
  if (status === "failed")
    return (
      <Container className="p-4">
        <Card.Title as="h2">İndirimdekiler</Card.Title>
        <Card
          data-bs-theme="dark"
          style={{
            backgroundColor: "#101415", // Koyu tema için arka plan rengi
            color: "#fff",
            height: "100%",
            borderRadius: "1rem",
            padding: "3rem",
            marginTop: "1rem",
          }}>
          Error loading products
        </Card>
      </Container>
    );
  return (
    <Container className="p-4">
      <Card.Title as="h2">İndirimdekiler</Card.Title>
      <Card
        data-bs-theme="dark"
        style={{
          backgroundColor: "#101415", // Koyu tema için arka plan rengi
          color: "#fff",
          height: "100%",
          borderRadius: "1rem",
          padding: "3rem",
          marginTop: "1rem",
        }}>
        <Row xs={1} sm={2} md={3} lg={3} className="g-4 ">
          {discountedItems && discountedItems.length > 0 ? (
            discountedItems.map((product) => (
              <Col key={product.id}>
                <Card>
                  <Card.Body>
                    <ImageCarousel product={product} />
                    <Link
                      to={`/item/${product.id}`}
                      className="link-light link-underline-opacity-0">
                      <Card.Title className="mt-2">{product.name}</Card.Title>
                    </Link>
                    <Card.Text>
                      <p>
                        Eski Fiyat: <s>{product.oldprice} ₺</s>
                        <br />
                        Yeni Fiyat: <strong>{product.price} ₺</strong>
                      </p>
                    </Card.Text>
                    <Card.Text>
                      <small>
                        Eklenme Tarihi:{" "}
                        {new Date(product.addedDate).toLocaleDateString()}
                      </small>
                    </Card.Text>
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
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>Şu anlık burada bir şey yok</p>
            </Col>
          )}
          <Warning toast={showToast} setShowToast={setShowToast} />
        </Row>
      </Card>
    </Container>
  );
};

export default DiscountedPage;
