import { Exp } from "./exp"
import * as Exps from "./exps"
import { freeVar } from "./fv-bv"
import * as Format from "./format"

function isRedex(exp: Exp): boolean {
  return exp.kind === "Ap" && exp.rator.kind === "Fn"
}

function containRedex(exp: Exp): boolean {
  if (isRedex(exp)) return true
  switch(exp.kind) {
    case "Var": return false
    case "Fn": return containRedex(exp.body)
    case "Ap": return containRedex(exp.rand) || containRedex(exp.rator)
  }
}

export function reduction(exp: Exp): Exp {
  while(containRedex(exp)) {
    exp = leftmostReduction(exp)
    console.log(Format.format(exp))
  }
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
      return {kind: "Ap", rator: leftmostReduction(exp.rator), rand: leftmostReduction(exp.rand)}
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
        queue.push(p.rator, p.rand)
        break
      }
    }
  }

  return newFn
}

function stepBetaReduction(ap: Exps.Ap): Exp {
  const fn = alphaConvertion(ap.rator as Exps.Fn)
  const test = (exp: Exp) => {return exp.kind === "Var" && exp.name === "_"}

  if (test(fn.body)) {
    fn.body = ap.rand
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
          p.body = ap.rand
        else
          queue.push(p.body)
        break
      }

      case "Ap": {
        if (test(p.rator))
          p.rator = ap.rand
        else
          queue.push(p.rator)

        if (test(p.rand))
          p.rand = ap.rand
        else
          queue.push(p.rand)
      }
    }
  }

  return fn.body
}
