import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  render(<App />);
  expect(screen.getAllByText(/FoodApp/i).length).toBeGreaterThan(0);
});
