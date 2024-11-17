/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

const Products = () => {
  const [productData, setProductData] = useState([]); // State to store all products

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/products/${id}`
      );

      setProductData(productData.filter((product) => product.id !== id)); // Update state
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/products");
      setProductData(response.data.productList);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Ensure data is available before rendering the table
  if (!productData || productData.length === 0) {
    return <div>Loading...</div>; // Loading state while data is being fetched or is undefined
  }

  // Define table headers
  const TABLE_HEAD = [
    "ID",
    "Name",
    "Description",
    "Price",
    "Old Price",
    "Category",
    "Color",
    "Size",
    "Image",
    "Actions",
  ];

  const TABLE_ROWS = productData.map((product) => {
    const colorString = product.colorOptions && Array.isArray(product.colorOptions)
      ? product.colorOptions.map((color) => color.value).join(", ") 
      : "N/A";
  
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      oldPrice: product.oldprice.toFixed(2),
      category: product.Category,
      color: colorString, 
      size: product.sizeOptions ? product.sizeOptions.join(", ") : "N/A", 
      image: product.image,
    };
  });
  
  
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Product Details
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              (
                {
                  id,
                  name,
                  description,
                  price,
                  oldPrice,
                  category,
                  color,
                  size,
                  image,
                },
                index
              ) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {description}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {price} MAD
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {oldPrice} MAD
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {category}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {color}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {size}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Avatar
                        src={image}
                        alt={name}
                        size="md"
                        className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                      />
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="red"
                        onClick={() => deleteProduct(id)}
                      >
                        <RiDeleteBin6Line
                          size={20}
                          className="bg-origin-content"
                        />
                      </Button>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default Products;
