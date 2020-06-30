const { users, groupDetails } = require("../models")

let groupHandler = {
  createGroup : async (req,res) =>{
    let admin  = req.body.admin
    let existingGroup = await users.find({'admin': admin})
    if(existingGroup.length == 0){
      let members = req.body.groupUsers.map(({_id: memberId, username: name}) => ({memberId,name}))
      let groupObject = new groupDetails({
        room: req.body.groupName,
        members: members,
        admin: req.body.admin,
        groupStatus: 'New Group',
        groupImage: 'No Image'
      })
      await groupObject.save()
      return {msg: 'New group created successfully' }
    }
    else{
      return { msg: 'Group name already existed' }
    }
  }
}

module.exports = groupHandler