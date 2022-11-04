const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include:[Product]
    })
      res.status(200).json(tags)
  } catch (err) {
    console.log(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include:[Product]
    })

    if (!tag) {
      return res.status(400).json({message: 'No tag!'})
    }
    res.status(200).json(tag)
  } catch (err) {
    console.log(err)
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body)
    res.status(200).json(tag)
  } catch (err) {
    console.log(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.update({
      where: {
        id: req.params.id
      }
    })

    if (!tag) {
      return res.status(400).json({message: 'No tag!'})
    }

    res.status(200).json(tag)
  } catch (err) {
    console.log(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.destroy({
        where: {
            id: req.params.id
        }
    })

    if (!tag) {
       return res.status(400).json({message: 'No tag!'})
    }

    res.status(200).json(tag)
} catch (err) {
    console.log(err)
}
});

module.exports = router;
