// Valida que la expresión tenga solo números, operadores y paréntesis
const validate = /^[\d+\-*/()\s]+$/;

const btn = document.getElementById("generateTreeBtn"); 
const outputs = document.getElementById("outputs"); // Aquí se mostrarán las notaciones y el tiempo

// --- 1. Tokenizar expresión ---
function tokenizar(expression) {
  return expression
    .match(/\d+|[+\-*/()]|\s+/g) // separar números, operadores y paréntesis
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t !== " ");
}

// --- 2. Construir árbol de expresión ---
function construirArbol(tokens) {
  function parseExpr(tokens, minPrec = 0) {
    let node;

    if (tokens[0] === "(") {
      tokens.shift();
      node = parseExpr(tokens);
      if (tokens[0] !== ")") throw new Error("Paréntesis no balanceados");
      tokens.shift();
    } else {
      node = { tipo: "hoja", valor: tokens.shift() };
    }

    while (tokens.length) {
      let op = tokens[0];
      let prec = getPrecedencia(op);
      if (prec < minPrec) break;
      tokens.shift();
      let right = parseExpr(tokens, prec + 1);
      node = { tipo: "operador", valor: op, izquierda: node, derecha: right };
    }
    return node;
  }

  function getPrecedencia(op) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return -1;
  }

  let tokensCopy = tokens.slice();
  let arbol = parseExpr(tokensCopy);

  if (tokensCopy.length) throw new Error("Expresión inválida");
  return arbol;
}

// --- 3. Recorridos del árbol ---
function infija(node) {
  if (!node) return "";
  if (node.tipo === "hoja") return node.valor;
  return `(${infija(node.izquierda)} ${node.valor} ${infija(node.derecha)})`;
}
function prefija(node) {
  if (!node) return "";
  if (node.tipo === "hoja") return node.valor;
  return `${node.valor} ${prefija(node.izquierda)} ${prefija(node.derecha)}`;
}
function postfija(node) {
  if (!node) return "";
  if (node.tipo === "hoja") return node.valor;
  return `${postfija(node.izquierda)} ${postfija(node.derecha)} ${node.valor}`;
}

// --- 4. Evento principal ---
btn.addEventListener("click", () => {
  let expression = document.getElementById("expressionInput").value;

  if (!validate.test(expression)) {
    alert("La expresión contiene caracteres inválidos.");
    return;
  }

  try {
    let t0 = performance.now(); // inicio tiempo

    let tokens = tokenizar(expression);
    let arbol = construirArbol(tokens);

    let inf = infija(arbol);
    let pre = prefija(arbol);
    let post = postfija(arbol);

    let t1 = performance.now(); // fin tiempo
    let tiempo = (t1 - t0).toFixed(4);

    outputs.innerHTML = `
      <p><b>Infija:</b> ${inf}</p>
      <p><b>Prefija:</b> ${pre}</p>
      <p><b>Postfija:</b> ${post}</p>
      <p><b>Tiempo de ejecución:</b> ${tiempo} ms</p>
    `;
  } catch (e) {
    alert("Error: " + e.message);
  }
});
