/* 
	Author: Craig Freeman <craigfreeman@gmail.com>
	Title: Pediatric Wheel
	License: GPL 2
*/

var databaseName = "pediWheel";
var displayName = "Pedi Wheel";

document.title = displayName;

var expectedSize = 2500000;
var database, versionDb, versionXml, SQL, xmlDump, remarkStart, touching, dPrevious, dCurrent, dNext, oX, sliderTouch, remarkBool, sliderBool, startPos;

// Whether or not the finger is touching the screen
touching = false;

// Whether or not the gesture is on the remark page
remarkBool = false;

// Whether or not the gesture is on the slider page
sliderBool = true;

// onTouch was in the slider
sliderTouch = false;

// Starting point of the slider (position number)
sliderPos = 3;

// Original X-coordinate
oX = 0;

// Add overriding event listeners to page
document.addEventListener("touchstart", touchHandler, false);
document.addEventListener("touchmove", touchHandler, false);
document.addEventListener("touchend", touchHandler, false);

// Orientation change
function changeOrientation() {
	switch(window.orientation) { 
		case 0:
			// Hide 90/neg90 div, show the rest
			document.body.removeAttribute('class');
			
			// Show containers
			document.getElementById('containerAge').style.visibility= "visible";
			document.getElementById('containerWeight').style.visibility= "visible";
			
			// Set the containers to portrait mode
			document.getElementById('containerAge').className= "container";
			document.getElementById('containerWeight').className= "container";
			
			// If remark container exists, set the container size and move the container to fit in portrait mode
			if(document.getElementById('containerRemark')) {
				document.getElementById('containerRemark').className= "containerRemark";
				document.getElementById('contentRemark').style.width= "310px";
				document.getElementById('containerAge').style.WebkitTransform= "translateX(-320px)";
				document.getElementById('containerWeight').style.WebkitTransform= "translateX(-320px)";
				document.getElementById('containerRemark').style.WebkitTransform= "translateX(-320px)";					
			}
			
			// Scroll to hide the address bar
			window.setTimeout(function() { window.scrollTo(0, 1); }, 500);
			
			break;
		case 90:
			// Hide divs
			document.getElementById('containerAge').style.visibility= "hidden";
			document.getElementById('containerWeight').style.visibility= "hidden";
			
			// Show image
			document.body.setAttribute('class','pos90');
		
			// Flips
			document.getElementById('containerAge').className= "containerLandscape";
			document.getElementById('containerWeight').className= "containerLandscape";
			
			// If remark container exists, set the container size and move the container to fit in landscape mode
			if(document.getElementById('containerRemark')) {  
				document.getElementById('containerRemark').className= "containerRemarkLandscape";
				document.getElementById('contentRemark').style.width= "470px";
				document.getElementById('containerRemark').style.WebkitTransform= "translateX(-480px)";	
				document.getElementById('containerAge').style.WebkitTransform= "translateX(-480px)";
				document.getElementById('containerWeight').style.WebkitTransform= "translateX(-480px)";
			}
							
			break;
		case -90:
			// Hide divs
			document.getElementById('containerAge').style.visibility= "hidden";
			document.getElementById('containerWeight').style.visibility= "hidden";
			
			// Show image
			document.body.setAttribute('class','neg90');
			
			// Flips
			document.getElementById('containerAge').className= "containerLandscape";
			document.getElementById('containerWeight').className= "containerLandscape";
			
			// If remark container exists, set the container size and move the container to fit in landscape mode
			if(document.getElementById('containerRemark')) {
				document.getElementById('containerRemark').className= "containerRemarkLandscape";
				document.getElementById('contentRemark').style.width= "470px";
				document.getElementById('containerRemark').style.WebkitTransform= "translateX(-480px)";
				document.getElementById('containerAge').style.WebkitTransform= "translateX(-480px)";
				document.getElementById('containerWeight').style.WebkitTransform= "translateX(-480px)";
			}
							
			break;
	}
}

// Retrieve data from XML
function getData() {
	// Scroll to hide address bar
	window.setTimeout(function() { window.scrollTo(0, 1); }, 500);
	
	// If window.openDatabase capable
	if(window.openDatabase) {
		// Instantiate database
		database = openDatabase(databaseName,"",displayName,expectedSize);
						
		if(!database) { alert('Failed to Open Database on disk'); return; }

		// If online, compare versions for possible updates:
		if(navigator.onLine) {
			var onreadystatechange = function() { 
				if(xmlRequest.readyState==4) {
					if (xmlRequest.status == 200) {
						// Set response XML to value for future use
						xmlDump = xmlRequest.responseXML;
						
						// Get version from XML response
						versionXml = xmlDump.getElementsByTagName('wheel')[0].getAttribute('version');
			
						// Check versions
						database.transaction(function(tx) {
							SQL = "CREATE TABLE IF NOT EXISTS tblInfo(version TEXT, dateRecd TEXT)";
							tx.executeSql(SQL);
			
							SQL = "SELECT * FROM tblInfo";
							tx.executeSql(SQL, null, function(tx, resultSet) {
								for (var i=0; i<resultSet.rows.length;i++){
									var row = resultSet.rows.item(i); // associative array
									versionDb = row['version'];
									if(!versionDb) alert('null/undefined');
								} // end for
							}); // end Sql trans
						}); // end db trans
													
						// If version outdated or nonexistent, load responseXML into database. Otherwise, just load XML.
						if(!versionDb || versionDb != versionXml) { 
							database.transaction(function(tx) {
								// If no Db exists, create one
								if(!versionDb) { 
									// Insert data into tblInfo
									SQL = "INSERT INTO tblInfo VALUES('"+ versionXml +"','"+ Date() +"')";
									tx.executeSql(SQL);
								} // end versionDb
								
								// If database/XML version mismatch, delete tables and create/insert database data to newest XML data
								else { 
									// Update version
									SQL = "UPDATE tblInfo SET version='"+ versionXml +"', dateRecd='"+ Date() +"' WHERE version='"+ versionDb +"'";
									tx.executeSql(SQL);
									
									// Delete content
									SQL = "DROP TABLE tblAge";
									tx.executeSql(SQL);
									SQL = "DROP TABLE tblWeight";
									tx.executeSql(SQL);
									
									// Delete slider information
									SQL = "DROP TABLE tblDrug";
									tx.executeSql(SQL);
									SQL = "DROP TABLE tblAgeInfo";
									tx.executeSql(SQL);								
								} // end versionDb != versionXml
								
								// Create content tables
								SQL = "CREATE TABLE IF NOT EXISTS tblAge(id INTEGER PRIMARY KEY AUTOINCREMENT, infoId TEXT, info TEXT)";
								tx.executeSql(SQL);
								SQL = "CREATE TABLE IF NOT EXISTS tblWeight(id INTEGER PRIMARY KEY AUTOINCREMENT, drugId TEXT, quantity TEXT, dose TEXT, remark TEXT)";
								tx.executeSql(SQL);
							
								// Insert data into tblAge
								for(var i=0; i<xmlDump.getElementsByTagName('info').length; i++) {
									SQL = "INSERT INTO tblAge VALUES(null,'" + xmlDump.getElementsByTagName('info')[i].getAttribute('id');
									if(xmlDump.getElementsByTagName('info')[i].childNodes[0]) {
										SQL += "', '" + xmlDump.getElementsByTagName('info')[i].childNodes[0].nodeValue + "')";
									} else {
										SQL += "',null)";
									}

									tx.executeSql(SQL);
								}
								
								// Insert data into tblWeight
								for(var j=0; j<xmlDump.getElementsByTagName('drug').length; j++) {
									SQL = "INSERT INTO tblWeight VALUES(null,'" + xmlDump.getElementsByTagName('drug')[j].getAttribute('id') + "', '" + xmlDump.getElementsByTagName('drug')[j].childNodes[1].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('drug')[j].childNodes[3].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('drug')[j].childNodes[5].childNodes[0].nodeValue + "')";
									tx.executeSql(SQL);
								}
								
								// Create slider tables
								SQL = "CREATE TABLE IF NOT EXISTS tblDrug(id INTEGER PRIMARY KEY AUTOINCREMENT, weight TEXT, drugColor TEXT, first TEXT, second TEXT, third TEXT, fourth TEXT, fifth TEXT, sixth TEXT, seventh TEXT)";
								tx.executeSql(SQL);
								SQL = "CREATE TABLE IF NOT EXISTS tblAgeInfo(id INTEGER PRIMARY KEY AUTOINCREMENT, age TEXT, infoColor TEXT, weight TEXT, systolic TEXT, pulse TEXT, resp TEXT, ett TEXT, length TEXT, laryngoscope TEXT)";
								tx.executeSql(SQL);
								
								// Insert data into tblAgeInfo
								for(var k=0; k<xmlDump.getElementsByTagName('age')[0].getElementsByTagName('value').length; k++) {
									SQL = "INSERT INTO tblAgeInfo VALUES(null,'" + xmlDump.getElementsByTagName('age')[0].getElementsByTagName('value')[k].getAttribute('id') + "', '" + xmlDump.getElementsByTagName('age')[0].getElementsByTagName('value')[k].getAttribute('color') + "', '" + xmlDump.getElementsByTagName('kg')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('systolic')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('pulse')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('resp')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('ett')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('length')[k].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('laryngoscope')[k].childNodes[0].nodeValue + "')";
									tx.executeSql(SQL);
								} // end insert tblAgeInfo
								
								// Insert data into tblDrug
								for(var l=0; l<xmlDump.getElementsByTagName('weight')[0].getElementsByTagName('value').length; l++) {
									SQL = "INSERT INTO tblDrug VALUES(null,'" + xmlDump.getElementsByTagName('weight')[0].getElementsByTagName('value')[l].getAttribute('id') + "', '" + xmlDump.getElementsByTagName('weight')[0].getElementsByTagName('value')[l].getAttribute('color') + "', '" + xmlDump.getElementsByTagName('first')[l].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('second')[l].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('third')[l].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('fourth')[l].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('fifth')[l].childNodes[0].nodeValue+ "', '" + xmlDump.getElementsByTagName('sixth')[l].childNodes[0].nodeValue + "', '" + xmlDump.getElementsByTagName('seventh')[l].childNodes[0].nodeValue + "')";
									tx.executeSql(SQL);
								} // end insert tblDrug
							}, transactionErrorCallback, transactionCompletionCallback);
						} // end if(versions)						
					} else {
						alert("Error fetching data: HTTP status " + xmlRequest.status);
					} //end 200
				} else {
					alert("Error fetching data: Readystate = " + xmlhttp.readyState);
				} // end 4
			}; // end onreadystatechange
			
			var xmlRequest = new XMLHttpRequest();
			
			xmlRequest.onload = onreadystatechange;
			xmlRequest.open("GET", "pedi.xml", false);
			xmlRequest.setRequestHeader("Cache-Control","nocache");
			xmlRequest.send(null);
		} else {  // else if offline
			// Do nothing with XML file
		}
	
		// Insert data from db into content overlays
		// Load age into content
		var ageLeftObj = document.createElement('ul');
		ageLeftObj.setAttribute('class', 'contentL');
		var ageRightObj = document.createElement('ul');
		ageRightObj.setAttribute('class', 'contentR');
		
		database.transaction(function(tx) {
			SQL = "SELECT * FROM tblAge";
			tx.executeSql(SQL, null, function(tx, resultSet) {
				for (var i=0; i<resultSet.rows.length;i++){
					var row = resultSet.rows.item(i); // associative array
					var liRightObj = document.createElement('li');
					var liLeftObj = document.createElement('li');
					var liLeftText = document.createTextNode(row['infoId']);
					
					if(row['info'] == null) {
						var liRightText = document.createTextNode('');
					} else {
						var liRightText = document.createTextNode(row['info']);
					}
					
					liRightObj.appendChild(liRightText);
					liLeftObj.appendChild(liLeftText);
					
					ageLeftObj.appendChild(liLeftObj);
					ageRightObj.appendChild(liRightObj);
				}
			});
		}, transactionErrorCallback, transactionCompletionCallback);
		
		// Append ageLeftObj, ageRightObj to document
		document.getElementById('contentAge').appendChild(ageLeftObj);
		document.getElementById('contentAge').appendChild(ageRightObj);
			
		// Load sliderData from database
		// Load age into slider
		database.transaction(function(tx) {
			SQL = "SELECT * FROM tblAgeInfo";
			tx.executeSql(SQL, null, function(tx, resultSet) {
				// Load age titles
				for (var i=0; i<resultSet.rows.length;i++){
					
					var row = resultSet.rows.item(i); // associative array
					var titleObj = document.createElement('div');
					titleObj.setAttribute("class","name "+row['infoColor']);

					var titleText = document.createTextNode(row['age']);
					
					titleObj.appendChild(titleText);
					document.getElementById('sliderAge').appendChild(titleObj);
					
					document.getElementById('sliderAge').style.width = (resultSet.rows.length * 64).toString() + "px";
				}

				// Load age values
				for (var j=0; j<resultSet.rows.length;j++){
					var ulObj = document.createElement('ul');
					var row = resultSet.rows.item(j); // associative array
														
					var liObj = document.createElement('li');
					var titleText = document.createTextNode(row['weight']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['systolic']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['pulse']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['resp']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['ett']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['length']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['laryngoscope']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					document.getElementById('sliderAge').appendChild(ulObj);
				} 
			}); // End executeSql
		}, transactionErrorCallback, transactionCompletionCallback); // End transaction	
											
		// Load weight into content
		var weightLeftObj = document.createElement('ul');
		weightLeftObj.setAttribute('class', 'contentL');
		var weightRightObj = document.createElement('ul');
		weightRightObj.setAttribute('class', 'contentR');
		
		database.transaction(function(tx) {
			SQL = "SELECT * FROM tblWeight";
			tx.executeSql(SQL, null, function(tx, resultSet) {
				for (var i=0; i<resultSet.rows.length;i++){
					var row = resultSet.rows.item(i); // associative array
					var liRightObj = document.createElement('li');
					var liLeftObj = document.createElement('li');
					
					var liLeftText = document.createTextNode(row['drugId']);
					
					var liRightText = document.createTextNode(row['quantity']);
					
					// Arrow image
					var liRightTextAImg = document.createElement('img');
					
					liRightTextAImg.setAttribute('src','images/arrow.png');
					liRightTextAImg.setAttribute('class','remarkArrow');
					liRightTextAImg.setAttribute('onclick','remarkBool = true; sliderBool = false; remark('+ row['id'] +')');
					document.getElementById('arrowDiv').appendChild(liRightTextAImg);
					
					liRightObj.appendChild(liRightText);
					liLeftObj.appendChild(liLeftText);
					
					weightLeftObj.appendChild(liLeftObj);
					weightRightObj.appendChild(liRightObj);
				}
			});
		}, transactionErrorCallback, transactionCompletionCallback);
		
		// Append weightLeftObj, weightRightObj to document
		document.getElementById('contentWeight').appendChild(weightLeftObj);
		document.getElementById('contentWeight').appendChild(weightRightObj);									
						
		// Load sliderData from database
		// Load weight into slider
		database.transaction(function(tx) {
			SQL = "SELECT * FROM tblDrug";
			tx.executeSql(SQL, null, function(tx, resultSet) {
				// Load weight titles
				for (var i=0; i<resultSet.rows.length;i++){
					
					var row = resultSet.rows.item(i); // associative array
					var titleObj = document.createElement('div');
					titleObj.setAttribute("class","name "+row['drugColor']);
					//titleObj.setAttribute("class","name");
					var titleText = document.createTextNode(row['weight']);
					
					titleObj.appendChild(titleText);
					document.getElementById('sliderWeight').appendChild(titleObj);
					
					document.getElementById('sliderWeight').style.width = (resultSet.rows.length * 64).toString() + "px";
					// Add margin-left, margin-right 
				}

				// Load weight values
				for (var j=0; j<resultSet.rows.length;j++){
					var ulObj = document.createElement('ul');
					var row = resultSet.rows.item(j); // associative array
														
					var liObj = document.createElement('li');
					var titleText = document.createTextNode(row['first']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['second']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['third']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['fourth']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['fifth']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['sixth']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					liObj = document.createElement('li');
					titleText = document.createTextNode(row['seventh']);
					liObj.appendChild(titleText);
					ulObj.appendChild(liObj);
					
					document.getElementById('sliderWeight').appendChild(ulObj);
				} // End for
			}); // End executeSql
		}, transactionErrorCallback, transactionCompletionCallback); // End transaction
	} else {
		alert("No window.openDasebase capabilities available. Please change your browser to Safari mobile.");
	} // end if(window.opendatabase)
} // end getData()

function transactionErrorCallback(tx,error){
	// Transaction error
	alert("transactionErrorCallback tx.message=" + tx.message);
}

function transactionCompletionCallback(tx){
	// Just smile and nod.
}

function flipTo(divToChangeTo) {
	// Flip to weight div
	if(divToChangeTo == "weight") {
		document.getElementById("containerAge").style.WebkitTransform= "rotateY(180deg)";
		document.getElementById("containerWeight").style.WebkitTransform= "rotateY(0deg)";	
	}
	// Flip to age div
	if(divToChangeTo == "age") {	
		document.getElementById("containerWeight").style.WebkitTransform= "rotateY(180deg)";
		document.getElementById("containerAge").style.WebkitTransform= "rotateY(0deg)";
	}
}

function remark(tblWeightId) {
	database.transaction(function(tx) {
		SQL = "SELECT * FROM tblWeight WHERE id = " + tblWeightId;
		tx.executeSql(SQL, null, function(tx, resultSet) {
			for (var i=0; i<resultSet.rows.length;i++) {

				var row = resultSet.rows.item(i); // associative array
				// Create Remark div, fill with info									
				var remarkDiv = document.createElement('div');
				remarkDiv.setAttribute('id','containerRemark');
				
				if(window.orientation == 0) {
					remarkDiv.setAttribute('class','containerRemark');
				} else {
					remarkDiv.setAttribute('class','containerRemarkLandscape');	
				}
					var remarkDivHeader = document.createElement('div');
					remarkDivHeader.setAttribute('class','header');
				
						var remarkDivHeaderH6 = document.createElement('div');
						remarkDivHeaderH6.setAttribute('class','headerTitle');
						remarkDivHeaderH6.appendChild(document.createTextNode(row['drugId']));
															  
					remarkDivHeader.appendChild(remarkDivHeaderH6);
				
						var remarkDivHeaderL = document.createElement('span');
						remarkDivHeaderL.setAttribute('class','headerL');
				
					remarkDivHeader.appendChild(remarkDivHeaderL);
				
				remarkDiv.appendChild(remarkDivHeader);					
				
					var remarkDivContent = document.createElement('div');
					remarkDivContent.setAttribute('id','contentRemark');
				
						var remarkDivContentP = document.createElement('p');
						remarkDivContentP.appendChild(document.createTextNode("Dose: " + row['dose']));
						
					remarkDivContent.appendChild(remarkDivContentP);
					
						var remarkDivContentP2 = document.createElement('p');
						remarkDivContentP2.appendChild(document.createTextNode(row['remark']));
																			   
					remarkDivContent.appendChild(remarkDivContentP2);

				remarkDiv.appendChild(remarkDivContent);
				document.body.appendChild(remarkDiv);
									
				// Move Remark div in from right to left
				// setTimeout needed for smooth transition. Otherwise, containerRemark doesn't translate, it just appears in place
				window.setTimeout(function() { 
					if(window.orientation == 0) {
						document.getElementById('containerAge').style.WebkitTransform= "translateX(-320px)";
						document.getElementById('containerWeight').style.WebkitTransform= "translateX(-320px)";
						document.getElementById('containerRemark').style.WebkitTransform= "translateX(-320px)";
					} else {
						document.getElementById('containerAge').style.WebkitTransform= "translateX(-480px)";
						document.getElementById('containerWeight').style.WebkitTransform= "translateX(-480px)";
						document.getElementById('containerRemark').style.WebkitTransform= "translateX(-480px)";	
					}
				}, 0.1);
			} // End loop
		}); // End executeSql
	}, transactionErrorCallback, transactionCompletionCallback); // End transaction
} // End function

function touchHandler(e) {
	// If the user has started a touch event
	if (e.type == "touchstart") {
		touching = true;
		// If there's only one finger touching
		if (e.touches.length == 1) {
			var touch = e.touches[0];
			// If they user tries clicking on a link
			if(touch.target.onclick) {
				touch.target.onclick();
			}
			// The originating X-coord (point where finger first touched the screen)
			oX = touch.pageX;
			// Reset default values for current X-coord and scroll distance
			nX = 0;
			scrollX = 0;
		}
	}
	// If the user has touched the screen and moved the finger
	else if (e.type == "touchmove") {
		// Prevent the default scrolling behavior (notice: This disables vertical scrolling as well)
		e.preventDefault();

		// If there's only one finger touching
		if (e.touches.length == 1) {
			var touch = e.touches[0];
			// The current X-coord of the users finger
			var nX = touch.pageX;
			
			if(remarkBool) {
			
				// If the user moved the finger from the left to the right
				if (nX > oX) {
					// Find the scrolling distance
					var scrollX = nX-oX; 
					// If remark
					
						// If the user scrolled more than 100 pixels							
						if (scrollX > 50) {
							// If this is still from the original touch
							if (touching == true) {
								// End the current touch
								touching = false;
								
								remarkBool = false;
								sliderBool = true;
								
								// Move in the previous DIV
								document.getElementById('containerRemark').style.WebkitTransform= "translateX(0px)";
								document.getElementById('containerWeight').style.WebkitTransform= "translateX(0px)";
								document.getElementById('containerAge').style.WebkitTransform= "translateX(0px)";
								flipTo("weight"); // Already flipped by the time the translates are done
								
								// Delete remark div
								window.setTimeout(function() { document.body.removeChild(document.getElementById('containerRemark')); }, 1000);

							}
						}					
				
				} else {
				// If left to right, do nothing
				}
			}
			// If slider mode and if touched in the right place in the document
			else if(sliderBool && (e.touches[0].target.id == "coverWeight" || e.touches[0].target.id == "coverAge")) {
				nX = touch.pageX;
				// Determine where finger was put down
				var scrollX;
				
				// scroll left to right
					scrollX = nX-oX;
					
					// Determine if the swipe was greater than 64px in width
					if(Math.abs(scrollX) > 64) {
						// If position is within range of the slider
						if(sliderPos >= 1 && sliderPos <= 18) {
							// If this is still from the original touch
							if (touching == true) {
									
									// If no transform yet present, apply first transform
									if(document.getElementById("sliderAge").style.webkitTransform == 0) {
										if (nX > oX) { // Left to right
											document.getElementById("sliderWeight").style.webkitTransform = "translateX(64px)";
											document.getElementById("sliderAge").style.webkitTransform = "translateX(64px)";
										
											// Decrement sliderPos
											sliderPos--;
										
										} else { // Right to left
											document.getElementById("sliderWeight").style.webkitTransform = "translateX(-64px)";
											document.getElementById("sliderAge").style.webkitTransform = "translateX(-64px)";
											// Increment sliderPos
											sliderPos++;
										}
									}
									// If transform has been completed, get value and add to transform
									else {
										
										// Get current translateX value
										var px = document.getElementById("sliderAge").style.webkitTransform.substring(11,document.getElementById("sliderAge").style.webkitTransform.indexOf('px'));
										
										if (nX > oX) { // Left to right
											if(sliderPos != 1) {
												// Set new values
												document.getElementById("sliderWeight").style.webkitTransform = "translateX("+(parseInt(px)+64).toString()+"px)";
												document.getElementById("sliderAge").style.webkitTransform = "translateX("+(parseInt(px)+64).toString()+"px)";
												// Decrement sliderPos
												sliderPos--;
											}
										} else { // Right to left
											if(sliderPos != 18) {
												document.getElementById("sliderWeight").style.webkitTransform = "translateX("+(parseInt(px)-64).toString()+"px)";
												document.getElementById("sliderAge").style.webkitTransform = "translateX("+(parseInt(px)-64).toString()+"px)";
												// Increment sliderPos
												sliderPos++;
											}
										}
									}
								}
					
								touching = false;

						}
					}
			}
			else {
			 // Do nothing	
			}
		}
	}
		// If the user has removed the finger from the screen
	else if (e.type == "touchend" || e.type == "touchcancel") {
		// Defines the finger as not touching
		touching = false;
	}
}
