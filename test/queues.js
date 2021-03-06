'use strict';

var should = require('should'),
	dbg = require('debug'),
	debug = dbg('queues'),
	statistics = dbg('queues:statistics'),
	common = require('./common');

describe('Queue operations', function() {
	var queueName = common.getRandomQueueName(),
		q = common.initializeQueue();	
	
	before(function(done) {
		q.authenticate(done);
	});

	it('should return list of available queues', function(done) {
		q.listQueues(function(error, queues) {
			if(error) {
				error.toString().should.containEql('you have no queues in your account');
			}
			else {
				should.not.exist(error);
				should.exist(queues);
				debug('%s queues found', queues.length);
			}
			done();
		});
	});

	it('should create a queue named ' + queueName, function(done) {
		q.createQueue(queueName, done);
		debug('queue %s created', queueName);
	});

	it('should check the existence of a queue named ' + queueName, function(done) {
		q.queueExists(queueName, function(error, exists) {
			should.not.exist(error);
			should.exist(exists);
			done();
		});
	});

	it('should get the stats of a queue named ' + queueName, function(done) {
		q.getQueueStats(queueName, function(error, stats) {
			should.not.exist(error);
			should.exist(stats);
			debug(stats);
			done();
		});
	});

	var metadata = {myProperty: 'myValue'};
	it('should set the metadata of queue ' + queueName, function(done) {
		q.setQueueMetadata(queueName, metadata, done);
	});

	it('should get metadata from queue ' + queueName, function(done) {
		q.getQueueMetadata(queueName, function(error, data) {
			should.not.exist(error);
			should.exist(data);
			data.myProperty.should.eql(metadata.myProperty);
			done();
		});
	});

	it('should delete the queue ' + queueName, function(done) {
		q.deleteQueue(queueName, done);
		debug('queue %s deleted', queueName);
	});

	after(function() {
		statistics('Statistics:', q.getStatistics());
	});
});