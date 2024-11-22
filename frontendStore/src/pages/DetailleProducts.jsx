/* eslint-disable no-unused-vars */
import "./SizeSelector.css";
import MainLayout from "../layout/MainLayout";
import { useCart } from "../context/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";

import { Box, Typography, Rating, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useLocation } from "react-router-dom";

const DetailleProducts = () => {
  const location = useLocation();
  const { product, selectedSizes } = location.state || {};
  const [quantity, setQuantity] = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const { cartProducts, setCartProducts } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle the previous and Next image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) => {
      // If the color is already selected, deselect it; otherwise, select it
      const newColors = prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color];

      setCartProducts((prevCart) => {
        if (!Array.isArray(prevCart)) return [];

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, color: newColors } // Dynamically update color
            : item
        );
      });

      return newColors;
    });
  };

  const handleSizeToggle = (size) => {
    setSelectedSize((prev) => {
      // If the size is already selected, deselect it; otherwise, select it
      const newSize = prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size];

      setCartProducts((prevCart) => {
        if (!Array.isArray(prevCart)) return [];

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, size: newSize } // Dynamically update size
            : item
        );
      });

      return newSize;
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;

      setCartProducts((prevCart) => {
        if (!Array.isArray(prevCart)) return [];
        const updatedCart = prevCart.filter((item) => item.id !== product.id);
        // Add the updated product with the new size, color, and quantity
        return [
          ...updatedCart,
          {
            ...product,
            quantity: newQuantity,
            size: selectedSize,
            color: selectedColors,
          },
        ];
      });

      return newQuantity;
    });
  };

  const handleDecrease = () => {
    setQuantity((prev) => {
      const newQuantity = prev > 0 ? prev - 1 : 0;

      setCartProducts((prevCart) => {
        if (!Array.isArray(prevCart)) return [];

        const updatedCart = prevCart.filter((item) => item.id !== product.id);

        if (newQuantity > 0) {
          // Add the updated product with the reduced quantity
          return [
            ...updatedCart,
            {
              ...product,
              quantity: newQuantity,
              size: selectedSize,
              color: selectedColors,
            },
          ];
        }

        return updatedCart;
      });

      return newQuantity;
    });
  };
  return (
    <MainLayout>
      <div className="flex mt-40 pt-9 bg-white flex-col md:flex-row p-4">
        <Box className="w-full md:w-1/2 flex justify-center items-center p-4">
          <div className="relative w-full h-[500px] max-w-[600px] overflow-hidden rounded-lg shadow flex justify-center items-center">
            {product.images.length > 0 ? (
              <>
                {/* Image display */}
                <img
                  src={product.images[currentIndex]}
                  alt={`Product ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                />
                {product.images.length === 1 ? (
                  <p>Images are available</p>
                ) : (
                  <>
                    {/* Previous button */}
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      &lt;
                    </button>

                    {/* Next button */}
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      &gt;
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>No images available</p>
            )}
          </div>
        </Box>

        {/* Details Section */}
        <Box className="w-full md:w-1/2 p-4 space-y-4">
          <Typography variant="h5" className="font-bold text-black ">
            {product.name}
          </Typography>
          <Rating precision={0.1} value={product.rating} readOnly />
          <Typography variant="h4" className="text-gray-700">
            {product.price} MAD
          </Typography>
          <Typography
            variant="h6"
            sx={{ textDecoration: "line-through" }}
            className="text-gray-700"
          >
            {product.oldprice} MAD
          </Typography>
          <Typography variant="body1" className="text-black">
            {product.richDescription}
          </Typography>

          <Box className="flex flex-col items-start space-y-4 mt-4">
            {/* Size Selection */}
            <Typography variant="h8" className="font-bold text-black ">
              Size
            </Typography>
            <Box className="size-selector">
              <div className="size-options">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`size-button text-black ${
                      selectedSize.includes(size) ? "selected" : ""
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </Box>

            {/* Color Selection */}
            <Typography variant="h8" className="font-bold text-black ">
              {" "}
              Color
            </Typography>
            <Box className="flex items-center space-x-2">
              {product.colorOptions.map(({ value, color }) => (
                <IconButton
                  key={value}
                 
                  onClick={() => handleColorToggle(value)}
                  style={{
                    backgroundColor: selectedColors.includes(value)
                      ? color
                      : "transparent",
                    border: `3px solid ${color}`,
                    borderRadius: "30%", // Circular buttons
                    position: "relative",
                    width: 40,
                    height: 40,
                  }}
                  aria-label={value}
                  
                  
                >
                  <span className="text-black text-sm">{value[0]}</span>
                  {selectedColors.includes(value) && (
                    <CheckIcon
                      style={{
                        color: "#fff",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </IconButton>
              ))}
              
            </Box>

            {/* Quantity Selection with Plus/Minus Icons */}
            <Typography variant="h8" className="font-bold text-black ">
              {" "}
              Quantity
            </Typography>
            <Box className="flex items-center space-x-2">
              <IconButton
                style={{ backgroundColor: "red", color: "white" }}
                onClick={handleDecrease}
                disabled={quantity === 0}
                aria-label="decrease"
                color="warning"
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                variant="body1"
                className="w-8 text-black text-center"
              >
                {quantity}
              </Typography>
              <IconButton
                style={{ backgroundColor: "green", color: "white" }}
                onClick={handleIncrease}
                disabled={quantity === 20}
                aria-label="increase"
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </div>
    </MainLayout>
  );
};

export default DetailleProducts;
