import {Var, Ap, Fn} from "./exps"
import {Exp} from "./exp"
import {Env, extend} from "./env"
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
  const value = env.get(v.name)
  if (value === undefined) {
    return {kind: "Neutral", nkind: "Nvar", name: v.name}
    // console.log(env)
    // throw new Error(`undefined variable ${v.name}`)
  }
  return value
}

function evaluateFn(fn: Fn, env: Env): Value {
  return { kind: "Closure", env: env, name: fn.name, body: fn.body }
}

function apply(rator: Value, rand: Value): Value {
  switch (rator.kind) {
    case "Closure" : return evaluate(
                              rator.body,
                              extend(rator.env, rator.name.name, rand))
    case "Neutral" : return { kind: "Neutral", nkind: "Nap", rator: rator, rand: rand }
  }
}

function evaluateAp(Ap: Ap, env: Env): Value {
  const rator = evaluate(Ap.rator, env)
  const rand = evaluate(Ap.rand, env)
  return apply(rator, rand)
}
