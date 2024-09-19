import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchItemById } from "../redux/slices/productSlices";
import { addToCart } from "../redux/slices/cartSlices";
import { Button, Container, Col, Row } from "react-bootstrap";
import ImageCarousel from "../components/product/ImageCarousel";

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
    dispatch(addToCart(product)); // Add to cart
  };

  if (status === "loading")
    return (
      <Container
        style={{
          backgroundColor: "#101415", // Dark theme background color
          color: "#fff",
          height: "100%",
          borderRadius: "1rem",
          padding: "3rem",
          marginTop: "1rem",
        }}>
        Yükleniyor...
      </Container>
    );
  if (status === "failed")
    return (
      <Container
        style={{
          backgroundColor: "#101415", // Dark theme background color
          color: "#fff",
          height: "100%",
          borderRadius: "1rem",
          padding: "3rem",
          marginTop: "1rem",
        }}>
        Hata: {error}
      </Container>
    );

  return (
    <Container
      style={{
        backgroundColor: "#101415", // Dark theme background color
        color: "#fff",
        height: "100%",
        borderRadius: "1rem",
        padding: "3rem",
        marginTop: "1rem",
      }}>
      {itemDetails ? (
        <Row>
          <Col>
            <ImageCarousel product={itemDetails} />
          </Col>
          <Col>
            <h1>{itemDetails.name}</h1>
            <p>Fiyat: {itemDetails.price} ₺</p>
            <p>Kategori: {itemDetails.category}</p>
            <p>
              Eklenme Tarihi:{" "}
              {new Date(itemDetails.addedDate).toLocaleDateString()}
            </p>
            <Button onClick={() => handleAddToCart(itemDetails)}>
              Sepete Ekle
            </Button>
          </Col>
        </Row>
      ) : (
        <Row>Item not found</Row>
      )}
    </Container>
  );
};

export default Item;
