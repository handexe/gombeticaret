import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterNewArrivals,
} from "../redux/slices/productSlices";
import { Button, Card, Col, Container, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const NewProducts = () => {
  const dispatch = useDispatch();
  const { status, newArrivals: products } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchProducts()).then(() => {
      dispatch(filterNewArrivals());
    });
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
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
                  <Link
                      to={`/item/${product.id}`}
                      className="link-light link-underline-opacity-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "20rem" }}
                    />
                    <Card.Title className="mt-2">{product.name}</Card.Title>
                    </Link>
                    <Card.Text>{product.price} ₺ </Card.Text>
                    <Card.Text>
                     <small> Eklenme Tarihi: {new Date(product.addeddate).toLocaleDateString()} </small>
                    </Card.Text>
                    <Button>Sepete Ekle</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No new products available</p>
            </Col>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default NewProducts;
