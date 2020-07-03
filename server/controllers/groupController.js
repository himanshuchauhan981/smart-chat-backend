const { groupHandler } = require('../handlers')

let groupController = {
  createGroup : async (req,res) =>{
    let response = await groupHandler.createGroup(req,res)
    if(response['status']) res.status(200).send(response)
    else res.status(409).send(response)
  },

  getUserGroups : async (username) =>{
    let response = await groupHandler.getUserGroups(username)
    return response
  },

  getGroupMessages : async (groupName) =>{
    let response  = await groupHandler.getGroupMessages(groupName)
    return response
  },

  saveNewMessage : async (sender,roomID,message) =>{
    let response = await groupHandler.saveNewMessage(sender,roomID,message)
    return response
  }
}

module.exports = groupController