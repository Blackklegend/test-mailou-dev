import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { addProduct, updateProduct } from '../services/api';
import FormField from './FormField';
import CategorySelect from './CategorySelect';

const initialProductState = { name: '', price: '', category: '', description: '' };

function EditProductDialog({ isOpen, onClose, onProductUpdated, product }) {
  const [newProduct, setNewProduct] = useState(product);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCategoryChange = (value) => {
    setNewProduct({ ...newProduct, category: value });
    setErrors({ ...errors, category: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const priceValue = parseFloat(newProduct.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Preço deve ser positivo';
    }
    if (!newProduct.category) newErrors.category = 'Categoria é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await updateProduct(newProduct);
        onProductUpdated();
        setNewProduct(initialProductState);
        onClose();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };


  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
          <Dialog.Title className="text-xl font-bold mb-4">Editar produto</Dialog.Title>
          <form onSubmit={handleSubmit}>
            <FormField 
              label="Nome *" 
              name="name"
              value={newProduct.name} 
              onChange={handleInputChange} 
              required={false}
            />
            <FormField 
              label="Preço *" 
              name="price"
              type="number" 
              value={newProduct.price} 
              onChange={handleInputChange} 
              required={true}
              error={errors.price}
            />
            <FormField 
              label="Descrição" 
              name="description"
              value={newProduct.description} o
              nChange={handleInputChange} 
              required={false} 
            />
            <CategorySelect 
              value={newProduct.category} 
              onChange={handleCategoryChange}
              error={errors.category}
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Editar Produto
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditProductDialog;