#pragma strict

function Start () {}

function Update () {}

private static       var stage1_startTime : float;
private static       var stage1_endTime : float;
private static final var stage1_breadcrumbs = new List.<Transform>();
private static       var stage2_startTime : float;
private static       var stage2_endTime : float;
private static final var stage2_breadcrumbs = new List.<Transform>();
private static final var stage2_placementLog = new Dictionary.<GameObject, List.<Transform> >();
private static final var stage2_confidence = new Dictionary.<GameObject, int>();
private static final var stage3_selection = new Dictionary.<GameObject, boolean>();

/* records if the player selected the correct scene for the item */
static function QuizAnswear(item : GameObject, wasCorrect : boolean) {
  stage3_selection.Add(item, wasCorrect);;
}

/*
records that an item was dropped by the player.
takes reference to the placeable component of the item
*/
static function ItemDropped(item : GameObject) {

}

/*
record finalized placement of an object, with confidence
*/
static function ItemPlacementFinalized(item : GameObject, confidence: int) {
}

/*
report current player position during stage 2
*/
static function PlaceBreadcrumb(pos : Vector3) {

}

/*
record picture taken
takes the players transform
*/
static function PictureTaken(transform: Transform) {

}

/*
record that stage 1 has started
*/
static function Stage1Start() {
  stage1_startTime = Time.time;
}

/*
record that stage 1 has ended
*/
static function Stage1End() {
  stage1_endTime = Time.time;

}

/*
redorc that stage 2 has started
*/
static function Stage2Start() {
  stage2_startTime = Time.time;
}

/*
record that stage 2 has ended
*/
static function Stage2End() {
  stage2_endTime = Time.time;
}
