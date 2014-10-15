#pragma strict

//TODO: add loop option to other FollowWaypointPath behavior scripts
//TODO: add acceleration parameter

var path : WaypointPath;
var loop = false;
var speed : float;

private var index : int;

function Start () {
  index = 0;
}


function Update () {
  if(index >= path.vectors.length) {
    if(loop) {
      index = 0;
    } else {
      return;
    }
  }

  var delta = path.vectors[index] - gameObject.transform.position;

  if(delta.magnitude <= speed) {
    index++;
    return;
  } else {
    gameObject.transform.position += speed * delta.normalized;
  }

}
