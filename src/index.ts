type Exp = Var | Fn | Ap

type Var = {
  name: string
}

type Fn = {
  var: string
  body: Exp
}

type Ap = {
  target: Exp
  arg: Exp
}

type Value = {
  fnValue: Fn
  env: Env
}

type Env = Map<string, Value>

function isVar (exp: Exp): exp is Var {
  return (exp as Var).name !== undefined
}

function isFn (exp: Exp): exp is Fn {
  return (exp as Fn).var !== undefined && (exp as Fn).body !== undefined
}

function isAp (exp: Exp): exp is Ap {
  return (exp as Ap).target !== undefined && (exp as Ap).arg !== undefined
}
function findValue (name: string, env: Env) {
  return env.get(name)
}

function extend (env: Env, name: string, val: Value) {
  const newEnv: Env = new Map()
  for (const [n, v] of env) {
    newEnv.set(n, v)
  }
  newEnv.set(name, val)
  return newEnv
}

function evaluate (exp: Exp, env: Env): Value {
  if (isVar(exp)) return evaluate_Var(exp as Var, env)
  else if (isFn(exp)) return evaluate_Fn(exp as Fn, env)
  else if (isAp(exp)) return evaluate_Ap(exp as Ap, env)
  throw new Error("Unsupported exp")
}

function evaluate_Var (vari: Var, env: Env): Value {
  const value = findValue(vari.name, env)
  if (value === undefined)
    throw `undefined variable ${vari.name}`
  return value
}

function evaluate_Fn (fn: Fn, env: Env): Value {
  // let newBody = fn.body
  // try {
  //   newBody = evaluate(fn.body, env)
  // } catch (error) {
  //   newBody = fn.body
  // }
  // return {var: fn.var, body: newBody}
  return {fnValue: fn, env: env}
}

function apply (target: Value, arg: Value, env: Env): Value {
  return evaluate(target.fnValue.body, extend(env, target.fnValue.var, arg))
}

function evaluate_Ap (Ap: Ap, env: Env): Value {
  const taget = evaluate(Ap.target, env)
  const arg = evaluate(Ap.arg, env)
  return apply(taget, arg, env)
}

{
  // ((lambda (t) (lambda (f) t)) (lambda (x) x))
  // =>
  // (lambda (f) (lambda (x) x))
  const env: Env = new Map()
  console.dir(
    evaluate(
    {target: {var: "t", body: {var: "f", body: {name: "t"}}} , arg: {var: "x", body: {name: "x"}}},
    env
    ),
    {depth: null}
  )
}

{
  // ((lambda (t) (lambda (t) t)) (lambda (x) x))
  // =>
  // (lambda (t) t)
  const env: Env = new Map()
  console.dir(
    evaluate(
      {target: {var: "t", body: {var: "t", body: {name: "t"}}} , arg: {var: "x", body: {name: "x"}}},
      env
    ),
    {depth: null}
  )
}

{
  // ((lambda (t) (t (lambda (t) t))) (lambda (x) x))
  // =>
  // ((lambda (x) x) (lambda (t) t))
  // =>
  // (lambda (t) t)

  const env: Env = new Map()
  console.dir(
    evaluate(
      {target: {var: "t", body: {target: {name: "t"}, arg: {var: "t", body: {name: "t"}}}} , arg: {var: "x", body: {name: "x"}}},
      env
    ),
    {depth: null}
  )
}