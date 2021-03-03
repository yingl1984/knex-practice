const knex = require('knex')
require('dotenv').config()

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByProduceName(searchTerm) {
    knexInstance
      .select('*')
      .from('shopping_list')
      .where('item_name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result)
      })
  }
  
  searchByProduceName('fi')

  function paginateProducts(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
    .select('*')
    .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
  paginateProducts(3)

  function getItemsAddedAfterDate(days) {
    knexInstance
      .select('*')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('shopping_list')
      .orderBy([
        { column: 'date_added', order: 'DESC' },
        { column: 'id', order: 'ASC' },
      ])
      .then(result => {
        console.log(result)
      })
  }
  
  getItemsAddedAfterDate(2)

  function getTotalPriceByCategory(){
    knexInstance
    .count('price AS Total_price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
        console.log(result)
    })
  }
  
  getTotalPriceByCategory();