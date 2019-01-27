function component() {
  let element = document.createElement('div');
  element.innerHTML = ['Hello', 'advanced', 'heatmap'].join(' ');
  return element;
}

document.body.appendChild(component());
