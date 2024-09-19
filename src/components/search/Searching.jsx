import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Container, Card, Row, Col } from "react-bootstrap";
import { searchProducts } from "../../redux/slices/productSlices";
import { Link } from 'react-router-dom'
import ImageCarousel from "../product/ImageCarousel";

const Searching = ({ query }) => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.items.searchResults);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  useEffect(() => {
    if (query) {
      dispatch(searchProducts(query));
    }
  }, [query, dispatch]);

  if (status === "loading") {
    return <p>Yükleniyor...</p>;
  }

  if (status === "failed") {
    return <p>Hata: {error}</p>;
  }

  return (
    <Container className="p-4">
      <p className="display-4">Arama Sonuçları</p>
      <Card
        data-bs-theme="dark"
        style={{
          backgroundColor: "#101415",
          color: "#fff",
          height: "100%",
          borderRadius: "1rem",
          padding: "3rem",
          marginTop: "1rem",
        }}>
        <Row xs={1} sm={2} md={3} lg={3} className="g-4 ">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((item) => (
              <Col key={item.id}>
                <Card>
                  <Link to={`/item/${item.id}`} className="link-light link-underline-opacity-0">
                    <Card.Body>
                      <ImageCarousel product={item} />
                      <Card.Title className="mt-2">{item.name}</Card.Title>
                      <Card.Text>Fiyat: {item.price} ₺</Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))
          ) : (
            <p>Aramanızla ilgili bir sonuç bulunamadı.</p>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default Searching;
