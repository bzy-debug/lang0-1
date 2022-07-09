type Exp = Var | Fn | Ap

type Var = string

type Fn = {
  var: Var
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
  return typeof exp === "string"
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
  if (isVar(exp)) return evaluateVar(exp as Var, env)
  else if (isFn(exp)) return evaluateFn(exp as Fn, env)
  else if (isAp(exp)) return evaluateAp(exp as Ap, env)
  throw new Error("Unsupported exp")
}

function evaluateVar (variable: Var, env: Env): Value {
  const value = findValue(variable, env)
  if (value === undefined)
    throw new Error(`undefined variable ${variable}`)
  return value
}

function evaluateFn (fn: Fn, env: Env): Value {
  return {fnValue: fn, env: env}
}

function apply (target: Value, arg: Value, env: Env): Value {
  return evaluate(target.fnValue.body, extend(env, target.fnValue.var, arg))
}

function evaluateAp (Ap: Ap, env: Env): Value {
  const taget = evaluate(Ap.target, env)
  const arg = evaluate(Ap.arg, env)
  return apply(taget, arg, env)
}


function union(set1: Set<Var>, set2: Set<Var>): Set<Var> {
  const newSet: Set<Var> = new Set()

  for (let item of set1)
    newSet.add(item)

  for (let item of set2)
    newSet.add(item)

  return newSet
}

function minus(set1: Set<Var>, set2: Set<Var>): Set<Var> {
  const newSet: Set<Var> = new Set()

  for (let item of set1)
    newSet.add(item)

  for (let item of set2)
    newSet.delete(item)

  return newSet
}

// FV(x) = {x}
// FV(MN) = FV(M) union FV(N)
// FV(lambda x [M]) = FV(M) - {x}

function freeVar(exp: Exp): Set<Var> {
  if (isVar(exp)) {
    let t = exp as Var
    return new Set(t)
  }
  else if (isAp(exp)) {
    let ap = exp as Ap
    return union(freeVar(ap.target), freeVar(ap.arg))
  }
  else if (isFn(exp)) {
    let fn = exp as Fn
    return minus(freeVar(fn.body), freeVar(fn.var))
  }
  throw new Error("Unsupported exp")
}

// BV(x) = {empty}
// BV(MN) = BV(M) union BV(N)
// BV(lambda x [M]) = BV(M) union {x}

function boundVar(exp: Exp): Set<Var> {
  if (isVar(exp)) {
    return new Set()
  }
  else if (isAp(exp)) {
    let ap = exp as Ap
    return union(boundVar(ap.target), boundVar(ap.arg))
  }
  else if (isFn(exp)) {
    let fn = exp as Fn
    return union(boundVar(fn.body), new Set(fn.var))
  }
  throw new Error("Unsupported exp")
}

{
  // ((lambda (t) (lambda (f) t)) (lambda (x) x))
  // =>
  // (lambda (f) (lambda (x) x))
  const env: Env = new Map()
  console.dir(
    evaluate(
    {target: {var: "t", body: {var: "f", body: "t"}} , arg: {var: "x", body: "x"}},
    env
    ),
    {depth: null}
  )
  console.log(freeVar({target: {var: "t", body: {var: "f", body: "t"}} , arg: {var: "x", body: "x"}}))
  console.log(boundVar({target: {var: "t", body: {var: "f", body: "t"}} , arg: {var: "x", body: "x"}}))
}

{
  // ((lambda (t) (lambda (t) t)) (lambda (x) x))
  // =>
  // (lambda (t) t)
  const env: Env = new Map()
  console.dir(
    evaluate(
      {target: {var: "t", body: {var: "t", body: "t"}} , arg: {var: "x", body: "x"}},
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
      {target: {var: "t", body: {target: "t", arg: {var: "t", body: "t"}}} , arg: {var: "x", body: "x"} },
      env
    ),
    {depth: null}
  )
}
