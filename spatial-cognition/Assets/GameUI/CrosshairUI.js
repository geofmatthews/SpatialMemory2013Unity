#pragma strict

var texture : Texture2D = null;

private var position : Rect;

function Start () {
  Update();
}

function Update () {

  position = Rect((Screen.width - texture.width) / 2,
                  (Screen.height - texture.height) / 2,
                  texture.width,
                  texture.height);

}

function OnGUI () {

  GUI.DrawTexture(position, texture);

}
