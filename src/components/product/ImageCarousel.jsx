
import { Carousel, Image } from "react-bootstrap";
import {Link} from 'react-router-dom'
import "./ImageCarousel.css";
const ImageCarousel = ({ product }) => {
  return (
    <>
      {product.image && product.image.length > 0 && (
        <>
          <Carousel
            variant="light"
            style={{ width: "100%", marginBottom: "1rem" }}
            controls={product.image.length > 1} // Show controls only if more than 1 image
            indicators={product.image.length > 1} // Show indicators only if more than 1 image
            interval={null}>
            {product.image.map((imgUrl, idx) => (
              <Carousel.Item key={idx}>
                <Link
                  to={`/item/${product.id}`}
                  className="link-light link-underline-opacity-0">
                  <Image id="image" loading="lazy" src={imgUrl} />
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}
    </>
  );
};

export default ImageCarousel;
