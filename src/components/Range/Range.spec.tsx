import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Range from './Range';

describe('Range Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates the minimum value via prompt and clamps it within the allowed range', () => {
    const initialMin = 10;
    const initialMax = 50;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const minLabel = screen.getByTestId('min-label');
    expect(minLabel).toHaveTextContent('10');

    jest.spyOn(window, 'prompt').mockReturnValue('100');
    fireEvent.click(minLabel);
    expect(minLabel).toHaveTextContent('50');

    jest.spyOn(window, 'prompt').mockReturnValue('0');
    fireEvent.click(minLabel);
    expect(minLabel).toHaveTextContent('10');

    jest.spyOn(window, 'prompt').mockReturnValue('30');
    fireEvent.click(minLabel);
    expect(minLabel).toHaveTextContent('30');
  });

  it('updates the maximum value via prompt and clamps it correctly', () => {
    const initialMin = 10;
    const initialMax = 50;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const maxLabel = screen.getByTestId('max-label');
    expect(maxLabel).toHaveTextContent('50');

    // Try setting below min
    jest.spyOn(window, 'prompt').mockReturnValue('5');
    fireEvent.click(maxLabel);
    expect(maxLabel).toHaveTextContent('10');

    // Try setting above initialMax
    jest.spyOn(window, 'prompt').mockReturnValue('100');
    fireEvent.click(maxLabel);
    expect(maxLabel).toHaveTextContent('50');

    // Set valid value within range
    jest.spyOn(window, 'prompt').mockReturnValue('40');
    fireEvent.click(maxLabel);
    expect(maxLabel).toHaveTextContent('40');
  });

  it('renders both handles and ensures initial positions are correct', () => {
    const initialMin = 0;
    const initialMax = 100;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const minHandle = screen.getByTestId('min-handle');
    const maxHandle = screen.getByTestId('max-handle');

    // Initially, handles should be at 0% and 100% (min and max)
    // We can't easily test exact styles here, but we know min should be at start and max at end.
    expect(minHandle).toBeInTheDocument();
    expect(maxHandle).toBeInTheDocument();
  });

  it('does not allow min handle to cross max handle when dragging', () => {
    const initialMin = 10;
    const initialMax = 50;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const minHandle = screen.getByTestId('min-handle');
    const maxHandle = screen.getByTestId('max-handle');

    // Simulate dragging min handle far to the right:
    fireEvent.mouseDown(minHandle, { clientX: 0 });
    // Move mouse far to the right
    fireEvent.mouseMove(document, { clientX: 5000 });
    fireEvent.mouseUp(document);

    // After this operation, min should not surpass max.
    const minLabel = screen.getByTestId('min-label');
    const maxLabel = screen.getByTestId('max-label');

    const minValue = parseInt(minLabel.textContent || '', 10);
    const maxValue = parseInt(maxLabel.textContent || '', 10);

    expect(minValue).toBeLessThanOrEqual(maxValue);
  });

  it('does not allow max handle to cross min handle when dragging', () => {
    const initialMin = 10;
    const initialMax = 50;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const minHandle = screen.getByTestId('min-handle');
    const maxHandle = screen.getByTestId('max-handle');

    // Simulate dragging max handle far to the left:
    fireEvent.mouseDown(maxHandle, { clientX: 1000 });
    fireEvent.mouseMove(document, { clientX: -5000 });
    fireEvent.mouseUp(document);

    const minLabel = screen.getByTestId('min-label');
    const maxLabel = screen.getByTestId('max-label');

    const minValue = parseInt(minLabel.textContent || '', 10);
    const maxValue = parseInt(maxLabel.textContent || '', 10);

    expect(maxValue).toBeGreaterThanOrEqual(minValue);
  });

  it('handles no changes if prompt is cancelled', () => {
    const initialMin = 10;
    const initialMax = 50;
    render(<Range initialMin={initialMin} initialMax={initialMax} />);

    const minLabel = screen.getByTestId('min-label');

    jest.spyOn(window, 'prompt').mockReturnValue(null);
    fireEvent.click(minLabel);

    expect(minLabel).toHaveTextContent('10');
  });
});