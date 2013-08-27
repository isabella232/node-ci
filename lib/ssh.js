var fs = require("fs")
    , path = require('path')
    , async = require("async");

// This function will attempt to find, and or create
// a local SSH file for use by git in its github calls.

exports.confirm = function(done) {

  
  var dirpath = path.resolve(__dirname, '../.ssh');
  var sshfile = dirpath + "/id_rsa";

  console.log('Got this', dirpath, sshfile);

  // First check that we have the defined process.env variable.
  if (!process.env.SSH_CERT) {
  	var result = { hasSSHCert: { status: false, message: "NO SSH_CERT variable found. "} };
    return done(null, { status: false, result: result });
  }

  async.series({
  	checkFolder: function(callback) {

  	  if (path.existsSync(dirpath)) {
  		  callback(null, { status: true, message: "Folder Exists" });
        return;
  	  } 
      else {
  		  fs.mkdir(dirpath, function() {
          callback(null, { status: true, message: "Folder Created." }); 
          return;
  		  });
  	  }

  	},
  	checkFile: function(callback) {

	    if (path.existsSync(sshfile)) {
		    callback(null, { status: true, file: sshfile, message: "File Exists" });
	    } 
      else {
		    fs.writeFile(sshfile, process.env.SSH_CERT, function(err) {
		      if (err) return callback(err, { status: false, error: err, file: sshfile });
		      callback(null, { status: true, file: sshfile, message: "File Created."});
		    }); 
	    }

  	},
    sshdirList: function(callback) {

      fs.readdir(dirpath, function(err, data) {
        if (err) return callback(err, { status: false, message: err });
        callback(null, { status: true, message: data });
      });

    },
    // dumpSSH: function(callback) {

    //   var fs = require('fs');

    //   fs.readFile(sshfile, 'utf8', function(err, data) {
    //     if (err) return callback(err);
    //     callback(null, { _raw: data })
    //   });

    // }
  }, function(err, result) { 

    console.log('Conirm', result);
    
    var status = result.checkFile ? result.checkFile.status : false;
    done(err, { status: status, result: result } );
  });

}