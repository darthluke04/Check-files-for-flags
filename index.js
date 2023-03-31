var words = require('an-array-of-english-words'); // Array of english words

const fs = require('fs'); // File System Module

const path = require("path"); // Path Module

// Constants
const folder = 'example/'; 				// Which directory to scan
const finder = "flag{"; 	// Beginning of string to scan E.g, flag{
const finderEnd = "}"; 				// End of string to scan E.g, }

// WARNING: Takes longer to read if higher
const includeMax = 50; 				// Max amount of words read
const dataMax = 500; 					// Max amount of data printed

// Data
var flagAnswer = ""; 					// Current flag answer
var numberFile = 0; 					// Current number of files scanned
var totalmb = 0; 							// Total Megabytes scanned
var estTotalmb = 28.842; 			// Total Megabytes in directory

// Developer Info
var devInfo = false; 					// Include data read in file (true or false)
var flagDevInfo = true; 			// disable developer info even if flag found (true or false)

// WARNING: Takes longer to read if true
var includeInfo = false; 			// Include possible words in file (true or false)

// NOT IMPLEMENTED
var checkForHashes = false;		// Checks for hashes in file (true or false)

start();

// Funciton to run
function start() {
	var flags = ""; // String that holds all flags
	// Reads directory
	fs.readdir(folder, (err, files) => {
		if (err) throw err;

		// Reads through all files in directory
		for (const file of files) {
			var filePath = folder + file;

			// Returns error if error
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				// Increase
				numberFile += 1;
				totalmb += (((new TextEncoder().encode(data)).length) * 0.000001);

				// Print the files being read before reading
				console.log("\x1B[93mReading File: " + "\x1B[93m(\x1B[35m" + numberFile + "\x1B[93m OF \x1B[35m" + files.length + "\x1B[93m)\x1B[36m " + file + "\u001b[37m\u001b[00m");
				console.log("\x1B[93mData MegaBytes: \x1B[93m(\x1B[35m" + (((new TextEncoder().encode(data)).length) * 0.000001).toFixed(6) + "MB\x1B[93m)\u001b[37m\u001b[00m");
				console.log("\x1B[93mTotal MegaBytes: \x1B[93m(\x1B[35m" + (totalmb).toFixed(3) + "MB\x1B[93m)\u001b[37m\u001b[00m");

				// Checking through dictonary for words in data
				var included = "[";
				var includeLength = 0;
				if ( (includeInfo == true) && (devInfo == true || data.includes(finder)) ) {
					for (let l = 0; l < words.length; l++) {
						if((includeLength < includeMax) && (data.toLowerCase().includes(" " + words[l] + " ") || data.toLowerCase().includes(" " + words[l] + "\n") || data.toLowerCase().includes("_" + words[l] + "_") || data.toLowerCase().includes(words[l] + "_") || data.toLowerCase().includes("_" + words[l]) || data.toLowerCase().includes("_" + words[l] + "\n")) ){
							// console.log("words: " + words [l]);
							included += "\"" + words[l] + "\", ";
							includeLength += 1;
						}
					}
					included += "]";
				}

				// Set print color to green if found flag
				if (data.includes(finder)) {
					console.log("\u001b[32m");
				}

				// Print data if flag is found or if 'devInfo' is true
				if ( (data.includes(finder) && flagDevInfo == true) || (devInfo == true) ) {
					if (includeInfo == true) {
						console.log("Included: " + included);
						console.log("Included Length: " + includeLength + "\n");
					}

					// If amound of words smaller than dataMax then cut off
					if (data.length < dataMax) {
						console.log("Data: \n" + data);
					} else {
						console.log("Data: \n" + data.substring(0, dataMax) + "...");
					}

					console.log("Data Length: " + data.length);
					console.log("Data Bytes: " + ((new TextEncoder().encode(data)).length) + "\n");
				}

				// Print Flag if flag is found and set flags to flag
				if (data.includes(finder)) {
					var flag = data.substring(data.toLowerCase().indexOf(finder), (data.substring(data.toLowerCase().indexOf(finder)).indexOf(finderEnd)) + data.toLowerCase().indexOf(finder) + 1);
					flagAnswer = flag;
					flags += (flag + " : " + file + "\n");
					if (flagDevInfo == true) {
						console.log("\nFlag Index: " + data.toLowerCase().indexOf(finder));
						console.log("Flag Length: " + flag.length);
						console.log("\x1B[36mFlag: " + flags + "\u001b[32m");
					}
				}

				// Print File read and percentage of files completed (calculated by number of files) and (calculated by Megabytes total)
				console.log("\x1B[93mFile Read: " + "\x1B[93m(\x1B[35m" + ((numberFile / files.length) * 100).toFixed(0) + "%\x1B[93m) : (\x1B[35m" + ((totalmb / estTotalmb) * 100).toFixed(2) + "%\x1B[93m)\u001b[37m\u001b[00m");
				console.log("--------------------------------------------------------------------------------\u001b[37m\u001b[00m");

				// Print flag(s) found
				if (flagAnswer != "" && flags != "") {
					console.log("\x1B[35mFLAGs: \n" + flags + "\033[0m")
				}
			});
		}
	});
}