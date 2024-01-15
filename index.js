/*------------ Modules and Dictionaries ------------*/
const words = require('an-array-of-english-words');	// * Array of english words
const fs = require('fs');				// * File System Module
const path = require("path");				// * Path Module
const Cryptr = require('cryptr');			// * Decrypt module
const bf = require('bruteforce'); 			// * Bruteforce Module (Determaine Key)
const two = ['b', 'q'];					// * Two chars (For Testing)
const num = [0,1,2,3,4,5,6,7,8,9];			// * All possible numbers
const alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '`', '-', '=', '{', '}', '[', ']', ':', '\'', ';', '\"', ',', '.', '/', '<', '>', '?', '\\', '|']; // The chararacter dictionary

/*------------ CONSTANTS - DO CHANGE ------------*/
// Main
const folder = 'example/'; 				//   ["example/"] * Which directory to scan
const finder = "flag{"; 				//   ["flag{"]    * Beginning of string to scan E.g, flag{
const finderEnd = "}"; 					//   ["}"]        * End of string to scan E.g, }
const decryption = false;				// ! [false]       * Decrypts flag if in file (true or false)
const bruteforceKeys = false;				// ! [false]       * Guesses the key by using brute force if true. WARNING: Takes longer to read if true (true or false).
const includeMax = 50; 					// ! [50]         * Max amount of words read. - WARNING: Takes longer to read if higher
// Security
var cryptKey = "myTotallySecretKey";			//   ["Key"]      * The key for decryption. [Same as the one that the owner used to encrypt]
const bruteLengthMax = 010;				// ! [0005]       * Bruteforce key length max. - WARNING: Takes longer if higher.
const bruteLengthMin = 0001;				//   [true]       * Bruteforce key length min. (GREATER THAN 0)
const brutePrintMain = true;				//   [false]      * Print all of bruteforce info.
const brutePrintPerc = true;				//   [false]      * Print bruteforce Percentage. (bar + Advanced Percentage)
const brutePrintTest = false;				//   [false]      * Print the current key being tested.
const brutePrintFlag = true;				//   [false]      * Print the current flag that is being decrypted.
const brutePrintPrints = false;				//   [false]      * Print the amount of trys / prints it has bruteforced for the current flag.
const brutePrintOther = false;				//   [false]      * Print other bruteforce info.
const brutePrintTime = true;				//   [false]      * Print time between each key.
// Security Dictionaries
const bruteDictionary = (alph); 			//   [chars]      * The dictionary that the brute force will use to find the key.
// Print Settings
const barLength = 10;					//   [10]         * Print Length for Percentage Bar of the bruteforce
const devInfo = true; 					//   [true]       * Include data read in file (true or false)
const flagDevInfo = true; 				//   [true]       * disable developer info even if flag found (true or false)
const includeInfo = false; 				// ! [false]      * Include possible words in file. - WARNING: Takes longer if true. (true or false)
const dataMax = 500; 					// ! [500]        * Max amount of data printed. - WARNING: Takes longer to read if higher


/*------------ VARIABLES, DO NOT CHANGE ------------*/
// Data
var flagAnswer = ""; 					// * Current flag answer
var numberFile = 0; 					// * Current number of files scanned
var totalmb = 0; 					// * Total Megabytes scanned
var estTotalmb = 28.842; 				// * Total Megabytes in directory
// Security
var cryptr = new Cryptr(cryptKey); 			// * Decrypt string module
var bruteLength = bruteLengthMax;			// * current Brute Force key length
var bruteStartTime = Date.now();
var bruteEndTime = Date.now();
var bruteTime = 0;
var bruteKPS = 0;
var bruteTimeLeftH = 0;
var bruteTimeLeftM = 0;
var bruteTimeLeftS = 0;
var bruteTimeInitial = 0;


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

				// Increase file index
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
					var settingKey = true;
					if (flagDevInfo == true) {
						console.log("\nFlag Index: " + data.toLowerCase().indexOf(finder));
						console.log("Flag Length: " + flag.length);
						console.log("\x1B[36mFlag: " + flags + "");
						//console.log(words);
						var prints = 0;
//						var bruteLengthMax = bruteLength;
						var maxPrints = Number(Math.pow(bruteDictionary.length, bruteLengthMax)).toLocaleString('fullwide', {useGrouping: false});
//						var maxPrints = Number((Math.pow(bruteLengthMax, bruteDictionary.length))).toLocaleString('fullwide', {useGrouping: false});
						var barEq = "";
						var barSp = "";
						function printDecrypt(key) {
							prints += 1;
							barSp = "";
							if(brutePrintOther == true || brutePrintMain == true) {console.log("\x1b[93mPress \x1b[31mCTRL + C\x1b[93m to quit.\u001b[32m");}
							if(brutePrintPrints == true || brutePrintMain == true) {console.log("\x1b[31mPrints                 : " + prints + " of " + maxPrints + " \x1b[93m("  + ((prints / maxPrints) * 100).toFixed(3) +  "%)\u001b[32m");}
							function printBar() {
								eqLength = barLength * (prints / maxPrints);
								//console.log(eqLength);
								spLength = barLength - (((eqLength.toFixed(0)) * barLength)) / 100;
								//console.log(spLength);
								for(let i = 0; barEq.length < eqLength; i++) {
									barEq += "\x1b[93m=";
								}
							}
							function printBruteTime() {
								bruteEndTime = Date.now();
								bruteTime = (bruteEndTime - bruteStartTime);
								bruteKPS = Number((bruteTime/ 1000) * 60).toLocaleString('fullwide', {useGrouping: false});
								bruteTimeLeftH = Number(((bruteTime * maxPrints) / 600) / 6000).toLocaleString('fullwide', {useGrouping: false});
								bruteTimeLeftM = Number(bruteTimeLeftH * 60).toLocaleString('fullwide', {useGrouping: false});
								bruteTimeLeftS = Number(bruteTimeLeftM * 60).toLocaleString('fullwide', {useGrouping: false});
								bruteTimeElapsed = Number(((((bruteEndTime - bruteTimeInitial) / 60) / 6) / 3).toLocaleString('fullwide', {useGrouping: false}));
								if(brutePrintTime == true || brutePrintMain == true) {
									console.log("\x1b[93mKeys Per Second        : \x1b[36m" + bruteKPS + " KPS");
									console.log("\x1b[93mEstimated Hours Left   : \x1b[36m" + bruteTimeLeftH + " Hours");
									console.log("\x1b[93mEstimated Minutes Left : \x1b[36m" + bruteTimeLeftM + " Minutes");
									console.log("\x1b[93mEstimated Seconds Left : \x1b[36m" + bruteTimeLeftS + " Seconds ");
									console.log("\x1b[93mSeconds Elapsed        : " + bruteTimeElapsed.toFixed(0) + " Seconds");
								}
							}
							try {
								if(brutePrintFlag == true || brutePrintMain == true) {console.log("\x1b[36mFlag(Decrypted)         : \x1B[93m\x1B[36m" + finder + cryptr.decrypt(data.substring((data.toLowerCase().indexOf(finder)) + finder.length, (data.substring(data.toLowerCase().indexOf(finder)).indexOf(finderEnd)) + data.toLowerCase().indexOf(finder)) + finderEnd  + "\u001b[32m"));}
								printBar();
								printBruteTime();
								if(brutePrintPerc == true || brutePrintMain == true) {console.log("\x1b[93mPercentage             : \x1b[36m"  + ((prints / maxPrints) * 100).toFixed(20) +  "%\u001b[32m");}
								return(false);
							} catch (error) {
								//console.log(error);
								if(brutePrintFlag == true || brutePrintMain == true) {console.log("\x1b[36mFlag(Original)         : \x1B[93m\x1B[36m" + flag + "\u001b[32m");}
								printBar();
								printBruteTime();
								if(brutePrintPerc == true || brutePrintMain == true) {console.log("\x1b[93mPercentage             : \x1b[36m"  + ((prints / maxPrints) * 100).toFixed(20) +  "%\u001b[32m");}
								return(true);
							}
						}
						function setKey(key) {
							if(settingKey == true) {
								if(key == "") {key = " "};
								cryptKey = key;
								if(brutePrintTest == true || brutePrintMain == true) {console.log("\x1b[93mTesting Key (" + key.length + " Chars)  : \x1b[36m" + key + "\n\u001b[32m");}
								cryptr = new Cryptr(cryptKey);
								settingKey = printDecrypt(key);
								for(let i = 0; barSp.length < spLength; i++) {
									barSp += "\x1b[36m-";
								}
								bruteStartTime = Date.now();
							} else {
								return(false);
							}
						}
						if (decryption == true && settingKey == true) {
							bruteLength = bruteLengthMax;
							bruteTimeInitial = Date.now();
							for(bruteLength = bruteLengthMax; bruteLength <= bruteLengthMax && bruteLength >= bruteLengthMin; bruteLength--) {
								bf({
									len: bruteLength,
									chars: bruteDictionary,
									step: setKey,
									//end: console.log("\x1b[36mFlag(Decrypted) : \x1B[93m\x1B[36m" + finder + cryptr.decrypt(data.substring((data.toLowerCase().indexOf(finder)) + finder.length, (data.substring(data.toLowerCase().indexOf(finder)).indexOf(finderEnd)) + data.toLowerCase().indexOf(finder))) + finderEnd  + "\u001b[32m")
								});
								try {
									if(brutePrintMain == true || brutePrintMain == true) {console.log("\x1b[36mFlag(Decrypted) : \x1B[93m\x1B[36m" + finder + cryptr.decrypt(data.substring((data.toLowerCase().indexOf(finder)) + finder.length, (data.substring(data.toLowerCase().indexOf(finder)).indexOf(finderEnd)) + data.toLowerCase().indexOf(finder))) + finderEnd  + "\u001b[32m");}
								} catch (error) {
									//console.log(error);
									if(brutePrintMain == true || brutePrintMain == true) {console.log("\x1b[36mFlag(Original) : \x1B[93m\x1B[36m" + flag + "\u001b[32m");}
								}
							}
						}
					}
				}

				// Print File read and percentage of files completed (calculated by number of files) and (calculated by Megabytes total)
				console.log("\x1B[93mFile Read: " + "\x1B[93m(\x1B[35m" + ((numberFile / files.length) * 100).toFixed(0) + "%\x1B[93m) : (\x1B[35m" + ((totalmb / estTotalmb) * 100).toFixed(2) + "%\x1B[93m)\u001b[37m\u001b[00m");
				console.log("--------------------------------------------------------------------------------\u001b[37m\u001b[00m");

				// Print flag(s) found
				if (flagAnswer != "" && flags != "") {
					console.log("\x1B[35mFLAGs: \n" + flags + "\u001b[32m");
				}
			});
		}
	});
}
