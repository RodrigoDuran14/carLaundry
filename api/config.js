//configuraciones del servidor
exports.config = {
  port: process.env.PORT || 3001,
  db_url: process.env.DB_URL || 'mongodb://localhost:27017/db_carlaundry'
}