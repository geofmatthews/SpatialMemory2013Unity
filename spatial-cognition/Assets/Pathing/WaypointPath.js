#pragma strict

@script ExecuteInEditMode()

import System.Linq;

/**
 * list of game objects modified by the editor
 */
var editor_waypoints : GameObject[] = new GameObject[0];

/**
 * does the editor display handles for moving positions?
 */
var editor_showHandles : boolean = false;


var vectors : Vector3[];

function Awake() {
  vectors = editor_waypoints.Where(function(w) w != null).Select(function(w) w.transform.position).ToArray();
}
