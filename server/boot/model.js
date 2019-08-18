'use strict'

module.exports = function(app, callback) {
  // $ db = dataSourceName
  // table1, table2 = Table names to migrate, will be delete if existing
  // app.dataSources.db.automigrate(['table1', 'table2'])
  console.log('Performed automigration.')
  return callback()
}

