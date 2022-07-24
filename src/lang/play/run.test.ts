import {run} from "../run"

const code = `
((lambda (x y) x)(lambda (x) x)(lambda (x) (x x)))
`

run(code)
