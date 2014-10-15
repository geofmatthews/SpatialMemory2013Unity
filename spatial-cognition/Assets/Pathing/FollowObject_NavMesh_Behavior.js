#pragma strict

public var target : GameObject;

private var agent : NavMeshAgent;

function Start () {
  agent = GetComponent(NavMeshAgent);

}

function Update () {
  agent.destination = target.transform.position;

}
