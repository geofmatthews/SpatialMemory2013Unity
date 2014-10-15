#pragma strict
/*
use this to determine points obtained from taking pictures.
*/
var rayOrigin : GameObject; //rays point of origin
var north : GameObject;     //northern most position on camera lense
var center : GameObject;
var PictureRange : float;
private var axisVector : Vector3;
private var northVector : Vector3;
private var origRayCount : int = 8; //number of arrays from center to edges of lense
private var outerRayArray : Vector3[] = new Vector3[origRayCount * 4]; //TODO: dont hard code length
//private var testingCount : int;

/*
function Start () {
	//create an axis ray.
	axisVector = center.transform.position - rayOrigin.transform.position;
	//create first vector from center to north
	northVector = north.transform.position - center.transform.position;
	outerRayArray[0] = northVector;
	for (var i = 1; i < origRayCount; i++) {
	  	var newVector : Vector3;
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * northVector;
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[origRayCount] = northVector * .5;
	for (i = origRayCount+1; i < 2 * origRayCount; i++) {
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * (northVector * .5);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[2*origRayCount] = northVector * .3;
	for (i = 2 * origRayCount+1; i < 3 * origRayCount; i++) {
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * (northVector * .3);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[3*origRayCount] = northVector * .1;
	for (i = 3 * origRayCount+1; i < 4 * origRayCount; i++) {
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * (northVector * .1);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}

}
*/

function TakePicture () {
	//check to see if hit
	var pictureTarget : Collider;
	var hit : RaycastHit;
	var points : int = 0;
	var misses : int = 0;
	//create an axis ray.
	axisVector = center.transform.position - rayOrigin.transform.position;
	//create first vector from center to north
	northVector = north.transform.position - center.transform.position;
	outerRayArray[0] = northVector;
	for (var i = 1; i < origRayCount; i++) {
	  	var newVector : Vector3;
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * northVector;
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[origRayCount] = northVector * .5;
	for (i = origRayCount+1; i < 2 * origRayCount; i++) {
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * (northVector * .5);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[2*origRayCount] = northVector * .3;
	for (i = 2 * origRayCount+1; i < 3 * origRayCount; i++) {
	  	//newVector = northVector;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * (northVector * .3);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	outerRayArray[3*origRayCount] = northVector * .1;
	//print("northz" + northVector.z);
	//print("axisz" + axisVector.z);
	for (i = 3 * origRayCount+1; i < 4 * origRayCount; i++) {
	  	//newVector = northVector;
	  	var tenthNorth : Vector3 = northVector * .1;
	  	newVector = Quaternion.AngleAxis((i % origRayCount)*360/origRayCount, axisVector) * tenthNorth;
	  	//print("newVectory"+newVector.y);
	  	//print("newVectorx"+newVector.x);
	  	//print("newVectorz"+newVector.z);
	    //create rotated ray
	    //add to array
	    outerRayArray[i] = newVector;
	}
	//**************************************************************************************************************
	//assign an object as the point object
	if(Physics.Raycast(rayOrigin.transform.position, center.transform.position - rayOrigin.transform.position, hit, PictureRange)) {
		pictureTarget = hit.collider; //this is the object we are testing against
		//print("you hit" + pictureTarget.name);
	} else {
		//print("you did not hit: exit");
		print("taget might be too far away");
		return;
	}
	//chech to see if the object is close enough with inner ring of rays
	for (i = 3 *origRayCount; i < 4 * origRayCount; i++) {
		if(Physics.Raycast(rayOrigin.transform.position, outerRayArray[i] + axisVector, hit, PictureRange)) {
			if (hit.collider.name == pictureTarget.name) {
				points++;
			/*} else {
				print("inner rings collide with " + hit.collider.name);*/
			}
			
		} else {
			//print("inner ray didn't hit anything: exit");
			print("camera not centered on anything");
			return;
		}
		if (points == 0) {
			//print("inner ray didn't hit the target: exit");
			print("target might be blocked by something");
			return;
		}
    }
    points = 0;
    //check to see if object is too close with outer ring of rays
    for (i = 0; i <origRayCount; i++) {//for each ray
		//print(outerRayArray[i]);
		if(Physics.Raycast(rayOrigin.transform.position, outerRayArray[i] + axisVector, hit, PictureRange)) {
			if (hit.collider == pictureTarget) {
				points++;
			} 
			//print("outside ray hit " + hit.collider.name);
		//check to see if hit is too close
		//go through point adding raycasts.
		}
    }
    if (points >= origRayCount /2) {
    	print("object hits too many outside rays: exit");
    	return; //Object is too close
    }
    points = 0; //they dont get real points for minimum
    //award points for 2nd inner ring of rays
    for (i = 2 *origRayCount; i < 3 * origRayCount; i++) {//for each ray
		//print(outerRayArray[i]);
		if(Physics.Raycast(rayOrigin.transform.position, outerRayArray[i] + axisVector, hit, PictureRange)) {
			if (hit.collider == pictureTarget) {
				points += 5;
			/*} else {
				//print("2nd rings collide with " + hit.collider.name);
				misses++;*/
			}
		//check to see if hit is too close
		//go through point adding raycasts.
		/*} else {
			misses++;*/
		}
		
    }
    //award points for 3rd inner ring of rays
	for (i = origRayCount; i <2 * origRayCount; i++) {//for each ray
		//print(outerRayArray[i]);
		if(Physics.Raycast(rayOrigin.transform.position, outerRayArray[i] + axisVector, hit, PictureRange)) {
			if (hit.collider == pictureTarget) {
				points += 10;
			} 
		//check to see if hit is too close
		//go through point adding raycasts.
		/*} else {
			misses++;*/
		}
    }
    //print("you got " +misses + " misses and "+ points + " points!");
    print("That picture was worth " + points + " points!");
    GameState.AddScore(points);
}
