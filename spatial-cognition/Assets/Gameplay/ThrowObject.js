/*
 * Throw an object
 */

#pragma strict

var obj : GameObject;     // prototype game object to throw
var speed : float;        // initial speed of the object
var cooldownTime : float; // reset time

private final var key = "Fire1"; // throw when key is pressed

private enum ThrowState {Ready, Cooldown}
private var throwState : ThrowState = ThrowState.Ready;
private var elapsed : float = 0.0;

function Update () {
  switch(throwState) {

    case ThrowState.Ready:

      if (Input.GetButtonDown(key)) {

        var cpy = Instantiate(obj,
                              gameObject.transform.position,
                              gameObject.transform.rotation);

        var rbody = cpy.GetComponent(Rigidbody);
        rbody.velocity = speed * gameObject.transform.forward.normalized;

        throwState = ThrowState.Cooldown;
        elapsed = 0.0;
      }
      break;

    case ThrowState.Cooldown:

      elapsed += Time.deltaTime;
      if (elapsed > cooldownTime) {
        throwState = ThrowState.Ready;
      }
      break;
  }
}

