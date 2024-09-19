import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { filterByCategory, fetchProducts } from "../redux/slices/productSlices";
import { addToCart } from "../redux/slices/cartSlices";
import {
  Container,
  Card,
  Carousel,
  Col,
  Row,
  Image,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/favorites/favorite";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../api/api";
import ImageCarousel from "../components/product/ImageCarousel";

const CategoryPage = () => {
  const { category } = useParams();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth);
  const products = useSelector((state) => state.items.filteredProducts);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(filterByCategory(category));
    }
  }, [status, dispatch]);

  const handleAddToCart = async (item) => {
    if (!item) {
      console.error("CategoryPage : İtem bulunamadı");
      return;
    }

    if (!user) {
      console.error("CategoryPage: Kullanıcı girişi bulunamadı");
      alert("Lütfen giriş yapınız");
      return;
    }
    let userId = user.uid;

    let imageUrl = item.image;

    if (!imageUrl) {
      try {
        const imageRef = ref(storage, `images/${item.id}`);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Resim alınırken hata maydana geldi");
        return;
      }

      try {
        await dispatch(
          addToCart({
            productId: item.id,
            quantity: 1,
            userId: userId,
            name: item.name,
            image: imageUrl,
            price: item.price,
          })
        );
        alert(`${item.name} sepete eklendi`);
      } catch (error) {
        console.error("Ürün eklenirken bir hata oluştu", error);
        alert(`${item.name} sepete eklenirken bir hata oluştu`);
      }
    }
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
          {" "}
          Sayfa Yükleniyor{" "}
        </Card>
      </Container>
    );
  }
  if (status === "failed") {
    return <div> {error} </div>;
  }
  return (
    <Container className="p-4">
      <Card.Title as="h2">{category}</Card.Title>
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
              <Col
                key={product.id}
                className=" my-5 d-flex align-items-stretch">
                <Card style={{ width: "20rem" }}>
                  <ImageCarousel product={product} />

                  <Card.Body>
                    <Card.Title>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <Link
                          to={`/item/${product.id}`}
                          className="link-light link-underline-opacity-0">
                          <h5>{product.name}</h5>
                        </Link>
                        <FavoriteButton itemId={product.id} />
                      </div>
                    </Card.Title>
                    <Card.Text>
                      Fiyat: {product.price} ₺
                      <br />
                      Kategori: {product.category}
                      <br />
                      <small>
                        {" "}
                        Tarih :{" "}
                        {new Date(product.addedDate).toLocaleDateString()}
                      </small>
                    </Card.Text>
                    <Button onClick={() => handleAddToCart(product)}>
                      Sepete Ekle
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div>Şu anlık burası boş görünüyor.</div>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default CategoryPage;
