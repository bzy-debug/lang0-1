import { Exp } from "./exp"
import * as Exps from "./exps"
import { freeVar } from "./fv-bv"

function isRedex(exp: Exp): boolean {
  return exp.kind === "Ap" && exp.arg.kind === "Fn"
}

function containRedex(exp: Exp): boolean {
  if (isRedex(exp)) return true
  switch(exp.kind) {
    case "Var": return false
    case "Fn": return containRedex(exp.body)
    case "Ap": return containRedex(exp.arg) || containRedex(exp.target)
  }
}

export function reduction(exp: Exp): Exp {
  while(containRedex(exp))
    exp = leftmostReduction(exp)
  return exp
}

function leftmostReduction(exp: Exp): Exp{
  if (isRedex(exp)) return stepBetaReduction(exp as Exps.Ap)
  switch (exp.kind) {
    case "Var":
      return exp
    case "Fn":
      return {kind: "Fn", name: exp.name, body: leftmostReduction(exp.body)}
    case "Ap":
      return {kind: "Ap", target: leftmostReduction(exp.target), arg: leftmostReduction(exp.arg)}
  }
}

// [a-z] => _
function alphaConvertion(fn: Exps.Fn): Exps.Fn {
  const newFn: Exps.Fn = structuredClone(fn)
  const bound = newFn.name.name.slice()
  newFn.name.name = "_"

  const queue: Array<Exp> = new Array()
  queue.push(newFn.body)
  while (queue.length > 0) {
    const p = queue.shift()
    if (p === undefined) break
    switch (p.kind) {
      case "Var" : {
        if (p.name === bound) p.name = "_"
        break
      }
      case "Fn" : {
        if (freeVar(p).has(bound)) queue.push(p.body)
        break
      }
      case "Ap" : {
        queue.push(p.target, p.arg)
        break
      }
    }
  }

  return newFn
}

function stepBetaReduction(ap: Exps.Ap): Exp {
  const fn = alphaConvertion(ap.target as Exps.Fn)
  const test = (exp: Exp) => {return exp.kind === "Var" && exp.name === "_"}

  if (test(fn.body)) {
    fn.body = ap.arg
    return fn.body
  }

  const queue: Array<Exp> = new Array()
  queue.push(fn.body)
  while (queue.length > 0) {
    const p = queue.shift()
    if (p === undefined) break
    switch (p.kind) {
      case "Var": break

      case "Fn": {
        if (test(p.body))
          p.body = ap.arg
        else
          queue.push(p.body)
        break
      }

      case "Ap": {
        if (test(p.target))
          p.target = ap.arg
        else
          queue.push(p.target)

        if (test(p.arg))
          p.arg = ap.arg
        else
          queue.push(p.arg)
      }
    }
  }

  return fn.body
}
