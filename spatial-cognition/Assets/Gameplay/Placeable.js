/*

mark objects as being candidates for being inventory items in phase 2.

*/

#pragma strict

//todo: need a way to ensure that object that are Placeable have a Collider component as well.
// for now just log an error and display a warning in editor (see Assets/Editor/PlaceableEditor.js)
//@script RequireComponent(Collider)

var offset : Vector3 = Vector3(0, 0, 0);   // x/y/z correction for when shown in inventory (icon/held)
var rotation : Vector3 = Vector3(0, 0, 0); // rotation correction for when shown in inventory (icon/held)

private var startPosition : Vector3;    // position when game starts, used for height corrections and data collection
private var startRotation : Quaternion; // rotation when game starts, used for data collection
private var playerPosition : Vector3;
private var playerRotation : Quaternion;

function Start () {
  if(!gameObject.GetComponent(Collider)) {
    //Debug.LogError(gameObject.ToString() + " does not have a Collider component, won't be able to pick this object up after it has been placed!");
  }

  startPosition = gameObject.transform.position;
  startRotation = gameObject.transform.rotation;
}

function Reset () {
  gameObject.transform.position = startPosition;
  gameObject.transform.rotation = startRotation;
}



function InitialPos() { return startPosition; }
function InitialRot() { return startRotation; }

function PlayerPos() { return playerPosition; }
function PlayerRot() { return playerRotation; }
function RecordPlayerPlacement() {
  playerPosition = gameObject.transform.position;
  playerRotation = gameObject.transform.rotation;
}
