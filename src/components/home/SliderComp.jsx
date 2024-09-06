import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image, Col } from "react-bootstrap";
const SliderComp = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div
      className="slider-container p-3 mt-3 mb-5"
      style={{
        backgroundColor: "#101415", // Koyu tema için arka plan rengi
        color: "#fff", // Yazı rengi
        borderRadius: "1rem",
        width: "90%"
      }}>
      <Slider {...settings}>
        <div className="d-flex align-items-center">
          <Col lg={8} xs={6} style={{ marginLeft: "10%" }}>
            <div className="h1">En Şık Çantaları Bul</div>
            <div className="h5">İncele</div>
          </Col>
          <Col lg={4} xs={6} style={{ marginLeft: "5%" }}>
            <Image
              src="https://derimod.com.tr/cdn/shop/files/86fae63a6d4d7c5c16af9149e53f3d37_7a3e137c-a8bc-48ed-95bc-30d531a7fee0.jpg?v=1722465365"
              alt=""
              style={{ width: "30%" }}
            />
          </Col>
        </div>
        <div>
          <h3>2</h3>
        </div>
      </Slider>
    </div>
  );
};

export default SliderComp;
