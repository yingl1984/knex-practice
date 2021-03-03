const ShoppingListsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function() {
  let db
  let items = [
    {
      id: 1,
      item_name: 'Fish tricks',
      price: '13.10',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
        id: 2,
        item_name: 'Hot  Dogs',
        price: '4.99',
        date_added: new Date('2100-05-22T16:28:32.615Z'),
        checked: true,
        category: 'Snack'
    },
    {
        id: 3,
        item_name: 'Bluffalo Wings',
        price: '5.50',
        date_added: new Date('1919-12-22T16:28:32.615Z'),
        checked: false,
        category: 'Snack'
    }
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())
  afterEach(() => db('shopping_list').truncate())
  
  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {

    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(items)
    })
    it(`getAllshoppingLists() resolves all items from 'shopping_list'`, () => {
      return ShoppingListsService.getAllshoppingLists(db)
       .then(actual => {
         expect(actual).to.eql(items)
       })
    })
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdItem = items[thirdId - 1]
      return ShoppingListsService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            item_name: thirdItem.item_name,
            price: thirdItem.price,
            date_added: thirdItem.date_added,
            checked: thirdItem.checked,
            category: thirdItem.category
          })
        })
    })
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListsService.deleteItem(db, itemId)
        .then(() => ShoppingListsService.getAllshoppingLists(db))
        .then(allItems => {
          // copy the test articles array without the "deleted" article
          const expected = allItems.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
      })
    })
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        item_name: 'updated item_name',
        price: '2.22',
        date_added: new Date(),
        checked:true,
        category: 'Main'
      }
      return ShoppingListsService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListsService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          })
        })
      })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllshoppingLists() resolves an empty array`, () => {
      return ShoppingListsService.getAllshoppingLists(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        item_name: 'Banana',
        price: '1.10',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked:true,
        category:'Snack'
      }
      return ShoppingListsService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            item_name: newItem.item_name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category
          })
        })
    })
  })
})

