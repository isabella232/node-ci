var fs = require("fs")
    , path = require('path')
    , async = require("async");

// This function will attempt to find, and or create
// a local SSH file for use by git in its github calls.

exports.confirm = function(done) {

  
  var dirpath = path.resolve('../.ssh');
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
        console.log('The ' + dirpath + ' exists.');
  		  callback(null, "Folder Exists");
        return;
  	  } 
      else {
  		  fs.mkdir(dirpath, function() {
          console.log('Creating the file')
          callback(null, "Folder Created."); 
          return;
  		  });
  	  }

  	},
  	checkFile: function(callback) {

	    if (path.existsSync(sshfile)) {
        console.log('The ssh file' + sshfile + ' exists.');
		    callback(null, { status: true, file: sshfile, message: "File Exists" });
	    } 
      else {
		    fs.writeFile(sshfile, process.env.SSH_CERT, function(err) {
		      if(err) return callback(err)
          console.log('Created the ssh file.')
		      callback(err, { status: true, file: sshfile, message: "File Created."});
		    }); 
	    }

  	}
  }, function(err, result) { 

    console.log('Conirm', result);
    var status = result.checkFile ? result.checkFile.status : false;
    done(err, { status: status, result: result } );
  });

}