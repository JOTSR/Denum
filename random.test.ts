import { random, randomInt, randomArray, randomIntArray } from './random.ts'

Deno.test({
    name: 'It should produce a random number',
    fn: () => {
        const min =  Math.round(Math.random() * 1e10) / 1e5
        const max = Math.round(Math.random() * 1e10) / 1e5 + min
        const randoms = new Array(5).fill(1).map(_ => random(min, max))
        for(const rand of randoms) {
            if(rand < min || rand > max) throw new Error(`${rand} is out of range [${min}, ${max}]`)
        }
    }
})

Deno.test({
    name: 'It should produce a random integer',
    fn: () => {
        //Numbers
        const min =  Math.round(Math.random() * 1e10) / 1e5
        const max = Math.round(Math.random() * 1e10) / 1e5 + min
        const randoms = new Array(5).fill(1).map(_ => randomInt(min, max))
        for(const rand of randoms) {
            if(rand < min || rand > max) throw new Error(`${rand} is out of range [${min}, ${max}]`)
        }

        //BigInt
        const [bigMin, bigMax] = [BigInt(Math.round(min)), BigInt(Math.round(max)) + 1n]
        const bigRandoms = new Array(5).fill(1n).map(_ => randomInt(min, max))
        for(const bigRand of bigRandoms) {
            if(bigRand < bigMin || bigRand > bigMax) throw new Error(`${bigRand} is out of range [${bigMin}, ${bigMax}]`)
        }
    }
})

Deno.test({
    name: 'It should produce an array random numbers',
    fn: () => {
        const min =  Math.round(Math.random() * 1e10) / 1e5
        const max = Math.round(Math.random() * 1e10) / 1e5 + min
        const length = Math.round(Math.random() * 100)
        const randoms = randomArray(min, max, length)
        for(const rand of randoms) {
            if(rand < min || rand > max) throw new Error(`${rand} is out of range [${min}, ${max}]`)
        }
        if(randoms.length != length) throw new Error(`Does not match length ${length} ${randoms.length} `)
    }
})

Deno.test({
    name: 'It should produce an array random integers',
    fn: () => {
        //Numbers
        const min =  Math.round(Math.random() * 1e10) / 1e5
        const max = Math.round(Math.random() * 1e10) / 1e5 + min
        const length = Math.round(Math.random() * 100)
        const randoms = randomIntArray(min, max, length)
        for(const rand of randoms) {
            if(rand < min || rand > max) throw new Error(`${rand} is out of range [${min}, ${max}]`)
        }
        if(randoms.length != length) throw new Error(`Does not match length ${length} ${randoms.length} `)

        //BigInt
        const [bigMin, bigMax] = [BigInt(Math.round(min)), BigInt(Math.round(max)) + 1n]
        const bigRandoms = randomIntArray(min, max, length)
        for(const bigRand of bigRandoms) {
            if(bigRand < bigMin || bigRand > bigMax) throw new Error(`${bigRand} is out of range [${bigMin}, ${bigMax}]`)
        }
        if(randoms.length != length) throw new Error(`Does not match length ${length} ${randoms.length} `)
    }
})