#pragma strict

var path : WaypointPath;
var loop = false;

private var nav : NavMeshAgent;
private var index = 0;
private var hasCompletedPath;

function Start () {
  nav = GetComponent(NavMeshAgent);
  hasCompletedPath = false;
  index = 0;
}

function Update () {
  if(index >= path.vectors.length) {
    hasCompletedPath = true;
    if(loop) {
      index = 0;
    } else {
      return;
    }
  }

  //TODO: may not be the best way of checking if a waypoint has been reached.
  //NavMeshAgent.remainingDistance is apparently 0 when a path is being calculated
  //and NavMeshAgent.pathPending tells if a path is being computed?

  if(!nav.pathPending &&
     nav.remainingDistance <= 0.5 &&
     index < path.vectors.length) {

    nav.SetDestination(path.vectors[index++]);

  }

}

// returns true if the agent has navigated the full path at least once
function GetHasCompletedPath() {
  return hasCompletedPath;
}
