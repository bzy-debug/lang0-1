import { match, matchList, matchSymbol } from "@cicada-lang/sexp/lib/match"
import { Parser as SexpParser } from "@cicada-lang/sexp/lib/parser"
import { cons, v } from "@cicada-lang/sexp/lib/pattern-exp"
import { Sexp } from "@cicada-lang/sexp/lib/sexp"
import { Exp } from "../exp"
import { Stmt } from "../stmt"

export class Parser extends SexpParser {
  constructor() {
    super({
      quotes: [],
      parentheses: [{ start: "(", end: ")" }],
      comments: [";"],
    })
  }

  parseExp(text: string): Exp {
    const sexp = this.parseSexp(text)
    return matchExp(sexp)
  }

  parseStmt(text: string): Array<Stmt> {
    return this.parseSexps(text).map(matchStmt)

  }
}

function matchStmt(sexp: Sexp): Stmt {
  return match<Stmt>(sexp, [
    [
      ["define", v("name"), v("exp")],
      ({ name, exp }) => {
        return {kind: "Define", id: matchSymbol(name), exp: matchExp(exp)}
      },
    ],

    [v("exp"), ({ exp }) => {
        return {kind: "Expression", exp: matchExp(exp)}
      },
    ]
  ])
}


function matchExp(sexp: Sexp): Exp {
  return match<Exp>(sexp, [
    [
      ["lambda", v("names"), v("exp")],
      ({ names, exp }) => {
        let fn = matchExp(exp)
        for (const name of [...matchList(names, matchSymbol)].reverse()) {
          fn = {kind:"Fn", name: {kind: "Var", name: name}, body: fn}
        }

        return fn
      },
    ],

    [
      cons(v("target"), v("args")),
      ({ target: rator, args: rand }) => {
        let result = matchExp(rator)
        for (const arg of matchList(rand, matchExp)) {
          result = {kind:"Ap", rator: result, rand: arg}
        }

        return result
      },
    ],

    [v("name"), ({ name }) => {
      return {kind: "Var", name: matchSymbol(name)}
    }],
  ])
}
