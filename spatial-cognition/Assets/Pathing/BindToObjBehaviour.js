#pragma strict

var target : GameObject;
var displacement : Vector3 = Vector3(0,0,0);

function Update () {
  gameObject.transform.position = target.transform.position + displacement;
}
