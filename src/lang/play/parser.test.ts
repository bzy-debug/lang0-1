import { Parser } from "../parser"
import { evaluate } from "../evaluate"
import * as Format from "../format"

const parser = new Parser()

{
  // ((lambda (t) (lambda (f) t)) (lambda (x) x))
  // =>
  // (lambda (f) (lambda (x) x))
  
  const env = new Map()
  const exp = parser.parseExp("((lambda (t f) t) (lambda (x) x))")
  const value = evaluate(exp, env)

  console.log(Format.formatValue(value))
}

{
  // ((lambda (t) (lambda (t) t)) (lambda (x) x))
  // =>
  // (lambda (t) t)

  const env = new Map()
  const exp = parser.parseExp(`
    ((lambda (t) (lambda (t) t)) (lambda (x) x))
  `)
  const value = evaluate(exp, env)

  console.log(Format.formatValue(value))
}

{
  // ((lambda (t) (t (lambda (t) t))) (lambda (x) x))
  // =>
  // ((lambda (x) x) (lambda (t) t))
  // =>
  // (lambda (t) t)

  const env = new Map()
  const exp = parser.parseExp(
    "((lambda (t) (t (lambda (t) t))) (lambda (x) x))"
  )
  const value = evaluate(exp, env)

  console.log(Format.formatValue(value))
}

