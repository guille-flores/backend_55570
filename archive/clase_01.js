const arreglo = new Array(1, 2, 3, 4, 5, 6, 7)
/* 
The splice() method of Array instances changes the contents of an array by
removing or replacing existing elements and/or adding new elements

splice(Start Index, How Many Items to delete from Start Index, Value to Add/Replace)
*/
arreglo.splice(arreglo.length-1, 1, 23)
console.log(arreglo);

class Calculadora{
    calculator(a, b, op) {
        switch (op){
            case '/':
                return (b==0) ? new Error("division entre 0") : a/b;
            default:
                return "operacion no permitida"
        }
    }
}

resultado1 = new Calculadora
resultado = resultado1.calculator(10, 5, '/')
console.log(resultado)