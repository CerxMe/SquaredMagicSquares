'use strict'
const seedrandom = require('seedrandom')
var cliff = require('cliff')
var colors = require('colors')

Array.prototype.chunk = function (n) {
  if (!this.length) {
    return []
  }
  return [ this.slice(0, n) ].concat(this.slice(n).chunk(n))
}

let counter = 0
async function theydidthemaths () {
  await console.log('\n\n')

  counter++
  let run = counter
  let seed = Math.random()
  let rng = seedrandom(seed)
  let contestants = []

  for (let i = 0; i < 9; i++) {
    let seededNumber = Math.floor((rng() * (50 - 1 + 1)) + 1)
    if (contestants.includes(seededNumber)) {
      i--
    } else {
      contestants.push(seededNumber)
    }
  }

  const squared = await contestants.map(num => Math.pow(num, 2))
  let grid = await squared.chunk(3)
  let displaygrid = await contestants.chunk(3)

  //    [a][b][c]    [0][0]  [0][1]  [0][2]
  //    [d][e][f]    [1][0]  [1][1]  [1][2]
  //    [g][h][i]    [2][0]  [2][1]  [2][2]

  let sumRow1 = grid[0][0] + grid[0][1] + grid[0][2]
  let sumRow2 = grid[1][0] + grid[1][1] + grid[1][2]
  let sumRow3 = grid[2][0] + grid[2][1] + grid[2][2]

  let sumCol1 = grid[0][0] + grid[1][0] + grid[2][0]
  let sumCol2 = grid[0][1] + grid[1][1] + grid[2][1]
  let sumCol3 = grid[0][2] + grid[1][2] + grid[2][2]

  let sumDia1 = grid[0][0] + grid[1][1] + grid[2][2]
  let sumDia2 = grid[2][0] + grid[1][1] + grid[0][2]

  let equalizer = [sumRow1, sumRow2, sumRow3, sumCol1, sumRow2, sumCol3, sumDia1, sumDia2]

  let isItamagicsquare = await equalizer.reduce(function (memo, element) {
    return element === equalizer[0]
  })

  var output1 = [
    [``, ``, ``, `[${sumDia2}]`.cyan],
    [`[${displaygrid[0][0]}²]`.yellow, `[${displaygrid[0][1]}²]`.yellow, `[${displaygrid[0][2]}²]`.yellow, `[${sumRow1}]`.magenta],
    [`[${displaygrid[1][0]}²]`.yellow, `[${displaygrid[1][1]}²]`.yellow, `[${displaygrid[1][2]}²]`.yellow, `[${sumRow2}]`.magenta],
    [`[${displaygrid[2][0]}²]`.yellow, `[${displaygrid[2][1]}²]`.yellow, `[${displaygrid[2][2]}²]`.yellow, `[${sumRow3}]`.magenta],
    [`[${sumCol1}]`.blue, `[${sumCol2}]`.blue, `[${sumCol3}]`.blue, `[${sumDia1}]`.cyan]
  ]
  await console.log(cliff.stringifyRows(output1))
  await console.log(`Attempt: ${run}`.grey)
  await console.log(`Seed: ${seed}`.grey)
  if (isItamagicsquare) {
    await console.log('Success'.green)
  } else {
    await console.log('Failed'.red)
  }

  return [isItamagicsquare, seed]
}

async function justDoIt () {
  let result = await theydidthemaths()[0]
  if (!result) {
    await justDoIt()
  } else {
    console.log('OMG OMG OMG IT WORKED'.rainbow)
  }
}

justDoIt()
