import React, { useEffect ,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchItemById } from "../redux/slices/productSlices";
import { Button, Container, Col, Row } from "react-bootstrap";
import ImageCarousel from "../components/product/ImageCarousel";
import HandleAddToCart from "../helpers/HandleAddToCart";
import Warning from "../components/Toast/Warning"; 

const Item = () => {
  const { id } = useParams(); // Get the ID from the URL
  const dispatch = useDispatch();
  
  const [showToast, setShowToast] = useState(false); // Toast state

  const itemDetails = useSelector((state) => state.items.selectedItem);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  const user = useSelector((state) => state.auth.uid);


  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [id, dispatch]);


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
            <Button
              onClick={() =>
                HandleAddToCart(
                  itemDetails,
                  dispatch,
                  user,
                  showToast,
                  setShowToast
                )
              }>
              Sepete Ekle
            </Button>
          </Col>
          <Warning toast={showToast} setShowToast={setShowToast} />
        </Row>
      ) : (
        <Row>Item not found</Row>
      )}
    </Container>
  );
};

export default Item;
