import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import { fetchProducts } from './services/api';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data.products);
  };

  return (
    <div className="container mx-auto p-4">
      <ProductList products={products} onProductDeleted={loadProducts} />
    </div>
  );
}

export default App;