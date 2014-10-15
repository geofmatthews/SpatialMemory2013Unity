/* used to cause score text to float upwards */
#pragma strict

@script RequireComponent(TextMesh)

var floatTime : float = 3;
var rate : float = .2;

private var elapsed : float;
private var textMesh : TextMesh;

function Start () {
  elapsed = 0;
  textMesh = gameObject.GetComponent(TextMesh);
}

function Update () {
  if(elapsed > floatTime) {
    Destroy(gameObject);
  }

  gameObject.transform.position.y += rate * Time.deltaTime;
  gameObject.transform.eulerAngles = GameState.GetPlayer().transform.eulerAngles;
  textMesh.color.a = elapsed < floatTime / 2
                   ? 1
                   : (floatTime - elapsed) / (floatTime / 2);

  elapsed += Time.deltaTime;
}
