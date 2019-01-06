export default class Matrix {
  constructor(rows, columns, values) {
    this.rows = rows || (values ? values.length : 1);
    this.columns = columns || 1;
    this.values = values || Array(this.rows * this.columns).fill(0);
  }

  element(i, j) {
    if (j === undefined) {
      if (this.rows > 1 && this.columns > 1) throw TypeError(`Two indexes must be provided for a 2-dimensional matrices (${this.rows}x${this.columns}).`);
      if (i <= 0) throw new RangeError(`Row index (${i}) must be greater than 0.`);
      if (this.columns === 1 && i > this.rows) throw new RangeError(`Index (${i}) cannot be greater than the number of elements (${this.rows}).`);
      if (this.rows === 1 && i > this.columns) throw new RangeError(`Index (${i}) cannot be greater than the number of elements (${this.columns}).`);
      return this.values[i - 1];
    } else {
      if (i <= 0) throw new RangeError(`Row index (${i}) must be greater than 0.`);
      if (i > this.rows) throw new RangeError(`Row index (${i}) cannot be greater than the number of rows (${this.rows}).`);
      if (j <= 0) throw new RangeError(`Row index (${j}) must be greater than 0.`);
      if (j > this.columns) throw new RangeError(`Row index (${j}) cannot be greater than the number of rows (${this.columns}).`);
      return this.values[(i - 1) * this.columns + (j - 1)];
    }
  }

  scale(scalar) {
    return new Matrix(this.rows, this.columns, this.values.map(x => scalar * x));
  }

  static add(matrix1, matrix2) {
    if (matrix1.rows !== matrix2.rows) throw new TypeError('Matrices must have the same number of rows.');
    if (matrix1.columns !== matrix2.columns) throw new TypeError('Matrices must have the same number of columns.');
    return new Matrix(matrix1.rows, matrix1.columns, matrix1.values.map((x, i) => x + matrix2.values[i]));
  }

  static multiply(matrix1, matrix2) {
    if (matrix1.columns !== matrix2.rows) throw new TypeError(`Second matrix must have the same number of rows (${matrix2.rows}) as the first matrix has columns (${matrix1.columns}).`);
    const newMatrix = new Matrix(matrix1.rows, matrix2.columns);
    for (let i = 1; i <= newMatrix.rows; ++i) {
      for (let j = 1; j <= newMatrix.columns; ++j) {
        for (let k = 1; k <= matrix1.columns; ++k) {
          newMatrix.values[(i - 1) * newMatrix.columns + (j - 1)] += matrix1.element(i, k) * matrix2.element(k, j);
        }
      }
    }
    return newMatrix;
  }

  static entrywiseProduct(matrix1, matrix2) {
    if (matrix1.rows !== matrix2.rows) throw new TypeError(`Matrices must have the same number of rows.`);
    if (matrix1.columns !== matrix2.columns) throw new TypeError(`Matrices must have the same number of columns.`);
    return new Matrix(matrix1.rows, matrix1.columns, matrix1.values.map((x, i) => x * matrix2.values[i]));
  }
}
