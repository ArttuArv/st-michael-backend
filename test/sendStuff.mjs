import beerList from './beer.json'
import whiskyList from './whiskies.json'
const beerUrl = 'http://localhost:3003/api/beer'
const whiskyUrl = 'http://localhost:3003/api/whisky'
import fetch from 'node-fetch'

const bottleBeers = beerList.filter(beer => beer.category === 'On Bottle')
const draughtBeers = beerList.filter(beer => beer.category === 'On Draught')
const localBeers = beerList.filter(beer => beer.category === 'Local Draughts')
const regularBeers = beerList.filter(beer => beer.category === 'Regular Draughts')

const highlandWhiskies = whiskyList.filter(whisky => whisky.area === 'Highland')
const islandWhiskies = whiskyList.filter(whisky => whisky.area === 'Islands')
const lowlandWhiskies = whiskyList.filter(whisky => whisky.area === 'Lowland')
const campbeltownWhiskies = whiskyList.filter(whisky => whisky.area === 'Campbeltown')
const irishWhiskies = whiskyList.filter(whisky => whisky.area === 'Irish')
const japaneseWhiskies = whiskyList.filter(whisky => whisky.area === 'Japan')
const otherWhiskies = whiskyList.filter(whisky => whisky.area !== 'Highland' && whisky.area !== 'Islands' && whisky.area !== 'Lowland' && whisky.area !== 'Campbeltown' && whisky.area !== 'Irish' && whisky.area !== 'Japan')



const postBeers = (beer) => {
  fetch(beerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      body: JSON.stringify(beer)
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))  
}

const postWhiskies = (whisky) => {
  fetch(whiskyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      body: JSON.stringify(whisky)
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))
}

const funcWithDelay = (func, delayTime) => {
  return (target, i) => {
    setTimeout(() => {
      func(target)
    }, i * delayTime)
  }
}

// bottleBeers.forEach(funcWithDelay(postBeers, 1000))
// draughtBeers.forEach(funcWithDelay(postBeers, 1000))
// localBeers.forEach(funcWithDelay(postBeers, 1000))
// regularBeers.forEach(funcWithDelay(postBeers, 1000))

// highlandWhiskies.forEach(funcWithDelay(postWhiskies, 1000))
islandWhiskies.forEach(funcWithDelay(postWhiskies, 500))
lowlandWhiskies.forEach(funcWithDelay(postWhiskies, 500))
campbeltownWhiskies.forEach(funcWithDelay(postWhiskies, 500))
irishWhiskies.forEach(funcWithDelay(postWhiskies, 500))
japaneseWhiskies.forEach(funcWithDelay(postWhiskies, 500))
otherWhiskies.forEach(funcWithDelay(postWhiskies, 500))