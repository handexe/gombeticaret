import React, { useState, useEffect } from "react";
import { Col, ListGroup, Dropdown } from "react-bootstrap";
import { filterByCategory } from "../../redux/slices/productSlices";
import { useDispatch } from "react-redux";
const CategoryComponent = () => {
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);

  const categories = ["Hırdavat", "Elektrik", "Su Malzemeleri"]; // Örnek kategoriler

  const [selectedCategory, setSelectedCategory] = useState("Genel");

  useEffect(() => {
    // Function to check if the screen width is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change 768px as per your mobile breakpoint
    };

    // Initial check
    handleResize();

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(filterByCategory(category)); // Kategoriye göre filtreleme
  };
  return (
    <Col lg={3}>
      {isMobile ? (
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="category-dropdown">
            {selectedCategory || "Select Category"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => handleCategoryChange("Genel")}
              active={selectedCategory === "Genel"}>
              Genel
            </Dropdown.Item>
            {categories.map((category) => (
              <Dropdown.Item
                key={category}
                onClick={() => handleCategoryChange(category)}
                active={selectedCategory === category}>
                {category}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <ListGroup variant="flush" style={{ borderRadius: "1rem" }}>
          <ListGroup.Item
            onClick={() => handleCategoryChange("Genel")}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === "Genel" ? "bold" : "normal",
            }}
            action
            variant="dark">
            Genel
          </ListGroup.Item>
          {categories.map((category) => (
            <ListGroup.Item
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                cursor: "pointer",
                fontWeight: selectedCategory === category ? "bold" : "normal",
              }}
              action
              variant="dark">
              {category}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Col>
  );
};

export default CategoryComponent;
