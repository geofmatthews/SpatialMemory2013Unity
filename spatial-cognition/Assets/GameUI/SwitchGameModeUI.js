#pragma strict

function Start () {}

function Update () {

  if (Input.GetKeyDown("z"))      GameState.BeginStage(GameStage.Rails);
  else if (Input.GetKeyDown("x")) GameState.BeginStage(GameStage.FreeRoam);
  else if (Input.GetKeyDown("c")) GameState.BeginStage(GameStage.Quiz);

}

function OnGUI () {

  GUI.Label(Rect (0, Screen.height - 25, 400, 25),
            "DEV: press [z, x, c] to switch stages");

}
