const { groupHandler } = require('../handlers')

let groupController = {
  createGroup : async (req,res) =>{
    let response = await groupHandler.createGroup(req,res)
    res.status(200).send(response)
  }
}

module.exports = groupController