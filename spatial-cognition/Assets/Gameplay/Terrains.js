#pragma strict

import System.Linq;


private static final var terrains : Terrain[] = FindObjectsOfType(Terrain);

/*
vertical distance from pos to the terrain in the y direction
*/
static function VerticalDisplacement(pos : Vector3) {

  return Mathf.Min(
    terrains
    .Where(function (t) t.GetComponent(Collider) != null)
    .Where(function (t) {
      var collider = t.GetComponent(Collider);
      var hit : RaycastHit;
      if (collider.Raycast(new Ray(pos, Vector3.down), hit, 100) ||
          collider.Raycast(new Ray(pos, Vector3.up), hit, 100)) {
        return true;
      } else {
        return false;
      }
    })
    .Select(function (t) pos.y - t.SampleHeight(pos))
    .ToArray()
  );

}

/*
vertical displacement from the gameObject to the terrain in it's y-axis
*/
static function VerticalDisplacement(go : GameObject) {
  return VerticalDisplacement(go.transform.position);
}

