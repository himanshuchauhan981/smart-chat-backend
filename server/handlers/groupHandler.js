const { groupDetails } = require("../models")

let groupHandler = {
  createGroup : async (req,res) =>{
    let groupName  = req.body.groupName
    let existingGroup = await groupDetails.find({'room': groupName})
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
      return { status: true,  msg: 'New group created' }
    }
    else{
      return { status: false, msg: 'Group name already existed' }
    }
  }
}

module.exports = groupHandler