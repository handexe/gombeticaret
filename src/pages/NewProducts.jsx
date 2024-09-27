import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterNewArrivals,
} from "../redux/slices/productSlices";
import { Button, Card, Col, Container, Row} from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageCarousel from "../components/product/ImageCarousel";

const NewProducts = () => {
  const dispatch = useDispatch();
  const { status, newArrivals: products } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchProducts()).then(() => {
      dispatch(filterNewArrivals());
    });
  }, [dispatch]);

  if (status === "loading")
    return (
      <Container className="p-4">
      <Card.Title as="h2">Yeni Gelenler</Card.Title>
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
  if (status === "failed") return <div>Error loading products</div>;

  return (
    <Container className="p-4">
      <Card.Title as="h2">Yeni Gelenler</Card.Title>
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
          {products && products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id}>
                <Card>
                  <Card.Body>
                    <ImageCarousel product={product} />
                    <Link
                      to={`/item/${product.id}`}
                      className="link-light link-underline-opacity-0">
                      <Card.Title className="mt-2">{product.name}</Card.Title>
                    </Link>
                    <Card.Text>{product.price} ₺ </Card.Text>
                    <Card.Text>
                      <small>
                        {" "}
                        Eklenme Tarihi:{" "}
                        {new Date(product.addedDate).toLocaleDateString()}{" "}
                      </small>
                    </Card.Text>
                    <Button>Sepete Ekle</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>Şu anlık burada bir şey yok</p>
            </Col>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default NewProducts;
