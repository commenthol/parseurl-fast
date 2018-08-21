const isNull = v => (v || null) === null

const massage = obj => {
  if (obj) {
    obj = Object.assign({}, obj)
    Object.keys(obj).forEach((p) => {
      if (obj[p] === null) obj[p] = undefined
    })
  }
  return obj
}

module.exports = {
  massage,
  isNull
}
