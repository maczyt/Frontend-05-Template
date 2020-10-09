const DATA_KEY = Symbol('binary heap data')

export default class BinaryHeap {
  constructor(compare) {
    this[DATA_KEY] = []
    this.compare = compare
  }

  get length() {
    return this[DATA_KEY].length
  }

  // 取
  take() {
    const data = this[DATA_KEY]
    if (!this.length) return
    const v = data[0]
    data[0] = data[this.length - 1]
    data.pop()
    let i = 0
    let n = this.length
    while (2 * i + 1 <= n - 1) {
      let lc = 2 * i + 1
      if (2 * i + 2 <= n - 1) {
        // 有右子节点
        let rc = 2 * i + 2
        let compareL = false
        let compareR = false
        compareL = this.compare(data[i], data[lc]) < 0
        compareR = this.compare(data[i], data[rc]) < 0
        let ind
        if (compareL && compareR) {
          ind = this.compare(data[rc], data[lc]) < 0 ? lc : rc
        } else if (compareL) {
          ind = lc
        } else if (compareR) {
          ind = rc
        }
        if (typeof ind === 'undefined') break
        [data[i], data[ind]] = [data[ind], data[i]]
        i = ind
      } else {
        if (this.compare(data[i], data[lc]) < 0) {
          [data[lc], data[i]] = [data[i], data[lc]]
          i = lc
        } else {
          break
        }
      }
    }
    return v
  }

  // 存
  put(v) {
    const data = this[DATA_KEY]
    let i = this.length
    data[i] = v
    let pIndex
    while (i > 0) {
      pIndex = Math.floor((i - 1) / 2)
      if (this.compare(data[pIndex], v) < 0) {
        [data[pIndex], data[i]] = [data[i], data[pIndex]]
        i = pIndex
      } else {
        break
      }
    }
  }

  toString() {
    return this[DATA_KEY].toString()
  }
}