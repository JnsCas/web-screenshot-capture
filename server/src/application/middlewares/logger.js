export default function logger(req, res, next) {
  req.time = new Date(Date.now()).toISOString()
  console.log(req.method, req.path, req.query, req.time)
  next()
}
