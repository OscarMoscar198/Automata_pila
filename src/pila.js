function algoritmoAnalisis(declaration) {
    let stack = generarStack(declaration);
    let stackContent = [];
    let apuntador = 0;
  
    const popInfo = (X) => {
      stackContent.push(
        `Pop: ${X}, stackContent: ${[...stack]}, Cadena : ${declaration.slice(
          apuntador
        )}`
      );
    };
  
    while (stack.length > 0) {
      const X = stack.pop();
  
      if (!X) {
        break;
      }
  
      const a = declaration[apuntador];
  
      if (X === a) {
        apuntador++;
      } else if (obtenerNT(X)) {
        const production = obtenerProduccion(X, a);
  
        if (production) {
          stackContent.push(
            `Push: ${X}, stackContent: ${[
              ...stack,
            ]}, Cadena : ${declaration.slice(apuntador)}`
          );
          if (production[0] !== "ε") {
            for (let i = production.length - 1; i >= 0; i--) {
              stack.push(production[i]);
            }
          }
        } else {
          stackContent.push(`Error: ${X} no tiene produccion.`);
          return { result: false, stackContent };
        }
      } else {
        popInfo(X);
        return { result: false, stackContent };
      }
    }
    return { result: apuntador === declaration.length, stackContent };
  }
  
  function generarStack(declaration) {
    if (declaration.includes("func")) {
      return ["FUNC"];
    } else if (declaration.includes("if")) {
      return ["IF"];
    } else if (declaration.includes("for")) {
      return ["FOR"];
    } else {
      return ["VAR"];
    }
  }
  
  function obtenerProduccion(noTerminal, next) {
    switch (noTerminal) {
      //declarar variable
      case "VAR":
        return ["L1", "VR1"];
      case "VR1":
        return ["SV", "VR4"];
      case "VR2":
        return ["SVV", "VR3"];
      case "VR3":
        return ["L1", "SVV"];
  
      case "VR4":
        return /["]/.test(next) ? ["VR2"] : /[0-9]/.test(next) ? ["D"] : ["BOL"];
      //funcion
      case "FUNC":
        return ["LOG2", "FN1"];
      case "FN1":
        return ["L1", "FN2"];
      case "FN2":
        return ["P", "FN3"];
      case "FN3":
        return ["L1", "FN4"];
      case "FN4":
        return ["SC", "FN5"];
      case "FN5":
        return ["L1", "FN6"];
      case "FN6":
        return ["P2", "FN7"];
      case "FN7":
        return ["T", "FN8"];
      case "FN8":
        return ["C", "FN9"];
      case "FN9":
        return ["VAR", "C2"];
  
      //declaracion de for
      case "FOR":
        return ["LOG3", "FR1"];
      case "FR1":
        return ["P", "FR2"];
      case "FR2":
        return ["T", "FR3"];
      case "FR3":
        return ["L1", "FR4"];
      case "FR4":
        return ["S", "FR5"];
      case "FR5":
        return ["L", "FR6"];
      case "FR6":
        return ["SC", "FR7"];
      case "FR7":
        return ["L1", "FR8"];
      case "FR8":
        return ["SF", "FR9"];
      case "FR9":
        return ["P2", "FR10"];
      case "FR10":
        return ["C", "FR11"];
      case "FR11":
        return ["VAR", "C2"];
  
      //declaracion de if
      case "IF":
        return ["LOG", "O1"];
      case "O1":
        return ["P", "O2"];
      case "O2":
        return ["L1", "O3"];
      case "O3":
        return ["S", "O4"];
      case "O4":
        return ["L", "O5"];
      case "O5":
        return ["P2", "O6"];
      case "O6":
        return ["C", "O7"];
      case "O7":
        return ["VAR", "C2"];
  
      //Gramatica General
      case "L":
        return /[a-zA-Z]/.test(next) ? ["XL", "RL"] : ["XD", "RD"];
      case "L1":
        return ["XL", "RLL"];
      case "RL":
        return /[a-zA-Z]/.test(next) ? ["XL", "RL"] : ["ε"];
      case "RLL":
        return /[a-zA-Z]/.test(next) ? ["XL", "RLL"] : ["ε"];
      case "D":
        return ["XD", "RD"];
      case "RD":
        return /[0-9]/.test(next) ? ["XD", "RD"] : ["ε"];
  
      case "XL":
        return /[a-zA-Z]/.test(next) ? [next] : [];
      case "XD":
        return /[0-9]/.test(next) ? [next] : [];
      case "P":
        return ["("];
      case "P2":
        return [")"];
      case "C":
        return ["{"];
      case "C2":
        return ["}"];
  
      case "S":
        return /[=]/.test(next)
          ? ["=", "="]
          : /[!=]/.test(next)
          ? ["!="]
          : /[<]/.test(next)
          ? ["<"]
          : /[>]/.test(next)
          ? [">"]
          : /[>=]/.test(next)
          ? [">="]
          : ["<="];
      case "SV":
        return ["="];
      case "SF":
        return /['+']/.test(next) ? ["+", "+"] : ["-", "-"];
      case "SC":
        return [","];
      case "SVV":
        return ['"'];
      case "T":
        return /['i']/.test(next)
          ? ["i", "n", "t"]
          : /['f']/.test(next)
          ? ["f", "l", "o", "a", "t"]
          : /['s']/.test(next)
          ? ["s", "t", "r", "i", "n", "g"]
          : ["b", "o", "o", "l"];
  
      case "LOG2":
        return ["f", "u", "n", "c"];
      case "LOG":
        return ["i", "f"];
      case "LOG3":
        return ["f", "o", "r"];
  
      case "BOL":
        return /[t]/.test(next)
          ? ["t", "r", "u", "e"]
          : ["f", "a", "l", "s", "e"];
    }
  }
  
  function obtenerNT(simbolo) {
    return /[A-Z]/.test(simbolo);
  }
  
  function validateVariableDeclaration(input) {
    const declarationWithoutSpaces = input.replace(/\s/g, "");
    const { result, stackContent } = algoritmoAnalisis(declarationWithoutSpaces);
  
    console.log("Cadena: ", result);
    console.log("Pila:", stackContent);
  }
  
  const readline = require("readline");
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.question("Ingrese el bloque de codigo: ", (input) => {
    validateVariableDeclaration(input);
    rl.close();
  });

  export { algoritmoAnalisis, generarStack, obtenerProduccion, obtenerNT };