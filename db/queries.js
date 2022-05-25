const queries = {
	getData: async (model, query, projection, options) => model.find(query, projection, options),

	findOne: async (model, query, projection, options) => model.findOne(query, projection, options),

	create: async (Model, data) => new Model(data).save(),

	populateData: (model, query, projection, options, collectionOptions) => model
		.find(query, projection, options)
		.populate(collectionOptions)
		.exec(),

	aggregateDataWithPopulate:
	(model, aggregateArray, populateOptions) => new Promise((resolve, reject) => {
		model.aggregate(aggregateArray, (err, data) => {
			if (err) {
				reject(err);
			}
			model.populate(data, populateOptions, (populateError, populatedDocs) => {
				if (populateError) reject(populateError);
				resolve(populatedDocs);
			});
		});
	}),

	countDocuments: (model, condition) => model.countDocuments(condition),

	findAndUpdate:
	(model, conditions, update, options) => model.findOneAndUpdate(conditions, update, options),

	aggregateData: (model, aggregateArray, options) => {
		const aggregation = model.aggregate(aggregateArray);

		if (options) {
			aggregation.options = options;
		}

		return aggregation.exec();
	},

	updateMany: (model, conditions, update, options) => model.updateMany(conditions, update, options),
};

module.exports = queries;
