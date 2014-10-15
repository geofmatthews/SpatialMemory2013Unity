/*
behaviour for throwable projectiles
*/

#pragma strict

//TODO: despawn object eventually (on a timer?)

var scoreText : TextMesh; // The text to display on collision showing the points earned

function Start () {}

function Update () {}

function OnCollisionEnter (collision : Collision) {
  var target = collision.gameObject.GetComponent(Target);
  if(target) {
    GameState.AddScore(target.value);

    if(scoreText) {
      var text = Instantiate(scoreText.gameObject,
                             collision.contacts[0].point,
                             Quaternion.LookRotation(collision.contacts[0].normal));
      text.GetComponent(TextMesh).text = '+' + target.value;
    }

  }



}
