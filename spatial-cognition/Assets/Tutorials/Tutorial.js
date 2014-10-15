#pragma strict
import System.Linq;

var duration : float = 4.0;    //time spent at full opacity
var fadeTime : float = 1.0;    //time spent fading
var frameRate : float = 10.0;  //frames per second
var textures : Texture2D[];

private enum UIState{Start, Full, Fade};
private var state : UIState = UIState.Start;
private var elapsed : float = 0.0;

function Awake() {
  textures = textures.Where(function(t) t != null).ToArray();
}

function Update() {
  switch(state) {

    case UIState.Start:
      state = UIState.Full;
      break;

    case UIState.Full:
      elapsed += Time.deltaTime;
      if(elapsed > duration) {
        state = UIState.Fade;
      }
      break;

    case UIState.Fade:
      elapsed += Time.deltaTime;
      if(elapsed > duration + fadeTime){
        DestroyImmediate(gameObject);
      }
      break;
  }
}

function OnGUI() {
  var index = Mathf.Floor(elapsed * frameRate) % textures.length;
  var texture = textures[index];

  var position = Rect(Mathf.Max((Screen.width - texture.width) / 2, 0),
                      Mathf.Max((Screen.height - texture.height) / 2, 0),
                      Mathf.Min(texture.width, Screen.width),
                      Mathf.Min(texture.height, Screen.height));

  GUI.color.a = state != UIState.Fade ? 1.0 : 1.0 - ((elapsed - duration) / fadeTime);
  GUI.DrawTexture(position, texture, ScaleMode.ScaleToFit);

}



