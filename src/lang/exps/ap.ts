import {Exp} from "../exp"

export type Ap = {
  kind: "Ap"
  rator: Exp
  rand: Exp
}
