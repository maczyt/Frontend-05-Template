export function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export class Sorted {
  constructor(data = [], compare = ((a, b) => a - b)) {
    this.data = data
    this.compare = compare
  }

  take() {
    if (!this.data.length) return
    let minIndex = 0
    let min = this.data[0]
    
    this.data.forEach((v, i) => {
      if (this.compare(v, min) < 0) {
        minIndex = i
        min = v
      }
    })

    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
    return min
  }

  put(v) {
    this.data.push(v)
  }
}