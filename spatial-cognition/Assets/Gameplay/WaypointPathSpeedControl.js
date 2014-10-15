#pragma strict


//default parameters;
var speedMax : float = 3.5;
var speedMin : float = 0.0;
var accel : float = 0.25;

private final var axis = "Vertical";

var agent : NavMeshAgent;

function Update () {
  if(agent == null) {
    return;
  }

  var newSpeed = agent.speed + (accel * Input.GetAxis(axis));

  agent.speed = Mathf.Clamp(newSpeed, speedMin, speedMax);

}
