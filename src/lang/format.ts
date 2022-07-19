import * as Exps from "./exps"
import {Exp} from "./exp"

export function format(exp: Exp) {
  switch (exp.kind) {
    case 'Var': return formatVar(exp)
    case 'Ap': return formatAp(exp)
    case 'Fn': return formatFn(exp)
  }
}

function formatVar(v: Exps.Var): string {
  return v.name
}

function formatAp(ap: Exps.Ap): string {
  return `(${format(ap.rator)} ${format(ap.rand)})`
}

function formatFn(fn: Exps.Fn): string {
  return `(lambda (${format(fn.name)}) ${format(fn.body)})`
}
