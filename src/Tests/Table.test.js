import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../Components/Table';
import { initialData } from '../Data/data';

describe('<Table />', () => {
  let mockData;
  
  // Set up the mockData before each test
  beforeEach(() => {
    mockData = [...initialData];
  });

  // Test if the table renders with initial data
  test('renders table with initial data', () => {
    render(<Table />);
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test filtering functionality by name
  test('can filter by name', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-name'), { target: { value: 'Laptop' } });
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  // Test filtering functionality by date
  test('can filter by date', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-date'), { target: { value: '2023-01-01' } });
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  // Test filtering by high price
  test('can filter by high price', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-price'), { target: { value: 'High' } });
    mockData.filter(item => item.price >= 500).forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test filtering by low price
  test('can filter by low price', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-price'), { target: { value: 'Low' } });
    mockData.filter(item => item.price < 500).forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test filtering by rating
  test('can filter by rating', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-rating'), { target: { value: '4' } });
    mockData.filter(item => item.rating >= 4).forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test if category filter is visible upon clicking the button
  test('category filter opens on click', () => {
    render(<Table />);
    fireEvent.click(screen.getByTestId('filter-category-button'));
    expect(screen.getByTestId('filter-category-electronics')).toBeInTheDocument();
  });

  // Test filtering by category
  test('can filter by category', () => {
    render(<Table />);
    fireEvent.click(screen.getByTestId('filter-category-button'));
    fireEvent.click(screen.getByTestId('filter-category-electronics'));
    mockData.filter(item => item.category.toLowerCase() === 'electronics').forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test if all filters can be reset
  test('can reset filters', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-name'), { target: { value: 'Laptop' } });
    fireEvent.click(screen.getByTestId('reset-button'));
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  // Test if a row can be deleted
  test('deletes a row when delete button is clicked', () => {
    render(<Table />);
    fireEvent.click(screen.getAllByTestId('delete-button')[0]);
    expect(screen.queryByText(mockData[0].name)).toBeNull();
  });

  // Test if "No data available" is shown when no rows match filter
  test('shows "No data available" when no rows match filter', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-name'), { target: { value: 'NoSuchName' } });
    expect(screen.getByTestId('no-data-row')).toBeInTheDocument();
  });

  // Test that the categories in the category filter dropdown are unique
  test('displays unique categories in category filter', () => {
    render(<Table />);
    fireEvent.click(screen.getByTestId('filter-category-button'));
    const uniqueCategories = Array.from(new Set(mockData.map(item => item.category.toLowerCase())));
    uniqueCategories.forEach((category) => {
      expect(screen.getByTestId(`filter-category-${category}`)).toBeInTheDocument();
    });
  });

  // Test that applying a new filter doesn't reset the previous ones
  test('maintains previous filters when a new filter is applied', () => {
    render(<Table />);
    fireEvent.change(screen.getByTestId('filter-name'), { target: { value: 'Laptop' } });
    fireEvent.click(screen.getByTestId('filter-category-button'));
    fireEvent.click(screen.getByTestId('filter-category-electronics'));
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  // Test that initialData array is not mutated
  test('checks that initialData is not mutated during filter operations', () => {
    render(<Table />);
    fireEvent.click(screen.getAllByTestId('delete-button')[0]);
    expect(initialData).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1, name: 'Laptop' })]));
  });

  // Test if each row in the table renders correct data
  test('renders rows with correct data', () => {
    render(<Table />);
    mockData.forEach((item, index) => {
      const row = screen.getAllByTestId('table-row')[index];
      expect(row).toHaveTextContent(item.name);
      expect(row).toHaveTextContent(item.category);
      expect(row).toHaveTextContent(item.date);
      expect(row).toHaveTextContent(`${item.price}/-`);
      expect(row).toHaveTextContent(item.rating);
    });
  });
});