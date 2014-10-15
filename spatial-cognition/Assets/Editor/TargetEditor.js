

#pragma strict

@CustomEditor (Target)
class TargetEditor extends Editor {

  function OnInspectorGUI () {
    DrawDefaultInspector();

    if((target as Target).gameObject.GetComponent(Collider) == null) {
      EditorGUILayout.HelpBox("Object must also have a Collider component!", MessageType.Error, true);
    }

  }

}
