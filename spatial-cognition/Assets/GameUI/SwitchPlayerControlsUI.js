/*
 * development script to be attached to the player controller object (Main Camera)
 * on player input, turns on rails behavior on/off
 */


#pragma strict

var player : GameObject;

function Start () {

}

function Update () {
  var fpsInput = player.GetComponent(FPSInputController);
  var charMotor = player.GetComponent(CharacterMotor);
  var bindToObj = player.GetComponent(BindToObjBehaviour);

  if(!(fpsInput != null &&
       charMotor != null &&
       bindToObj != null)) {
    return;
  }

  if(Input.GetKeyDown(KeyCode.Z)) {
    bindToObj.enabled = !bindToObj.enabled;
    fpsInput.enabled = !bindToObj.enabled;
    charMotor.enabled = !bindToObj.enabled;
  }
}

function OnGUI() {
  GUILayout.Label("DEV: Hit 'Z' to toggle on rails behavior");
}
