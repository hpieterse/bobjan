import { compose, toString } from 'transformation-matrix'

export function transformToString(...matrices) {
  let matrix = compose(
    matrices
  );

  let element = document.createElement('div');
  element.style.transform = toString(matrix);

  return element.style.transform;
}