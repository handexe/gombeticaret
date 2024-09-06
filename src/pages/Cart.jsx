import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlices";
import { jwtDecode } from "jwt-decode";
import { Container, Card, ListGroup, Row } from "react-bootstrap";
import { incrementQuantity, decrementQuantity, removeFromCart } from '../redux/slices/cartSlices';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);

  const token = localStorage.getItem("token");
  let userId;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId; // JWT'den userId'yi alın
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart(userId));
    }
  }, [status, dispatch, userId]);


  const handleIncrement = (item) => {
    dispatch(incrementQuantity({ productId: item.ProductID, userId }));
  };

  const handleDecrement = (item) => {
    if (item.Quantity > 1) {
      dispatch(decrementQuantity({ productId: item.ProductID, quantity: item.Quantity, userId }));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart({ productId: item.ProductID, userId }));
  };
  if (status === "loading") {
    return <div>Loading cart...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="p-4">
      <Card.Title as="h2">Sepetin</Card.Title>
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
        <Row xs={1} sm={2} className="g-4 ">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item
                  key={item.CartItemID}
                  className="d-flex justify-content-between align-items-center mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "8rem" }}
                  />
                  {item.name} - Sayısı: {item.Quantity} - Fiyat: {item.price}{" "}
                  ₺
                  <div>
                    <button onClick={() => handleIncrement(item)}>
                      + 1 Ekle
                    </button>
                    <button
                      onClick={() => handleDecrement(item)}
                      disabled={item.Quantity === 1}>
                      - 1 Çıkar
                    </button>
                    <button onClick={() => handleRemove(item)}>
                      Tamamen Kaldır
                    </button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default Cart;
