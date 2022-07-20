import {Value} from "./value"

export type Env = Map<string, Value>

export function extend(env: Env, name: string, val: Value) { 
  const newEnv: Env = new Map()
  for (const [k, v] of env) {
    newEnv.set(k, v)
  }
  newEnv.set(name, val)
  return newEnv
}
