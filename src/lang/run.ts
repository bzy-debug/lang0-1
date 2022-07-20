import {Parser} from "./parser"
import {Env} from "./env"
import {execute} from "./execute"

const parser = new Parser()

export function run(code: string) {
  let env: Env = new Map()
  const stmts = parser.parseStmt(code)
  for (const stmt of stmts) {
    env = execute(stmt, env)
  }
}
