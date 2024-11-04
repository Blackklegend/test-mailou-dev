const API_URL = 'http://localhost:9000';

export async function fetchProducts(page = 1, limit = 10) {
  const response = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`);
  return response.json();
}

export async function addProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
}

export async function updateProduct(product) {
  const response = await fetch(`${API_URL}/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
}


export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  return response;
}