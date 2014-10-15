/**
 * WaypointPathEditor.js
 * Editor for editing WaypointPaths (WaypointPath.js)
 *
 * initial source from http://docs.unity3d.com/Documentation/ScriptReference/Editor.CreateEditor.html
 */

//TODO: understand EditorUtility.SetDirty, it may be that it needs to be used in more places?

import System.Linq;

@CustomEditor (WaypointPath)
class WaypointPathEditor extends Editor {

  var path : WaypointPath;

  function Awake() {
    path = target as WaypointPath;
  }


  //TODO: test/find standard way of doing this
  /**
   * adds an empty waypoint at index + 1, resizing the array
   */
  function insertBlank(index) {
    var n : GameObject[] = new GameObject[path.editor_waypoints.length + 1];

    for(i = 0; i < index; i++) {
      n[i] = path.editor_waypoints[i];
    }

    for(i = index; i < path.editor_waypoints.length; i++) {
      n[i+1] = path.editor_waypoints[i];
    }

    path.editor_waypoints = n;
  }

  //TODO: test/find standard way of doing this
  //TODO: investigate we would like to PERMANENTLY delete the item in some cases(cleanup the scene space?)
  /**
   * removes waypoint at index, resizing the array
   */
  function deletePoint(index) {
    var n : GameObject[] = new GameObject[path.editor_waypoints.length - 1];

    for(i = 0; i < index; i++) {
      n[i] = path.editor_waypoints[i];
    }

    for(i = index + 1; i < path.editor_waypoints.length; i++) {
      n[i-1] = path.editor_waypoints[i];
    }

    // delete the waypoint component, and the object if it is otherwise useless
    var w : GameObject = path.editor_waypoints[index];
    if(w != null) {
      var c = w.GetComponent(Waypoint);
      if(c != null) {
        DestroyImmediate(c.editor_canDestroyObject ? w : c);
      }
    }

    path.editor_waypoints = n;
  }

  /**
   * turns object into a waypoint, returns the object
   */
  function makeWaypoint(object) {
    if(object != null && object.GetComponent(Waypoint) == null) {
      object.AddComponent(Waypoint);
    }

    return object;
  }

  /**
   *create and return an empty GameObject with a Waypoint component at position
   */
  function createWaypoint(position) {
    var wp = makeWaypoint(new GameObject());
    wp.GetComponent(Waypoint).editor_canDestroyObject = true;
    wp.transform.position = position;
    return wp;
  }


	function OnInspectorGUI () {

    // show handles?
    path.editor_showHandles = EditorGUILayout.ToggleLeft("show handles", path.editor_showHandles);

    // add blank waypoint to begining of list
    if(GUILayout.Button("+")) {
      insertBlank(0);
    }

    for(var i = 0; i < path.editor_waypoints.length; i++) {
      EditorGUILayout.BeginHorizontal();

      // element label
      EditorGUILayout.LabelField("elem: " + i, GUILayout.MaxWidth(50));

      // object selector/field
      path.editor_waypoints[i] = makeWaypoint(EditorGUILayout.ObjectField(path.editor_waypoints[i],
                                                                   GameObject,
                                                                   true,
                                                                   GUILayout.ExpandWidth(true)));

      // add blank waypoint below
      if(GUILayout.Button("+")) {
        insertBlank(i+1);
      }

      // remove this waypoint
      if(GUILayout.Button("-")) {
        deletePoint(i);
        Repaint();
        OnInspectorGUI();
        return;
      }

      EditorGUILayout.EndHorizontal();

      //waypoint transform editor OR waypoint interpoltor (if possible)
      if(path.editor_waypoints[i] != null) {
        path.editor_waypoints[i].transform.position = EditorGUILayout.Vector3Field("", path.editor_waypoints[i].transform.position);
      } else {
        //if possible, we give the option to generate a waypoint between the two nearest ones (in the list)
        var before = path.editor_waypoints[:i].Where(function(w) w != null).ToArray();
        var after = path.editor_waypoints[i+1:].Where(function(w) w != null).ToArray();
        if(before.length > 0 && after.length > 0) {
          if(GUILayout.Button("create interpolated")) {
            var p1 = before[before.length-1].transform.position;
            var p2 = after[0].transform.position;

            path.editor_waypoints[i] = createWaypoint(p1 + (0.5 * (p2 - p1)));
          }
        }

      }

      EditorGUILayout.Space();
    }



  }


  /**
   * draw a colored disc at a list of points
   */
  function drawDisc(points, color) {
    for(var w in points) {
      Handles.color = color;
      Handles.DrawSolidDisc(w.transform.position, Vector3.up, 5.0);
    }
  }


  /**
   * draws position handles on all waypoints and lines connecting them
   */
  function OnSceneGUI() {
    var waypoints = path.editor_waypoints.Where(function(obj) obj != null).ToArray();

    if(waypoints.length > 0) {
      drawDisc(waypoints[:1], Color(0, 1, 0, 0.3));
    }

    if(waypoints.length > 1) {
      drawDisc(waypoints[-1:], Color(1, 0, 0, 0.3));
    }

    if(waypoints.length > 2) {
      drawDisc(waypoints[1:-1], Color(0, 0, 1, 0.3));
    }

    for(var w in waypoints) {
      if(path.editor_showHandles) {
        w.transform.position = Handles.PositionHandle(w.transform.position, Quaternion.identity);
      } else {
        w.transform.position = Handles.FreeMoveHandle(
          w.transform.position,
          Quaternion.identity,
          1.5,
          Vector3(0,0,0),
          Handles.DrawRectangle
        );
      }

      if(GUI.changed) {
        EditorUtility.SetDirty(w);
        Repaint();
        OnInspectorGUI();
      }
    }

    Handles.color = Color(1,0,1,1);
    Handles.DrawPolyLine(waypoints.Select(function(w) w.transform.position).ToArray());

  }
}
