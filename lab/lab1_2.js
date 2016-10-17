var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var ec2 = new AWS.EC2({});
var autoscaling = new AWS.AutoScaling();

var infoTask = function(request, next){
	var handleInstancesFunc = function(err, data) {
		if (err) {
			console.log(err, err.stack);
			return next(err);
		}
		console.log(data);
		next(null, data);
	};

	ec2.describeInstances({}, handleInstancesFunc);
};

var launchTask = function(request, next){
	var runParams = {
		ImageId: 'ami-89738fe9',
		MinCount: 1,
		MaxCount: 1,
		KeyName: 'piomar123key01',
		InstanceType: 't1.micro',
		Monitoring: {Enabled: false}
	};
	var tagsQuery = {
		Tags: [{ Key: 'Name', Value: 'piotr.marcinczyk-SDK' }],
	};
	var output = {};

	var handleCreateTagsFunc = function(err, tagsData){
		if (err) {
			console.log(err, err.stack);
			return next(err);
		}
		output.tags = tagsData;
		console.log(tagsData);
		next(null, output);
	};

	var handleRunInstancesFunc = function(err, runData){
		if (err) {
			console.log(err, err.stack);
			return next(err);
		}
		console.log(runData);
		output.run = runData;
		tagsQuery.Resources = [runData.Instances[0].InstanceId];
		ec2.createTags(tagsQuery, handleCreateTagsFunc);
	};

	ec2.runInstances(runParams, handleRunInstancesFunc);
};

var desiredTask = function(request, next){
	var desiredParams = {
		AutoScalingGroupName: "MarcinczykASG",
		DesiredCapacity: request.query.capacity,
		HonorCooldown: true
	};
	autoscaling.setDesiredCapacity(desiredParams, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			return next(err);
		}
		console.log(data);
		next(null, data);
	});
};

exports.lab = {
	info: infoTask,
	launch: launchTask,
	desired: desiredTask
};
