
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders AI Chat heading', () => {
  render(<App />);
  const heading = screen.getByText('🤖 AI Chat');
  expect(heading).toBeInTheDocument();
});

test('shows initial placeholder message', () => {
  render(<App />);
  const message = screen.getByText('Ask me anything!');
  expect(message).toBeInTheDocument();
});

test('updates input field on typing', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Type your message...');
  fireEvent.change(input, { target: { value: 'Hello AI' } });
  expect(input.value).toBe('Hello AI');
});

test('shows loading state on button click', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ reply: 'AI response' })
    })
  );

  render(<App />);
  const button = screen.getByRole('button', { name: /send message/i });
  fireEvent.click(button);
  
  expect(screen.getByText('Thinking...')).toBeInTheDocument();
});
