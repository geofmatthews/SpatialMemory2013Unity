#pragma strict

var originCorrection : Vector3;
var rotationCorrection : Vector3;
private var position : Vector3;

function Awake () {
  position = gameObject.transform.position;
}

function Start () {}

function Update () {
  gameObject.transform.position = position;

  var rotation : Quaternion = Quaternion.LookRotation(GameState.GetPlayer().transform.position - gameObject.transform.position);
  rotation.eulerAngles.x = 0;
  rotation.eulerAngles.z = 0;
  rotation.eulerAngles += rotationCorrection;

  gameObject.transform.rotation = rotation;
  gameObject.transform.position -= rotation * originCorrection;
}

