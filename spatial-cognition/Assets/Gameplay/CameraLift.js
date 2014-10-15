/*
Camera_Lift1 takes mouse click input and responds by moving the in game camera object to the face or to the waist.
*/


var cameraObject : GameObject = null; //put camera object here.
var shutterObject : GameObject = null; // the camera shutter object
private var up : boolean = true;
private var toggle : boolean = false; //value changed by clicking mouse. Tells camera to move.
private var cameraKey = "Fire2"; // key to toggle camera view
private var pictureKey = "Fire1"; // take picture
private var cameraMode : boolean = false; //we are taking pictures

private final var CAMERA_MAX_Y : float = -0.54;
private final var CAMERA_MIN_Y : float = -2.5;

public var flash: FlashyBehaviour = null;
private var myTimer: float = 0;
function Update(){
	if (myTimer > 0) {
		myTimer -= Time.deltaTime;
	}
	if(!toggle && Input.GetButtonDown(cameraKey)) {
		toggle = true; //if left mouse button clicked, toggle camera.
		if (cameraMode) {
			cameraMode = false;
			gameObject.GetComponent(ThrowObject).enabled = true;//enable throwobject
			cameraObject.SetActive(true);//return camera
			shutterObject.SetActive(false);//disable aperture
		} else {
			cameraMode = true;
			gameObject.GetComponent(ThrowObject).enabled= false;//disable throwobject
		}
	} else if (Input.GetButtonDown(pictureKey) && cameraMode) {
		if (myTimer <= 0) {
			myTimer = 5;
			Instantiate(flash.gameObject, Vector3(-.09, -0.54,1.024), Quaternion.identity);
			//take picture
			gameObject.GetComponent(CameraPoints).TakePicture();
			return;
		} else {
			return;
		}
	}
	//if camera in down position, prepare to go up when toggled
	if (cameraObject.transform.localPosition.y < CAMERA_MIN_Y && up ==false) {
		up = true;
		toggle = false;
	//if camera in up position, prepare to go down when toggled
	} else if (cameraObject.transform.localPosition.y > CAMERA_MAX_Y && up == true) {

    //clip camera and shutter to MAX;
    var delta : float = CAMERA_MAX_Y - cameraObject.transform.localPosition.y;
    cameraObject.transform.Translate(Vector3(0, delta, 0));
    shutterObject.transform.Translate(Vector3(0, 0, -delta));

		up = false;
		toggle = false;
		if (cameraMode == true) {
			cameraObject.SetActive(false);//remove camera
			shutterObject.SetActive(true);//add aperture
		}

	//if camera is going up, continue to go up until final position
	} else if (up == true && toggle == true) {
		cameraObject.transform.Translate(Vector3(0,2,0) * Time.deltaTime);
		shutterObject.transform.Translate(Vector3(0,0,-2) * Time.deltaTime);
	//if camera is going down, continue to go down until final position
	} else if (up == false && toggle == true) {
		cameraObject.transform.Translate(Vector3(0,-2,0) * Time.deltaTime);
		shutterObject.transform.Translate(Vector3(0,0,2) * Time.deltaTime);
	}
}
//(-.09, -0.54,1.024)
