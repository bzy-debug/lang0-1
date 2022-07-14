import {Exp} from "../exp"
import {Var} from "./var"

export type Fn = {
  kind: "Fn"
  name: Var
  body: Exp
}
