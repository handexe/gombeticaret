import React from "react";
import { Carousel } from 'react-bootstrap';
import dukkanOn from "../../assets/dukkanOn.jpg";


const SliderComp = () => {
  return (
    <Carousel style={{  width: "100%", marginBottom: "3rem" }}>
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="https://via.placeholder.com/800x400"
        alt="First slide"
        style={{ height: '18rem' }}
      />
      <Carousel.Caption>
        <h5>Lütfen dikkat !</h5>
        <p>Burası bir tanıtım sayfasıdır alış veriş için dükkanımıza bekleriz.</p>
      </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100"
        src={dukkanOn}
        alt="Second slide"
        style={{ height: '18rem' }}
      />
      <Carousel.Caption>
        <h5>Neye ihtiyacın varsa hepsi burada</h5>
        <p>İncele</p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
  );
};

export default SliderComp;
