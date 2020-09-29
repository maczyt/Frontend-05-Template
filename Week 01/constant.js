export function generatePatterns(num) {
  return Array.from({ length: num }, () => Array(num).fill(0))
}

export function delegate(container, target, eventName, callback) {
  container.addEventListener(eventName, (event) => {
    if (event.target.matches(target)) {
      callback(event)
    }
  }, false)
}
export const color_val_symbol = Symbol('Color Value')
export const color = {
  [color_val_symbol]: 1,
}