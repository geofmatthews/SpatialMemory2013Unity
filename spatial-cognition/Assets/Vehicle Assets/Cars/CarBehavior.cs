using UnityEngine;
using System.Collections;

public class CarBehavior : MonoBehaviour {
	
	public float forwardSpeed = 5.0f;
	public float backwardSpeed = 2.0f;
	public float turnRate = 80.0f;
	public Transform lowestGroundObject;
	public Transform respawnPosition;
	//public GUIText debugOutput;
	
	// Use this for initialization
	void Start () {
		
	}
	public void Respawn(){
		transform.position = respawnPosition.position;	
		transform.rotation = respawnPosition.rotation;
		rigidbody.velocity = Vector3.zero;
		rigidbody.angularVelocity = Vector3.zero;	
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetKey(KeyCode.Escape)) {
			Application.Quit();	
		}
		//debugOutput.text = "" + transform.position.x;
		if(transform.position.y < lowestGroundObject.position.y){
			Respawn();
		}
		if (Input.GetKey (KeyCode.T) ) {
			transform.position += transform.forward * forwardSpeed * Time.deltaTime;
		}
		if (Input.GetKey (KeyCode.G) ) {
			transform.position -= transform.forward * backwardSpeed * Time.deltaTime;
		}
		if (Input.GetKey(KeyCode.F) ) {
			transform.Rotate( 0.0f, -turnRate * Time.deltaTime, 00.0f);	
		}
		if (Input.GetKey(KeyCode.H) ) {
			transform.Rotate( 0.0f, turnRate * Time.deltaTime, 00.0f);	
		}
		if (Input.GetKeyDown(KeyCode.X)) {
			transform.position += Vector3.up;
			rigidbody.velocity = Vector3.zero;
			rigidbody.angularVelocity = Vector3.zero;
			transform.rotation = Quaternion.LookRotation(transform.forward, Vector3.up);
		}
	}/*
	void FixedUpdate() {
		if (Input.GetKey(KeyCode.W)) {
			rigidbody.AddForce (Transform.forward);	
		}
	}*/
}