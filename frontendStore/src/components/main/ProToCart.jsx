import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
const ProToCart = ({ products, onClose, onRemove }) => {
  const calculateTotal = () =>
    products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center bg-orange-600 px-6 py-4 border-b">
          <h2 className="text-xl text-black font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-orange-200 hover:text-gray-700"
          >
            <AiFillCloseCircle size={30} />
          </button>
        </div>

        {/* Cart Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-black">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-white">Description</th>
                <th className="px-6 py-3 text-white">Size</th>
                <th className="px-6 py-3 text-white">Color</th>
                <th className="px-6 py-3 text-white">Quantity</th>
                <th className="px-6 py-3 text-white">Remove</th>
                <th className="px-6 py-3 text-white">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Description */}
                  <Link
                    state={{ product: product,selectedSizes: product.size }}
                    to={`/product/${product.name}`}
                  >
                    <td className="px-6 py-4 flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                      </div>
                    </td>
                  </Link>

                  {/* Size */}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {Array.isArray(product.size) ? (
                        // Use a Set to remove duplicates from the size array
                        [...new Set(product.size)].map((sizeOption, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-sm rounded-md"
                          >
                            {sizeOption}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-sm rounded-md">
                          {product.size}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Color */}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {Array.isArray(product.color) ? (
                        // Use a Set to remove duplicates from the color array
                        [...new Set(product.color)].map(
                          (colorOption, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-sm rounded-md"
                            >
                              {colorOption}
                            </span>
                          )
                        )
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-sm rounded-md">
                          {product.color}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-200 text-sm rounded-md">
                      {product.quantity}
                    </span>
                  </td>

                  {/* Remove */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-semibold">
                    {product.price * product.quantity} MAD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="px-6 py-4 border-t text-black">
          <div className="flex justify-between items-center mb-4">
            <span>Delivery:</span>
            <span className="font-semibold">0.00 MAD</span>
          </div>
          <div className="flex  justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span>{calculateTotal()} MAD</span>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-6 py-4">
          <Link to="/checkout">
            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ProToCart.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      size: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
      color: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
        .isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ProToCart;
