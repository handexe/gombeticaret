import React from "react";
import { Carousel } from "react-bootstrap";
import dukkanOn from "../../assets/dukkanOn.jpg";
import tabela1 from "../../assets/tabela1.jpg";

const SliderComp = () => {
  return (
    <Carousel
      style={{ width: "100%", marginBottom: "3rem" }}
      data-bs-theme="dark">
      <Carousel.Item>
        <div style={{ position: "relative" }}>
          <img
            className="d-block w-100"
            src={tabela1}
            alt="Tabela"
            style={{ height: "20rem" }}
          />
          <div
            style={{
              position: "absolute",
              top: "20px", // Adjust this value to move the text vertically
              left: "50%",
              transform: "translateX(-50%)", // Centers the text horizontally
              zIndex: "100",
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
            }}>
            <h5>Lütfen dikkat!</h5>
            <p>
              Burası bir tanıtım sayfasıdır alış veriş için dükkanımıza
              bekleriz.
            </p>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <Carousel.Caption>
          <div
            style={{
              zIndex: "100",
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "1rem",
              borderRadius: "1rem",
            }}>
            <h5>Neye ihtiyacın varsa hepsi burada</h5>
            <p>İncele</p>
          </div>
        </Carousel.Caption>
        <img
          className="d-block w-100"
          src={dukkanOn}
          alt="Dükkan Ön Görünüş"
          style={{ height: "20rem" }}
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default SliderComp;
