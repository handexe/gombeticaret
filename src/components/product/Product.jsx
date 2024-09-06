import React from "react";
import { useDispatch } from "react-redux";
import { toggleFavorite } from "../../redux/slices/productSlices";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import { Button } from "react-bootstrap";
import "./Product.css";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(product));
  };
  return (
    <div className="product-container">
      <button className="favorite-button" onClick={handleFavoriteClick}>
        {product.isFavorited ? (
          <BsHeartFill className="favorite-icon" />
        ) : (
          <BsHeart className="favorite-icon" />
        )}
      </button>
      <img src={product.image} alt={product.name} className="product-image"/>
      <h5>{product.name}</h5>
      <h6>{product.price}</h6>
    </div>
  );
};

export default Product;
