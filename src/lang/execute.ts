import {Stmt} from "./stmt"
import * as Stmts from "./stmts"
import {Env, extend} from "./env"
import {evaluate} from "./evaluate"

export function execute(stmt: Stmt, env: Env): void {
  switch (stmt.kind) {
    case "Define": return executeDef(stmt, env)
    case "Expression": return executeExp(stmt, env)
  }
}

function executeDef(def: Stmts.Define, env: Env): void {
  extend(env, def.id, evaluate(def.exp, env))
}

function executeExp(exp: Stmts.Expression, env: Env): void {
  evaluate(exp.exp, env)
}
