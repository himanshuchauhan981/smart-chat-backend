const { users, groupDetails } = require("../models")

async function addGroupId(groupUsers){
  for(let i in groupUsers['members']){
    await users.findByIdAndUpdate(groupUsers['members'][i]['memberId'],{
      $push: { 
        groupIds: {
          groupId: groupUsers['_id']
        }
      }
    })
  }
  await users.findOneAndUpdate({username: groupUsers['admin']},{
    $push: { 
      groupIds: {
        groupId: groupUsers['_id']
      }
    }
  })
}

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
      await groupObject.save((err,data) =>{
        addGroupId(data)
      })
      return { status: true,  msg: 'New group created' }
    }
    else{
      return { status: false, msg: 'Group name already existed' }
    }
  },

  getUserGroups : async (username) =>{
    groupNameList = []
    let groupList = await users.findOne({username: username}).select({groupIds:1})
    if(groupList != null){
      let groupIdList = groupList['groupIds']
      for(let i in groupIdList){
        let groupName = await groupDetails.findById(groupIdList[i]['groupId']).select({room:1})
        groupNameList.push(groupName)
      }
    }
    return groupNameList
  }
}

module.exports = groupHandler