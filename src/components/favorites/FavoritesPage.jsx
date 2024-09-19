import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../redux/slices/favoriteSlices";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import { fetchProducts } from "../../redux/slices/productSlices";
import ImageCarousel from "../product/ImageCarousel";
const FavoritesPage = () => {
  const dispatch = useDispatch();
  const userFavorites = useSelector((state) => state.favorites.userFavorites);
  const loading = useSelector((state) => state.favorites.loading);
  const error = useSelector((state) => state.favorites.error);
  const user = useSelector((state) => state.auth);
  const product = useSelector((state) => state.items.items);

  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchFavorites(user.uid)); // Fetch user's favorites
      dispatch(fetchProducts());
    }
  }, [dispatch, user]);
  const favoriteProducts = product.filter((p) => userFavorites.includes(p.id));
  if (loading) {
    return (
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
          
        Favorilerin Yükleniyor
      </Card>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || !user.uid) {
    return <Card
    data-bs-theme="dark"
    style={{
      backgroundColor: "#101415",
      color: "#fff",
      height: "100%",
      borderRadius: "1rem",
      padding: "3rem",
      marginTop: "1rem",
    }}> <Card.Title>Favoriler için lütfen giriş yapınız.</Card.Title> </Card>;
  }

  return (
    <Container className="p-4">
      <Card.Title as="h2">Favorilerin</Card.Title>
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
        <Row xs={2} sm={3} md={4} className="g-4">
          {favoriteProducts.length === 0 ? (
            <p>Favorilerin şu an boş görünüyor</p>
          ) : (
            favoriteProducts.map((item) => (
              <Col key={item.productId}>
                <Card style={{ width: "13rem" }}>
                  <Link
                    to={`/item/${item.id}`}
                    className="link-light link-underline-opacity-0">
                    <ImageCarousel product={item} />
                  </Link>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Fiyat: {item.price} ₺</Card.Text>
                    <Link to={`/item/${product.id}`}>
                      <Button variant="outline-light">Ürüne git</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default FavoritesPage;
