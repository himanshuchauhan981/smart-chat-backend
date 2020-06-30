const { groupHandler } = require('../handlers')

let groupController = {
  createGroup : async (req,res) =>{
    let response = await groupHandler.createGroup(req,res)
    if(response['status']) res.status(200).send(response)
    else res.status(409).send(response)
  }
}

module.exports = groupController