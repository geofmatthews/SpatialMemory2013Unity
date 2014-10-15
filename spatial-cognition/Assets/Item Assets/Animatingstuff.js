/* This short code is for when the camera is taking a picture
   This code can be edited later on to accompany other animations */
   
var ShutterObject : GameObject = null; //put camera object here.
var pictureKey : KeyCode = KeyCode.Mouse0; // take picture

function Update () {
	if(Input.GetKeyDown(pictureKey)) {
		animation.Play("Snap");
	}
}
