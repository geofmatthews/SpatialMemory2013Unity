@CustomEditor (GameState)
class GameStateEditor extends Editor {

  function OnInspectorGUI () {

    DrawDefaultInspector();

    var t = target as GameState;
    if(t.startPlayer == null) {
      EditorGUILayout.HelpBox("startPlayer MUST be initialized", MessageType.Error, true);
    }

    if(t.startStage != GameStage.Rails) {
      EditorGUILayout.HelpBox("startStage should be set to RAILS for proper behaviour", MessageType.Warning, true);
    }

    if(t.startRailsStageWaypointFollower == null) {
      EditorGUILayout.HelpBox("startRailsStageWaypointFollower should be initialized for proper behaviour", MessageType.Warning, true);
    }

  }

}

