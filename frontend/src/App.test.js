import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders product list', () => {
  render(<App />);
  const linkElement = screen.getByText(/Lista de produtos/i);
  expect(linkElement).toBeInTheDocument();
});
