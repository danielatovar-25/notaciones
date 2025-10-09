function verificarPalindromo() {
  const frase = document.getElementById('frase').value;
  const procesada = frase.trim().replace(/ /g, '').toLowerCase();
  const invertida = procesada.split('').reverse().join('');
  const esPalindromo = procesada === invertida;

  // Mostrar el resultado en un alert de JS
  if (esPalindromo) {
    alert('¡Es palíndromo!');
  } else {
    alert('No es palíndromo.');
  }
}