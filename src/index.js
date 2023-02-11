module.exports = check

class Group {
  constructor (openBracket) {
    this.elements = []
    this.openedStack = []
    if (!openBracket) return
    this.closedBracket = openBracket.pair
  }

  static evaluate(string) {
    const rootGroup = new this()
    for (const char of string) {
      const character = new Bracket(char)
      const success = rootGroup.tryAdd(character)
      if (!success) return false
    }
    const isCorrect = rootGroup.openedStack.length === 0 && rootGroup.checkUniversals()
    return isCorrect
  }

  tryAdd(bracket) {
    const type = bracket.type
    
    if (type == 'closed') {
      const lastOpenedGroup = this.openedStack.pop()
      if (!lastOpenedGroup) return false
      if (lastOpenedGroup.closedBracket == bracket.char) {
        return lastOpenedGroup.checkUniversals()
      }
      return false
    }

    const lastOpenedGroup = this.openedStack[this.openedStack.length - 1] || this
    
    if (type == 'universal') {
      lastOpenedGroup.elements.push(bracket)
      return true
    }

    if (type == 'open') {
      const newOpenedGroup = new this.constructor(bracket)
      lastOpenedGroup.elements.push(newOpenedGroup)
      this.openedStack.push(newOpenedGroup)
      return true
    }

    return false
  }

  checkUniversals() {
    let universals = this.elements
    .filter(element => element instanceof Bracket && element.type == 'universal')
    if (universals.length === 0) return true
    
    // to do: get rid of this complex loop with a lot of variables
    let currArray = universals,
        isCleared = true
    do {
      isCleared = true
      let newArray = [],
          currType = currArray[0], 
          count = 0;
      
      for (let element of currArray) {
        if (element.char == currType.char) {
          count++
          continue
        }

        if (count % 2 !== 0) newArray.push(currType);
        if (count > 1) isCleared = false;

        currType = element
        count = 1
      }
      if (count % 2 !== 0) newArray.push(currType);
      if (count > 1) isCleared = false;

      currArray = newArray
    } while (!isCleared && currArray.length)

    return currArray.length === 0
  }
}

class Bracket {
  constructor (char) {
    this.char = char
    const data = this.constructor.#dictionary[char]
    this.type = data?.type
    this.pair = data?.pair
  }

  static #dictionary = {}
  static setConfig(config) {
    this.#dictionary = {}
    for (const edges of config) {
      if (edges[0] === edges[1]) {
        this.#dictionary[edges[0]] = {type: 'universal'}
        continue
      }

      this.#dictionary[edges[0]] = {
        type: 'open',
        pair: edges[1]
      }
      this.#dictionary[edges[1]] = {
        type: 'closed',
        pair: edges[0]
      }
    }
  }
}

function check(string, bracketsConfig) {
  Bracket.setConfig(bracketsConfig)
  return Group.evaluate(string)
}
