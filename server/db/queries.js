const queries = {
	getData: async (model, query, projection, options) => {
		return model.find(query, projection, options);
	},

	findOne: async (model, query, projection, options) => {
		return model.findOne(query, projection, options);
	},

	create: async (model, data) => {
		return new model(data).save();
	},

	populateData: (model, query, projection, options, collectionOptions) => {
		return model
			.find(query, projection, options)
			.populate(collectionOptions)
			.exec();
	},

	aggregateDataWithPopulate: (model, aggregateArray, populateOptions) => {
		return new Promise((resolve, reject) => {
			model.aggregate(aggregateArray, (err, data) => {
				if (err) {
					reject(err);
				}
				model.populate(data, populateOptions, function (err, populatedDocs) {
					if (err) reject(err);
					resolve(populatedDocs);
				});
			});
		});
	},

	countDocuments: (model, condition) => {
		return model.countDocuments(condition);
	},

	findAndUpdate: (model, conditions, update, options) => {
		return model.findOneAndUpdate(conditions, update, options);
	},

	aggregateData: (model, aggregateArray, options) => {
		let aggregation = model.aggregate(aggregateArray);

		if (options) {
			aggregation.options = options;
		}

		return aggregation.exec();
	},
};

module.exports = queries;
