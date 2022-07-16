import { Parser } from "../parser"
import * as Exps from "../exps"
import * as Format from "../format"
import { alphaConvertion, stepBetaReduction } from "../reduction"

const parser = new Parser()

{
  // (lambda (x) x)
  const exp = parser.parseExp("(lambda (x y) (x y x))")
  console.log(Format.format(alphaConvertion(exp as Exps.Fn)))
}

{
  // ((lambda (x) x)(lambda (x) x))
  const exp = parser.parseExp("((lambda (x) x)(lambda (x) x))")
  console.log(Format.format(stepBetaReduction(exp as Exps.Ap)))
}

{
  // ((lambda (t) (lambda (f) t)) (lambda (x) x))
  // => (lambda (f) (lambda (x) x))
  const exp = parser.parseExp("((lambda (t) (lambda (f) t)) (lambda (x) x))")
  console.log(Format.format(stepBetaReduction(exp as Exps.Ap)))
}

{
  // ((lambda (t) (t (lambda (t) t))) (lambda (x) x))
  //
  const exp = parser.parseExp("((lambda (t) (t (lambda (t) t))) (lambda (x) x))")
  console.log(Format.format(stepBetaReduction(stepBetaReduction(exp as Exps.Ap) as Exps.Ap)))
}
