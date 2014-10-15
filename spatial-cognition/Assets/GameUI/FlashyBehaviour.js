#pragma strict
public var timePeriod : float = 0.5;
private var timeElapsed : float = 0;
private var spriteRenderer: SpriteRenderer = null;
function Start () {
	spriteRenderer = GetComponent(SpriteRenderer) as SpriteRenderer;
	timeElapsed = 0;
}

function Update () {
	gameObject.transform.eulerAngles = GameState.GetPlayer().transform.eulerAngles;
	gameObject.transform.position = GameState.GetPlayer().transform.position;
	gameObject.transform.position += GameState.GetPlayer().transform.forward;
	if (timeElapsed > timePeriod) { 
		DestroyImmediate(gameObject);
		return;
	}
	spriteRenderer.color.a = (timePeriod - timeElapsed) / timePeriod;
	timeElapsed += Time.deltaTime;
}