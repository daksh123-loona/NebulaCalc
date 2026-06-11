const disp = document.querySelector(".display");
const ops = ["+", "-", "*", "/"];

let expr = "";
let fresh = false;

function update() {
  disp.value = expr || "";
}

function press(val) {
  if (val === "AC") {
    expr = "";
    fresh = false;
    update();
    return;
  }

  if (val === "DEL") {
    expr = expr.slice(0, -1);
    update();
    return;
  }

  if (val === "%") {
    if (!expr) return;

    const num = parseFloat(expr);

    if (!isNaN(num)) {
      expr = String(num / 100);
      update();
    }
    return;
  }

  if (val === "=") {
    if (!expr) return;

    try {
      if (!/^[\d+\-*/.() ]+$/.test(expr)) throw new Error();

      let result = Function(`"use strict"; return (${expr})`)();

      if (!isFinite(result)) throw new Error();

      expr = parseFloat(result.toFixed(10)).toString();
      fresh = true;
      update();
    } catch {
      expr = "Error";
      update();

      setTimeout(() => {
        expr = "";
        update();
      }, 1200);
    }

    return;
  }

  const isOperator = ops.includes(val);
  const lastChar = expr.slice(-1);

  if (fresh && !isOperator) expr = "";

  fresh = false;

  if (isOperator) {
    if (expr === "" && val !== "-") return;

    if (ops.includes(lastChar)) expr = expr.slice(0, -1);
  }

  if (val === ".") {
    const parts = expr.split(/[+\-*/]/);

    if (parts[parts.length - 1].includes(".")) return;

    if (expr === "" || ops.includes(lastChar)) expr += "0";
  }

  expr += val;
  update();
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    press(button.dataset.val);
  });
});

document.addEventListener("keydown", (e) => {
  const keyMap = {
    Enter: "=",
    Escape: "AC",
    Backspace: "DEL",
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    ".": ".",
    "%": "%",
  };

  const key = keyMap[e.key] ?? (e.key >= "0" && e.key <= "9" ? e.key : null);

  if (key) {
    e.preventDefault();
    press(key);
  }
});
