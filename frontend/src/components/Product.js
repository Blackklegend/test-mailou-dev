import React, { useState } from 'react';
import { categories } from '../types/categories';
import EditProductDialog from './EditProductDialog';

function Product({ product, onDelete, onUpdate }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <li className="border-b py-2">
      <span className="font-bold">{product.name}</span> - R$ {product.price}
      <span className="ml-1">
        ({categories.find(c => c.value === product.category)?.label})
      </span>
      <p className="text-gray-600">{product.description}</p>
      <button
        className="ml-4 bg-red-600 text-white px-2 py-1 rounded"
        onClick={() => onDelete(product.id)}
      >
        Excluir
      </button>

      <button
        className="ml-4 bg-blue-600 text-white px-2 py-1 rounded"
        onClick={() => setIsDialogOpen(true)}
      >
        Editar
      </button>
      <EditProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onProductUpdated={onUpdate}
        product={product}
      />
    </li>
  );
}

export default Product;