#pragma strict

function Start () {}
function Update () {}

function OnGUI () {
  GUILayout.BeginArea(Rect (Screen.width - 100,
                            0,
                            100,
                            100));
  GUILayout.BeginHorizontal();
  GUILayout.Label('score:' + GameState.GetScore()); //TODO: big and pretty
  GUILayout.EndHorizontal();
  GUILayout.EndArea();
}
