import {Parser} from "./parser"
import {Env} from "./env"
import {execute} from "./execute"

export function run(code: string) {
  const parser = new Parser()
  let env: Env = new Map()
  const stmts = parser.parseStmt(code)
  for (const stmt of stmts) {
    env = execute(stmt, env)
  }
}
