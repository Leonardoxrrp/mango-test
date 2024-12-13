import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeFixed from './RangeFixed';

describe('RangeFixed Component', () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  it('renders initial min and max labels correctly', () => {
    render(<RangeFixed values={values} />);
    expect(screen.getByTestId('min-value')).toHaveTextContent('$1.99');
    expect(screen.getByTestId('max-value')).toHaveTextContent('$70.99');
  });

  it('renders ticks for each value', () => {
    render(<RangeFixed values={values} />);
    values.forEach((_, index) => {
      const tick = screen.getByTestId(`tick-${index}`);
      expect(tick).toBeInTheDocument();
    });
  });

  it('does not allow the min handle to cross the max handle when dragged', () => {
    render(<RangeFixed values={values} />);
    const minHandle = screen.getByTestId('min-handle');

    // Drag min handle far right
    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 9999 });
    fireEvent.mouseUp(document);

    const minLabel = screen.getByTestId('min-value');
    const maxLabel = screen.getByTestId('max-value');
    // min should not surpass max
    const minVal = parseFloat(minLabel.textContent?.replace('$', '') || '0');
    const maxVal = parseFloat(maxLabel.textContent?.replace('$', '') || '0');
    expect(minVal).toBeLessThanOrEqual(maxVal);
  });

  it('does not allow the max handle to cross the min handle when dragged', () => {
    render(<RangeFixed values={values} />);
    const maxHandle = screen.getByTestId('max-handle');

    // Move max handle far left
    fireEvent.mouseDown(maxHandle, { clientX: 1000 });
    fireEvent.mouseMove(document, { clientX: -9999 });
    fireEvent.mouseUp(document);

    const minLabel = screen.getByTestId('min-value');
    const maxLabel = screen.getByTestId('max-value');
    const minVal = parseFloat(minLabel.textContent?.replace('$', '') || '0');
    const maxVal = parseFloat(maxLabel.textContent?.replace('$', '') || '0');
    expect(maxVal).toBeGreaterThanOrEqual(minVal);
  });
});