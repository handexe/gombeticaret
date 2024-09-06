import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Image, Container, Card, Row, Col } from "react-bootstrap";
import { searchProducts } from "../../redux/slices/productSlices";

const Searching = ({ query }) => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.items.searchResults);

  useEffect(() => {
    if (query) {
      dispatch(searchProducts(query)); // Sorguya göre arama yapılır
    }
  }, [query, dispatch]);

  return (
    <Container className="p-4">
       <p className="display-4">Arama Sonuçları</p>
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
          {searchResults && searchResults.length > 0 ? ( // searchResults kontrol ediliyor
            searchResults.map((item) => (
              <Col key={item.id}>
                <Card>
                  <Card.Body>
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: "17rem" }}
                    />
                    <Card.Title className="mt-2">{item.name}</Card.Title>
                    <Card.Text>{item.price} ₺</Card.Text>
                    <Card.Text>
                      <small>Added on: {new Date(item.addeddate).toLocaleDateString()}</small>
                    </Card.Text>
                  </Card.Body>
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
