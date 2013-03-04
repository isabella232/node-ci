var forever  = require('forever');
var _        = require('underscore');
var fs       = require('fs');
var githubAPI  = require('github');


exports.getBranches =  function(session, cb) {

  var github = new githubAPI({ version: '3.0.0' });
  github.authenticate({ type: 'oauth', token: session.user.access_token });

  var opt = {
    repo:   GLOBAL.config.repository.repo,
    user:   GLOBAL.config.repository.user,
  };

  github.repos.getBranches(opt, function(err, data) {
    if (err) return callback(err, null);
    cb(null, data);
  });
  
}

exports.getSites = function(cb) {

 forever.list(false, function (err, data) {

    if (err) {
      GLOBAL.messages.push({ type: 'error', copy: 'Unable to fetch the existing processes..'});
      return cb(err, null)
    }
    
    // Loop and ensure we have config data for all processes.
    _.each(data, function(o) {
      o.ui_port = o.ui_port || 'NA';
      o.ui_name = o.ui_name || 'NA';
      o.ui_description = o.ui_description || '';
      o.ui_owner = o.ui_owner || 'NA';
      o.ui_sha   = o.ui_sha || 'NA';
      o.ui_url   = o.ui_url || '';
      o.ui_type  = o.ui_type || '';  // Snapshot vs head.
    });

    cb(null, data);
  });

}

exports.getBuilds = function(cb) {

 var dir = GLOBAL.root +  '/tmp';

 forever.list(false, function (err, processes) {

    fs.readdir(dir, function (err, list) {

      var builds = [];
      _.each(list, function(o){
        var proc = _.filter(processes, function(i) { if (i.ui_sha) return i.ui_sha == o; });

        var d = { 
          commit: o, 
          process: proc.length == 1 ? proc[0] : undefined
        };

        builds.push(d);
      });

      cb(null, builds);
    });

  });

}

exports.getProcessbyTypeAndID = function(type, id, cb) {

  forever.list(false, function (err, data) {
    if (err) return cb(err);

    var results = _.filter(data, function(o) {
      return o.type == type && o.ui_sha == id;
    });
  
    if (results.length == 1) {
      cb(null, results[0]);
    } else {
      cb(null, null);
    }

  })

}

exports.getProcessIndexbyID = function(uid, cb) {

  forever.list(false, function (err, data) {
    if (err) return cb(err);

    var UIDs = [];
    _.each(data, function(o) { UIDs.push(o.uid); });

    var indexNum = _.indexOf(UIDs, uid);

    if (indexNum == -1) indexNum = null;

    cb(null, indexNum);
  })

}

exports.getProcessByID = function(uid, cb) {

  forever.list(false, function (err, data) {
    if (err) return cb(err);

    var element = _.find(data, function(o) { return o.uid == uid;});
    cb(null, element);
  })

}

exports.getUsedPorts = function(cb) {

 forever.list(false, function (err, data) {
    if (err) return cb(err, null);

    var ports = [];
    _.each(data, function(o) {
      if (o.ui_port && typeof o.ui_port != undefined) ports.push( parseInt(o.ui_port));
    });

    cb(null, ports);
  })

}

exports.getPort = function(cb) {
 
  forever.list(false, function (err, data) {
    if (err) return cb(err, null);

    var ports = [];
    _.each(data, function(o) {
      if (o.ui_port && typeof o.ui_port != undefined) ports.push( parseInt(o.ui_port));
    });

    for (var i=3010; i<3020;i++) { 
      if (_.indexOf(ports, i) == -1) return cb(null, i);
    }

    cb(null, null);
  });

}