import {Exp} from "../exp"

export type Ap = {
  kind: "Ap"
  target: Exp
  arg: Exp
}
