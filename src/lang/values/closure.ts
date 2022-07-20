import {Exp} from "../exp"
import {Var} from "../exps"
import {Env} from "../env"

export type Closure = {
  kind: "Closure"
  env: Env
  name: Var
  body: Exp
}
