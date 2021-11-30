function keyIdentity(key) {
    return key
}

export default function flatJson(target) {
    const delimiter = '.'
    const transformKey = keyIdentity;
    const output = {}

    function step(object, prev, currentDepth) {
        currentDepth = currentDepth || 1
        Object.keys(object).forEach(function (key) {
            const value = object[key]
            const type = Object.prototype.toString.call(value)
            const isjason = (type === '[object Object]');
            const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key)
            if (isjason && Object.keys(value).length) {
                return step(value, newKey, currentDepth + 1)
            }
            output[newKey] = value
        })
    }
    step(target)
    return output
}