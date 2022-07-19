import {Exp} from "../exp"

export type Define = {
  kind: "Define",
  id: string,
  exp: Exp
}
