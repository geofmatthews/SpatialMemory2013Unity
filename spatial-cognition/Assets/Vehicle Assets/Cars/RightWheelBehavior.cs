using UnityEngine;
using System.Collections;

public class RightWheelBehavior : MonoBehaviour {
	//this is how fast the wheel rotates
	public float forwardRotationSpeed = 320.0f;
	public float backwardRotationSpeed = 100.0f;
	
	// Use this for initialization
	void Start ()
	{
	}
	
	// Update is called once per frame
	void Update ()
	{
		//  if the car moves forward,
		if (Input.GetKey (KeyCode.T) ) {
			transform.Rotate(forwardRotationSpeed * Time.deltaTime * -1, 0, 0);
		}
		if (Input.GetKey (KeyCode.G) ) {
			transform.Rotate(backwardRotationSpeed * Time.deltaTime * 1, 0, 0);
		}
		
	}
	
}
