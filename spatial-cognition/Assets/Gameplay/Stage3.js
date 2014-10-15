#pragma strict

/* Actual => position during stage1,
   Player => position selected by the player in stage2
 */
private enum Position {Actual, Player};
private var position : Position;        //the position of the Placeable that should be shown in the scene
private var items : Placeable[];        //the Placeables to test the player with
private var index : int;                //the current item being used to create the scenes

private var optionA : Position; //the intial Postion value shown to the player

function Start () {
  items = GameObject.FindObjectsOfType(Placeable);
  index = 0;
  InitializeForScene();
  CreateScene();
}

function Update () {}

function OnGUI () {
  var dialogHeight = 200;
  var dialogWidth = 300;
  var padding = 10;

  if(!IsDone()) {
    GUILayout.BeginArea(Rect(padding, padding, dialogWidth, dialogHeight));
      GUILayout.BeginVertical("Box");
        GUILayout.Label("SCENE: #" + (index + 1));
        GUILayout.FlexibleSpace();
        GUILayout.Label("Sse the 'show the other option' button to toggle between two scenes showing this object. One scene if where YOU placed the object in stage 2, and the other scene is where the object ACTUALLY APPEARED in stage 1. Select the scene you think represents the objects position in stage 1!");
        GUILayout.FlexibleSpace();

        GUILayout.BeginHorizontal("box");
          var buttonToggle = GUILayout.Button("show the other option");
          var buttonSelect = GUILayout.Button("it's this one!");
        GUILayout.EndHorizontal();

        GUILayout.Label("OPTION: " + (optionA == position ? "A" : "B"));
      GUILayout.EndVertical();
    GUILayout.EndArea();


    if(buttonToggle) {
      ToggleScene();
    } else if (buttonSelect) {
      Data.QuizAnswear(items[index].gameObject, position == Position.Actual);
      NextScene();
    }
  } else {
    //TODO: implement completion GUI
    //TODO: show completion GUI
  }
}

/* initialize optionA and position values for a scene */
private function InitializeForScene () {
  optionA = Random.Range(Position.Actual, Position.Player);
  position = optionA;
}


/* setup camera and placeable object based on the current position value */
private function CreateScene () {
  if(IsDone()) {
    return;
  }

  var p : Placeable = items[index];
  p.gameObject.transform.position = position == Position.Actual ? p.InitialPos() : p.PlayerPos();
  p.gameObject.transform.rotation = position == Position.Actual ? p.InitialRot() : p.PlayerRot();

  //TODO: make this look better in game, and avoid collisons with buildings
  var player : GameObject = GameState.GetPlayer();
  player.transform.position = p.gameObject.transform.position + (5 * p.gameObject.transform.forward.normalized) + Vector3(0,2,0);
  player.transform.rotation = Quaternion.LookRotation(p.gameObject.transform.position - player.transform.position);
}

/* change the position value and the scene */
private function ToggleScene () {
  position = position == Position.Actual ? Position.Player : Position.Actual;
  CreateScene();
}

/* create the next scene */
private function NextScene () {
  index++;
  InitializeForScene();
  CreateScene();
}

function IsDone () {
  return index >= items.length;
}

