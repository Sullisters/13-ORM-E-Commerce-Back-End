const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include:[Product]
    })
      res.status(200).json(categories)
  } catch (err) {
    console.log(err)
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include:[Product]
    })

    if (!category) {
      return res.status(400).json({message: 'No category!'})
    }
    res.status(200).json(category)
  } catch (err) {
    console.log(err)
  }
});

// create a new category
router.post('/', (req, res) => {
  // req.body should look like this...
  // {
        // category_name: "Elvis",
        // "product_id": [1, 2, 3, 4]
  // }
Category.create(req.body)
  .then((category) => {
    if (req.body.product_id.length) {
      const categoryProductArr = req.body.product_id.map((product_id) => {
        return {
          category_id: category.id,
          product_id,
        }
      })
      return Product.bulkCreate(categoryProductArr)
    }
    res.status(200).json(category)
  })
  .then((categoryProductIds) => res.status(200).json(categoryProductIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  })
})
    

router.put('/:id', (req, res) => {
  // update product data
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from ProductTag
      return category.findAll({ where: { category_id: req.params.id } });
    })
    .then((categoryProducts) => {
      // get list of current tag_ids
      const categoryProductIds = categoryProducts.map(({ product_id }) => product_id);
      // create filtered list of new tag_ids
      const newCategoryProducts = req.body.productIds
        .filter((product_id) => !categoryProductIds.includes(product_id))
        .map((product_id) => {
          return {
            category_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const categoryProductsToRemove = categoryProducts
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Category.destroy({ where: { id: categoryProductsToRemove } }),
        Category.bulkCreate(newCategoryProducts),
      ]);
    })
    .then((updatedCategoryProducts) => res.json(updatedCategoryProducts))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.destroy({
        where: {
            id: req.params.id
        }
    })

    if (!category) {
       return res.status(400).json({message: 'No category!'})
    }

    res.status(200).json(category)
} catch (err) {
    console.log(err)
}
});

module.exports = router;
