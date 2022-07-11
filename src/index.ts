type Exp = Var | Fn | Ap

type Var = {
  kind: "Var"
  name: string
}

type Fn = {
  kind: "Fn"
  name: Var
  body: Exp
}

type Ap = {
  kind: "Ap"
  target: Exp
  arg: Exp
}

type Value = {
  fnValue: Fn
  env: Env
}

type Env = Map<string, Value>

function findValue(name: string, env: Env) {
  return env.get(name)
}

function extend(env: Env, name: string, val: Value) {
  const newEnv: Env = new Map()
  for (const [k, v] of env) {
    newEnv.set(k, v)
  }
  newEnv.set(name, val)
  return newEnv
}

function evaluate(exp: Exp, env: Env): Value {
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

function union(set1: Set<string>, set2: Set<string>): Set<string> {
  const newSet: Set<string> = new Set()

  for (const item of set1) newSet.add(item)

  for (const item of set2) newSet.add(item)

  return newSet
}

function minus(set1: Set<string>, set2: Set<string>): Set<string> {
  const newSet: Set<string> = new Set()

  for (const item of set1) newSet.add(item)

  for (const item of set2) newSet.delete(item)

  return newSet
}

// FV(x) = {x}
// FV(MN) = FV(M) union FV(N)
// FV(lambda x [M]) = FV(M) - {x}

function freeVar(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var":
      return new Set(exp.name)
    case "Ap":
      return union(freeVar(exp.target), freeVar(exp.arg))
    case "Fn":
      return minus(freeVar(exp.body), freeVar(exp.name))
  }
}

// BV(x) = {empty}
// BV(MN) = BV(M) union BV(N)
// BV(lambda x [M]) = BV(M) union {x}

function boundVar(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var":
      return new Set()
    case "Ap":
      return union(boundVar(exp.target), boundVar(exp.arg))
    case "Fn":
      return union(boundVar(exp.body), boundVar(exp.name))
  }
}
