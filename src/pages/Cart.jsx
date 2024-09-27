import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../redux/slices/cartSlices";
import { Button, Container, Card, ListGroup, Row } from "react-bootstrap";
import ImageCarousel from "../components/product/ImageCarousel";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);

  useEffect(() => {
    if (user && user.uid && status === "idle") {
      // Check if user and user.uid are available
      const userId = user.uid;
      console.log("user id: " + userId);
      dispatch(fetchCart(userId));
    }
  }, [dispatch, user, status]);
  // `user` ve `status`'u bağımlılıklar olarak ekle

  const handleIncrement = (item) => {
    if (user) {
      dispatch(
        incrementQuantity({ productId: item.productId, userId: user.uid })
      );
    }
  };

  const handleDecrement = (item) => {
    if (user && item.quantity > 1) {
      dispatch(
        decrementQuantity({
          productId: item.productId,
          quantity: item.quantity,
          userId: user.uid,
        })
      );
    }
  };

  const handleRemove = (item) => {
    if (user) {
      dispatch(removeFromCart({ productId: item.productId, userId: user.uid }));
    }
  };
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  if (status === "loading") {
    return (
      <Container className="p-4">
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
          Sepet Yükleniyor
        </Card>
      </Container>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <Container className="p-4">
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
          Giriş yapmadınız. Lütfen giriş yapın.
        </Card>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      <Card.Title as="h2">Sepetiniz</Card.Title>
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
        <Row xs={1} sm={2} className="g-4">
          {cart.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item
                  key={item.productId}
                  className="d-flex justify-content-between align-items-center mb-2">
                  <ImageCarousel
                    product={item}
                    style={{ width: "8rem" }}
                  />
                  <div style={{ width: "30rem" }}>
                    {item.name}
                    <br />
                    Adedi: {item.quantity}
                    <br />
                    Tane Fiyatı: {item.price} ₺
                    <br />
                    Toplam Fiyati: {item.quantity * item.price} ₺
                  </div>

                  <div>
                    <Button
                    style={{ width: "2.5rem"}}
                      className="me-2"
                      variant="outline-light"
                      onClick={() => handleIncrement(item)}>
                      +
                    </Button>
                    <Button
                    style={{ width: "2.5rem"}}
                      className="ms-2"
                      variant="outline-light"
                      onClick={() => handleDecrement(item)}
                      disabled={item.quantity === 1}>
                      -
                    </Button>
                    <Button
                      className="mx-3 my-2"
                      variant="outline-danger"
                      onClick={() => handleRemove(item)}>
                      Kaldır
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="mt-4">
            <h4>Toplam: {calculateTotalPrice().toFixed(2)} ₺</h4>
          </div>
        </Row>
      </Card>
    </Container>
  );
};

export default Cart;
