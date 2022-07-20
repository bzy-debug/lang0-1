import {Value} from "../value"

export type Neutral = Nvar | Nap

export type Nvar = {
  kind: "Neutral"
  nkind: "Nvar"
  name: string
}

export type Nap = {
  kind: "Neutral"
  nkind: "Nap"
  rator: Neutral
  rand: Value
}
