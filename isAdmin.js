export function isAdmin(req, res, next) {
  const role = req.headers.role // simple demo (later use JWT)

  if (role === "admin") {
    next()
  } else {
    res.status(403).json({
      message: "Access denied. Admin only."
    })
  }
}