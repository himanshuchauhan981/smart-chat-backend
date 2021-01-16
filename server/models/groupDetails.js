const mongoose = require('mongoose');

const { groupDetails } = require('../schemas');

class GroupDetails {
	constructor() {
		this.groupDetailsModel = groupDetails;
	}

	create(groupData) {
		let groupDetailsObject = new this.groupDetailsModel(groupData);
		return groupDetailsObject.save();
	}

	findByGroupRoom(room) {
		return this.groupDetailsModel.find({ room });
	}

	findParticularUserGroups(userId) {
		return this.groupDetailsModel.find({
			$or: [
				{
					members: {
						$elemMatch: { memberId: mongoose.Types.ObjectId(userId) },
					},
				},
				{
					admin: mongoose.Types.ObjectId(userId),
				},
			],
		});
	}
}

module.exports = new GroupDetails();
