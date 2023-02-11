module.exports = check

// test 14 is not passing, because the code works with maximum one type of universal brackets

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
    const isCorrect = rootGroup.openedStack.length === 0 && rootGroup.isEvenAmountUniversals()
    return isCorrect
  }

  tryAdd(bracket) {
    const type = bracket.type
    
    if (type == 'closed') {
      const lastOpenedGroup = this.openedStack.pop()
      if (!lastOpenedGroup) return false
      if (lastOpenedGroup.closedBracket == bracket.char) {
        return lastOpenedGroup.isEvenAmountUniversals()
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

  isEvenAmountUniversals() {
    debugger
    const amount = this.elements.filter(element => {
      debugger
      return element instanceof Bracket && element.type == 'universal'
    }
    ).length
    return amount % 2 === 0
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

const config1 = [['(', ')']];
const config2 = [['(', ')'], ['[', ']']];
const config3 = [['(', ')'], ['[', ']'], ['{', '}']];
const config4 = [['|', '|']];
const config5 = [['(', ')'], ['|', '|']];
const config6 = [['1', '2'], ['3', '4'], ['5', '6'], ['7', '7'], ['8', '8']];
const config7 = [['(', ')'], ['[', ']'], ['{', '}'], ['|', '|']];

const res = check('8888877878887777777888888887777777887887788788887887777777788888888887788888', config6)
console.log(res)