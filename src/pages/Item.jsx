import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchItemById } from "../redux/slices/productSlices";
import {addToCart} from '../redux/slices/cartSlices'
import { Button, Container, Col, Row } from "react-bootstrap";
const Item = () => {
  const { id } = useParams(); // Get the ID from the URL
  const dispatch = useDispatch();
  const itemDetails = useSelector((state) => state.items.selectedItem);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [id, dispatch]);
  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); // Sepete ekleme
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>{error}</div>;

  return (
    <Container
    style={{
      backgroundColor: "#101415", // Koyu tema için arka plan rengi
      color: "#fff",
      height: "100%",
      borderRadius: "1rem",
      padding: "3rem",
      marginTop: "1rem",
    }}>
      {itemDetails ? (
        <Row>
          <Col>
            <img
              src={itemDetails.image}
              alt={itemDetails.name}
              style={{ height: "20rem", objectFit: "scale-down" ,backgroundColor: "white" }}
            />
          </Col>
          <Col>
            <h1>{itemDetails.name}</h1>
            <p>Fiyat: {itemDetails.price} ₺</p>
            <p>Kategori: {itemDetails.category}</p>
            <p>
              Eklenme Tarihi:{" "}
              {new Date(itemDetails.addeddate).toLocaleDateString()}
            </p>
            <Button  onClick={() => handleAddToCart(itemDetails)}>Sepete Ekle</Button>
          </Col>
        </Row>
      ) : (
        <Row>Item not found</Row>
      )}
    </Container>
  );
};

export default Item;
