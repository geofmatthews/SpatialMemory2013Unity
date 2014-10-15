
#pragma strict

import System.Linq;
import System.Collections.Generic;

//types of controls that we're want to toggle on/off when showing the confidence dialog
private static final var PLAYER_CONTROLS : System.Type[] = [MouseLook, FPSInputController, CharacterMotor, CharacterController];

public static final var CONFIDENCE_MIN : int = 1;
public static final var CONFIDENCE_MAX : int = 7;

/* inputs */
private var interactKey = "Fire1";    // key to pickup or place and item
private var nextItemKey = "Toggle";       // key to select next item in inventory
private var closeDialogKey = "Back"; // key to close the confidence dialog

/* inventory display parameters */
var iconWidth : int = 60;
var iconMargin : int = 13;
var toolbarVerticalMargin : int = 7;

var itemPickupRange : float = 2.0;

final var items : List.<GameObject> = new List.<GameObject>();
private var index : int = 0;              //index of currently selected item
private var showCurrent : Boolean = true; //do we display the currently selected item

/* for displaying the confidence gui when an item is placed */
private var showConfidenceGui : Boolean = false; //true while the item placement confidence dialog is being presented
private var lastPlacedObject : GameObject = null; //contains the object last placed on the ground

/* for displaying the inventory bar */
private final var renderBucket : List.<GameObject> = new List.<GameObject>(); //gameObjects used to show the inventory UI
private var viewUpdateNeeded : Boolean = true; // set to true when the inventory UI needs to be updated




/* behaviour state of the Inventory
      Placement => player can move around and switch between and drop objects in their inventory.
                   dropping the current object switches the state to Confidence

      Confidence => show the confidence dialog. pressing esc or a key indicating the
                    confidence of the last placed object switches the state to Placement
*/
private enum InventoryState {Placement, Confidence};
private var inventoryState : InventoryState = InventoryState.Placement;
function SetInventoryState(state : InventoryState) {
  inventoryState = state;
  viewUpdateNeeded = true;
  switch(state) {
    case InventoryState.Placement:
      SetPlayerControls(true);
      showConfidenceGui = false;
      showCurrent = true;
      break;
    case InventoryState.Confidence:
      SetPlayerControls(false);
      showConfidenceGui = true;
      showCurrent = false;
      break;
  }
}

function Start () {
}

function IsEmpty () {
  return inventoryState == InventoryState.Placement && items.Count == 0;
}


//TODO: consider removing the showCurrent behaviour... its kinda clunky in practice...
function Update () {

  switch(inventoryState) {

    case InventoryState.Placement:

      if(Input.GetButtonDown(nextItemKey)) {
        SelectNext();
      } else if(Input.GetButtonDown(interactKey)) {
        DropCurrent();
      }

      if(items.Count > 0) {
        for(var go in items) {
          go.transform.position = Vector3(-1,-1,-1);
        }

        index = index % items.Count;

        if(showCurrent) {
          UpdateCurrentItemPosition();
        }
      }

      break;

    case InventoryState.Confidence:
      if(Input.GetButtonDown(closeDialogKey)) {

        items.Insert(index, lastPlacedObject);
        SetInventoryState(InventoryState.Placement);
      } else {
        for(var i = CONFIDENCE_MIN; i <= CONFIDENCE_MAX; i++) {
          if(Input.GetKeyDown(""+i)) {

            lastPlacedObject.GetComponent(Placeable).RecordPlayerPlacement();
            Data.ItemPlacementFinalized(lastPlacedObject, i);
            SetInventoryState(InventoryState.Placement);
            break;
          }
        }
      }
      break;
  }


  if(viewUpdateNeeded) {
    OnRenderInventory();
  }
}

function OnGUI () {
  if (showConfidenceGui) {
    OnConfidenceGUI();
  }
}

/* TODO: remove dead code below: keeping temporarily for reference on how to raycast
function TryPickupNearest () {
  var hit : RaycastHit;
  if(Physics.Raycast(gameObject.transform.position, gameObject.transform.forward.normalized, hit, itemPickupRange)) {
    var p = hit.collider.gameObject.GetComponent(Placeable);
    if(p != null) {

      items.Insert(index, p.gameObject);
      showCurrent = true;
      viewUpdateNeeded = true;
    }
  }
}
*/

function DropCurrent() {
  if(items.Count <= 0) {
    return;
  }

  var go = items[index];
  items.Remove(go);

  lastPlacedObject = go;

  Data.ItemDropped(go);

  SetInventoryState(InventoryState.Confidence);
}

function SelectNext() {
  ++index;
  viewUpdateNeeded = true;
}

function SelectPrev() {
  --index;
  viewUpdateNeeded = true;
}

/* set all MonoBehaviour.enabled in PLAYER_CONTROLS to true/false */
private function SetPlayerControls (enabled : Boolean) {
  PLAYER_CONTROLS.ToList()
  .Select(function(t : System.Type) gameObject.GetComponent(t) )
  .Where(function(c : Component) c != null && c instanceof MonoBehaviour ).ToList()
  .ForEach(function(c : Component) { (c as MonoBehaviour).enabled = enabled; });
}


function ClearRender () {
  for(var go in renderBucket) {
    DestroyImmediate(go);
  }
  renderBucket.Clear();

  viewUpdateNeeded = true;
}

/* create an inventory toolbar at the bottom of the screen */
//TODO: instantiation of the new objects is expensive!
//      should replace with pre-allocation of cameras and object duplicates
private function OnRenderInventory () {

  var toolbarWidth = (iconWidth + iconMargin) * items.Count;
  var screenLeftOffset = (Screen.width - toolbarWidth) / 2;

  //clear record of objects used in last render pass
  ClearRender();

  for(var i = 0; i < items.Count; i++) {

    var p = items[i].GetComponent(Placeable);

    //copy the item, place it in hell
    var item = Instantiate(items[i], Vector3(i*22, -1000, 0), Quaternion.identity);
    item.transform.rotation.eulerAngles += p.rotation;
    DestroyImmediate(item.GetComponent(Placeable)); //incase something globally searches for all Placeables

    //make a camera, place it behind the copy
    var view = new GameObject();
    view.transform.position = item.transform.position;
    view.transform.position.z -= 2;
    view.transform.position -= Vector3(p.offset.x, p.offset.y, p.offset.z);
    view.AddComponent(Camera);
    view.AddComponent(Light);
    view.camera.backgroundColor = i == index ? Color.green : Color.grey;
    view.camera.clearFlags = CameraClearFlags.SolidColor;
    view.camera.depth = 1 + gameObject.camera.depth;
    view.camera.farClipPlane = 3;
    view.camera.pixelRect.height = iconWidth;
    view.camera.pixelRect.width = iconWidth;
    view.camera.pixelRect.y = toolbarVerticalMargin;
    view.camera.pixelRect.x = ((iconMargin + iconWidth) * i) + screenLeftOffset;


    renderBucket.Add(item);
    renderBucket.Add(view);
  }

  viewUpdateNeeded = false;
}

/* display our confidence dialog */
private function OnConfidenceGUI () {
  var dialogWidth = 400;
  var dialogHeight = 200;

  //TODO : make the dialog pretty!
  GUI.backgroundColor = Color.green;
  GUILayout.BeginArea(Rect((Screen.width - dialogWidth) / 2,
                           (Screen.height - dialogHeight) / 2,
                           dialogWidth,
                           dialogHeight));
    GUILayout.BeginVertical("Box");
      GUILayout.FlexibleSpace();

      GUILayout.BeginHorizontal();
        GUILayout.FlexibleSpace();
        GUILayout.Label("press [" + CONFIDENCE_MIN + " - " + CONFIDENCE_MAX + "] to indicate how confident you are");
        GUILayout.FlexibleSpace();
      GUILayout.EndHorizontal();

      GUILayout.BeginHorizontal();
        GUILayout.FlexibleSpace();
        GUILayout.Label("press [" + closeDialogKey + "] to pick this item back up");
        GUILayout.FlexibleSpace();
      GUILayout.EndHorizontal();

      GUILayout.FlexibleSpace();
    GUILayout.EndVertical();
  GUILayout.EndArea();
}


/* place the item at items[index] infront of the player */
private function UpdateCurrentItemPosition () {
  var o : GameObject = items[index];
  var p : Placeable = o.GetComponent(Placeable);
  if(!p) {
    return;
  }

  //place object infront of player
  o.transform.position = gameObject.transform.position;
  o.transform.position += 2 * gameObject.transform.forward;

  //apply correction offset
  o.transform.position += p.offset.x * gameObject.transform.right.normalized;
  o.transform.position += p.offset.y * gameObject.transform.up.normalized;
  o.transform.position += p.offset.z * gameObject.transform.forward.normalized;


  var heightDelta = Terrains.VerticalDisplacement(o)
                  - Terrains.VerticalDisplacement(p.InitialPos());
  if(heightDelta < 0) {
    o.transform.position.y += -heightDelta + 0.01;
  }


  //lock rotation angle
  o.transform.eulerAngles.y = gameObject.transform.eulerAngles.y;

  //apply correction rotation
  o.transform.rotation.eulerAngles += p.rotation;
}
