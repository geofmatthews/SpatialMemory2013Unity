#pragma strict

@CustomEditor (FacePlayerCorrection)
class FacePlayerCorrectionEditor extends Editor {
  var t : FacePlayerCorrection;

  function Awake() {
    t = target as FacePlayerCorrection;
  }


  function OnSceneGUI () {
    t.originCorrection = Handles.FreeMoveHandle(
      t.originCorrection + t.gameObject.transform.position,
      Quaternion.identity,
      0.3,
      Vector3(0,0,0),
      Handles.DrawRectangle
    ) - t.gameObject.transform.position;
  }

  function OnInspectorGUI () {
    DrawDefaultInspector();
  }
}
