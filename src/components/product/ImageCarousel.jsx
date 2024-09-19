import { memo } from "react";
import { Carousel } from "react-bootstrap";

const ImageCarousel = memo(({ product }) => {
  return (
    <>
      {product.image && product.image.length > 0 && (
        <div>
          <Carousel
            variant="dark"
            style={{ width: "100%", marginBottom: "1rem" }}
            controls={product.image.length > 1} // Show controls only if more than 1 image
            indicators={product.image.length > 1} // Show indicators only if more than 1 image
          >
            {product.image.map((imgUrl , idx) => (
              <Carousel.Item key={idx}> 
                <img
                  src={imgUrl}
                  alt={`Slide ${idx}`}
                  style={{
                    width: "100%",
                    height: "15rem",
                    objectFit: "scale-down",
                  }}
                />
              </Carousel.Item>
            ))}
            
          </Carousel>
        </div>
      )}
    </>
  );
});

export default ImageCarousel;
