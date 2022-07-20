import {Stmt} from "./stmt"
import * as Stmts from "./stmts"
import {Env, extend} from "./env"
import {evaluate} from "./evaluate"

export function execute(stmt: Stmt, env: Env): Env {
  switch (stmt.kind) {
    case "Define": return executeDef(stmt, env)
    case "Expression": return executeExp(stmt, env)
  }
}

function executeDef(def: Stmts.Define, env: Env): Env {
  return extend(env, def.id, evaluate(def.exp, env))
}

function executeExp(exp: Stmts.Expression, env: Env): Env {
  evaluate(exp.exp, env)
  return env
}
