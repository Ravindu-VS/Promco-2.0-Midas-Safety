import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { errorMessage } from './services/authService';
import { toLocalDateString } from './services/api';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
});

beforeEach(() => localStorage.clear());

test('welcome page "Go to Login" button opens the login page', () => {
  renderAt('/');
  fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test('protected pages redirect to login when signed out', () => {
  renderAt('/faults');
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test('unknown routes show the 404 page', () => {
  renderAt('/does-not-exist');
  expect(screen.getByText('404')).toBeInTheDocument();
});

test('network errors are reported honestly, not as a successful action', () => {
  expect(errorMessage(new Error('Network Error'))).toMatch(/cannot reach the server/i);
  expect(errorMessage({ response: { data: { message: 'Invalid email or password' } } })).toBe('Invalid email or password');
});

test('local dates are not shifted to UTC', () => {
  expect(toLocalDateString(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
});
