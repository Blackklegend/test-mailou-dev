import React, { useState, useEffect, useCallback } from 'react';
import { deleteProduct, fetchProducts } from '../services/api';
import AddProductDialog from './AddProductDialog';
import Product from './Product';

function ProductList({ onProductDeleted }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const loadProducts = useCallback(async () => {
    await fetchProducts(currentPage, itemsPerPage).then(res => {
      setProducts(res.products);
      setTotalPages(res.totalPages);
    }).catch(err => console.error("error loading products", err));
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
    onProductDeleted();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1)
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Lista de Produtos</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsDialogOpen(true)}
      >
        Adicionar Produto
      </button>

      <AddProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onProductAdded={loadProducts}
      />
      <ul className="mt-4">
        {products.map((product) => (
          <Product key={product.id} product={product} onDelete={handleDelete} onUpdate={loadProducts} />
        ))}
      </ul>


      <div className="mt-4 flex justify-between items-center">
        <div className=''>
          <span>Itens por página: </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-2 py-1 rounded ml-2 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;