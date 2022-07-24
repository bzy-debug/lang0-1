import {Value} from "./value"
import {evaluate} from "./evaluate"
import {Exp} from "./exp"
import {extend, Env} from "./env"

function add_(name: string): string {
  return name + "_"
}

export function newName(usedName: Set<string>, name: string): string {
  if (usedName.has(name))
    return newName(usedName, add_(name))
  else
    return name
}

function readBack(usedName: Set<string>, v: Value): Exp {
  switch (v.kind) {
    case "Closure": {
      const n = v.name.name
      const n_ = newName(usedName, n)
      const neutral_n_: Value = { kind: "Neutral", nkind: "Nvar", name: n_ }
      return {
        kind: "Fn",
        name: { kind: "Var", name: n_ },
        body: readBack(new Set([...usedName, n]),
                       evaluate(v.body, extend(v.env, n, neutral_n_)))
      }
    }
    case "Neutral": {
      switch (v.nkind) {
        case "Nvar": return {kind: "Var", name: v.name}
        case "Nap": return {kind: "Ap",
                            rator: readBack(usedName, v.rator),
                            rand: readBack(usedName, v.rand)}
      }
    }
  }
}

export function normalization (env: Env, exp: Exp): Exp {
  return readBack(new Set(env.keys()), evaluate(exp, env))
}
