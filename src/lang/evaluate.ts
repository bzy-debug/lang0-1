import {Var, Ap, Fn} from "./exps"
import {Exp} from "./exp"
import {Env, findValue, extend} from "./env"
import {Value} from "./value"

export function evaluate(exp: Exp, env: Env): Value {
  switch (exp.kind) {
    case "Var":
      return evaluateVar(exp, env)
    case "Fn":
      return evaluateFn(exp, env)
    case "Ap":
      return evaluateAp(exp, env)
  }
}

function evaluateVar(v: Var, env: Env): Value {
  const value = findValue(v.name, env)
  if (value === undefined) throw new Error(`undefined variable ${v.name}`)
  return value
}

// (lambda (x) ((lambda(y) y) M)

function evaluateFn(fn: Fn, env: Env): Value {
  return { fnValue: fn, env: env }
}

function apply(target: Value, arg: Value, env: Env): Value {
  return evaluate(
    target.fnValue.body,
    extend(env, target.fnValue.name.name, arg)
  )
}

function evaluateAp(Ap: Ap, env: Env): Value {
  const taget = evaluate(Ap.target, env)
  const arg = evaluate(Ap.arg, env)
  return apply(taget, arg, env)
}
