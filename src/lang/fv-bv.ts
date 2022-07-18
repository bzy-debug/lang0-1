import {Exp} from "./exp"

function union(set1: Set<any>, set2: Set<any>): Set<any> {
  const newSet: Set<any> = new Set()

  for (const item of set1) newSet.add(item)

  for (const item of set2) newSet.add(item)

  return newSet
}

function minus(set1: Set<any>, set2: Set<any>): Set<any> {
  const newSet: Set<any> = new Set()

  for (const item of set1) newSet.add(item)

  for (const item of set2) newSet.delete(item)

  return newSet
}

// FV(x) = {x}
// FV(MN) = FV(M) union FV(N)
// FV(lambda (x) (M)) = FV(M) - {x}

export function freeVar(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var":
      return new Set(exp.name)
    case "Ap":
      return union(freeVar(exp.rator), freeVar(exp.rand))
    case "Fn":
      return minus(freeVar(exp.body), freeVar(exp.name))
  }
}

// BV(x) = {empty}
// BV(MN) = BV(M) union BV(N)
// BV(lambda (x) (M)) = BV(M) union {x}

export function boundVar(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var":
      return new Set()
    case "Ap":
      return union(boundVar(exp.rator), boundVar(exp.rand))
    case "Fn":
      return union(boundVar(exp.body), boundVar(exp.name))
  }
}
