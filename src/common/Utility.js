
export const evalJsonStr = str => {
    try {
      JSON.parse(str.replace(/[\r\n\0\b\f\t]+/g," "))
      return true
    } catch (e) {
      return false
    }
  }
  
export const cleanJsonStr = str => {
  return str.replace(/[\r\n\0\b\f\t]+/g," ")
}