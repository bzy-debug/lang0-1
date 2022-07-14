import * as Exps from "./exps"
import {Exp} from "./exp"
import {Value} from "./value"

export function formatValue(val: Value):string {
  return formatFn(val.fnValue)
}

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
  return `(${format(ap.target)} ${format(ap.arg)})`
}

function formatFn(fn: Exps.Fn): string {
  return `(lambda (${format(fn.name)}) ${format(fn.body)})`
}
