import { Parser } from "../parser"
import * as Exps from "../exps"
import { reduction } from "../reduction"

const parser = new Parser()

console.log("Test #1")
let exp = parser.parseExp("((lambda (z) z)(lambda (y) (y y))(lambda (x) (x a)))")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #2")
exp = parser.parseExp("((lambda (z) z)(lambda (z) (z z))(lambda (z) (z y)))")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #3")
exp = parser.parseExp("(((lambda (x y) (x y y)) (lambda (a) a)) b)")
reduction(exp as Exps.Ap)
console.log()

console.log("Test #4")
exp = parser.parseExp("((lambda (x y) (x y y)) (lambda (y) (y)) y)")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #5")
exp = parser.parseExp("((lambda (x) (x x)) (lambda (y) (y x)) z)")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #6")
exp = parser.parseExp("((lambda (x) ((lambda (y) (x y)) y)) z)")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #7")
exp = parser.parseExp("(((lambda (x) (x x)) (lambda (y) (y))) (lambda (y) y))")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #8")
exp = parser.parseExp("(((lambda(x y) (x y))(lambda (y) y)) w)")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #9")
exp = parser.parseExp("((lambda (x) y)((lambda (x) (x x)) (lambda (x) (x x))))")
reduction(exp as Exps.Ap)
console.log("")

console.log("Test #10")
exp = parser.parseExp("((lambda (x y) x)(lambda (x) x)(lambda (x) (x x)))")
reduction(exp as Exps.Ap)
console.log("")
