var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var params = {
  //DryRun: false,
  //Filters: [],
  //InstanceIds: [],
  //MaxResults: 1000,
 // NextToken: 'piomar123nexttoken'
};

var ec2 = new AWS.EC2({});

var infoTask = function(request, next){
	ec2.describeInstances(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			throw err;
		}
		console.log(data);
		next(null, data);
	});
};

exports.lab = {
	info: infoTask,
};
