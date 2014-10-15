/**
 * class for controlling and exposing game state
 */

//TODO: refactor to implement singleton pattern properly, rather than this static BS :/

#pragma strict
import System.Linq;

// stages of the game
public enum GameStage {Rails, FreeRoam, Quiz};
// initial stage value for editor
var startStage : GameStage = GameStage.Rails;

// handle to the Player gameObject, provided by the editor
var startPlayer : GameObject;

// handle to the object that is following the rails, provided by editor
var startRailsStageWaypointFollower : FollowWaypointPath_NavMesh_Behaviour;

var startStage1Tutorials : Tutorial[];
var startStage2Tutorials : Tutorial[];
var startStage3Tutorials : Tutorial[];


static private var controller : GameState;

/*
Monobehaviour.enabled values for Components on the play object for each stage
componets will be set to these values when the corresponding BeginStage(stage) is called

entry syntax
[ComponentName, [stage1Enabled, stage2Enabled, stage3Enabled], enabledDuringTutorials]
*/
static final private var playerControlStates = [
  [MouseLook,              [true, true, false], true],
  [CharacterController,    [true, true, false],  true],
  [CharacterMotor,         [false, true, false], true],
  [FPSInputController,     [false, true, false], true],
  [BindToObjBehaviour,     [true, false, false], true],
  [ThrowObject,            [true, false, false], false],
  [CameraLift,             [true, false, false], false],
  [Inventory,              [false, true, false], false],
  [CrosshairUI,            [true, true, false],  false],
  [ScoreUI,                [true, false, false], false],
  [Stage3,                 [false, false, true], false]
];


static private var stage1Tutorials : Tutorial[];
static private var stage2Tutorials : Tutorial[];
static private var stage3Tutorials : Tutorial[];

//states in which the mouse cursor is hiddenshown
static final private var showCursorStates = [false, false, true];

static private var score : int;
static function GetScore() { return score; }
static function AddScore(value : int) { score += value; }

static private var gameStage : GameStage;
static function GetGameStage() { return gameStage; }

static private var player : GameObject; // actual handle to the player, initialized in Start()
static function GetPlayer() { return player; }

static private var railsStageWaypointFollower : FollowWaypointPath_NavMesh_Behaviour;


function Awake () {
  if(startPlayer == null) {
    Debug.LogError("player parameter must not be null!");
  }

  player = startPlayer;
  railsStageWaypointFollower = startRailsStageWaypointFollower;
  stage1Tutorials = startStage1Tutorials;
  stage2Tutorials = startStage2Tutorials;
  stage3Tutorials = startStage3Tutorials;
}

//TODO: check for only single instance of GameState
function Start () {
  BeginStage(startStage);
}


function Update () {
  if(StageEndConditionsMet()) {
    EndStage();
    //TODO: add end of stage transitions? have a countdown or somthing?
    BeginNextStage();
  }
}

static function BeginNextStage() {
  switch(gameStage) {
    case GameStage.Rails: BeginStage(GameStage.FreeRoam); break;
    case GameStage.FreeRoam: BeginStage(GameStage.Quiz); break;
    case GameStage.Quiz: /* do nothing */ break;
  }
}

//do any nessescary calls and cleanup for the stage,
//call before calling BeginStage
//TODO: enforce calling of EndStage before BeginStage
static function EndStage() {
  switch(gameStage) {
    case GameStage.Rails:

      Data.Stage1End();
      break;

    case GameStage.FreeRoam:

      Data.Stage2End();
      var inventory = player.GetComponent(Inventory);
      if(inventory) {
        inventory.ClearRender();
      }
      break;


    case GameStage.Quiz:

      //TODO: add stub for Data.Stage3End(); in Data
      break;

  }

}

static function enableComponentsForStage() {
  for(var entry in playerControlStates) {
    var component = player.GetComponent(entry[0] as System.Type) as MonoBehaviour;
    if(component != null) {
      component.enabled = (entry[1] as boolean[])[gameStage];
    }
  }
}

static function enableComponentsForTutorial() {
for(var entry in playerControlStates) {
    var component = player.GetComponent(entry[0] as System.Type) as MonoBehaviour;
    if(component != null) {
      component.enabled = (entry[1] as boolean[])[gameStage] && entry[2];
    }
  }
}

/*
transition to the stage 's'
enabled/disabled components
do any intialization for the stage
do cleanup for the previous stage
*/
static function BeginStage(stage : GameStage) {
  gameStage = stage;

  Screen.showCursor = showCursorStates[stage];

  // enabled/disable controls based on current state
  enableComponentsForTutorial();
  BeginTutorialSequence(enableComponentsForStage);

  switch(stage) {
    case GameStage.Rails:

      Data.Stage1Start();

      if(railsStageWaypointFollower) {
        railsStageWaypointFollower.Start();
      }
      break;

    case GameStage.FreeRoam:

      Data.Stage2Start();

      // Initialize the player's inventory
      var inventory = player.GetComponent(Inventory);
      if(inventory) {
        inventory.items.Clear();
        for(var p : Placeable in GameObject.FindObjectsOfType(Placeable)) {
          if(p.gameObject) {
            inventory.items.Add(p.gameObject);
          }
        }
      }
      break;

    case GameStage.Quiz:

      var stage3 = player.GetComponent(Stage3);
      if(stage3) {
        stage3.Start();
      }
      break;
  }


}



/* defintions of when to end a stage, returns true if conditions for current stage are met */
static function StageEndConditionsMet() {

  switch(gameStage) {
    case GameStage.Rails:

      if(railsStageWaypointFollower != null) {
        return railsStageWaypointFollower.GetHasCompletedPath();
      }
      break;

    case GameStage.FreeRoam:

      var inventory = player.GetComponent(Inventory);
      if(inventory != null) {
        return inventory.IsEmpty();
      }
      break;

    case GameStage.Quiz:
      //TODO: end conditions for stage 3
      break;
  }

  return false;
}


/*
begins the tutorial sequence for the current stage
*/
static function BeginTutorialSequence(callback : Function) {

  var sequence : Tutorial[] = null;
  switch(gameStage) {
    case GameStage.Rails: sequence = stage1Tutorials; break;
    case GameStage.FreeRoam: sequence = stage2Tutorials; break;
    case GameStage.Quiz: sequence = stage3Tutorials; break;
  }

  if(sequence) {
    var crr : MonoBehaviour = player.GetComponent(CoRoutineRunner);
    crr = crr != null ? crr : player.AddComponent(CoRoutineRunner);
    crr.StartCoroutine(CR_TutorialSequence(sequence, callback));
  }
}

// empty MonoBehaviour that we can attach to objects to run coroutines off of
private class CoRoutineRunner extends MonoBehaviour {}

/* COROUTINE */
static private function CR_TutorialSequence(tutorials : Tutorial[], callback : Function) {
  for(var i = 0; i < tutorials.length; i++) {
    var tutorial = tutorials[i];
    var waitTime = tutorial.duration + tutorial.fadeTime;
    Instantiate(tutorial, Vector3(0,0,0), Quaternion.identity);
    yield WaitForSeconds(waitTime);
  }

  if(callback) {
    callback();
  }
}

