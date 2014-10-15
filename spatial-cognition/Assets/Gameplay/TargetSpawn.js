#pragma strict

// the pickup prefab, assigned via the Inspector
public var pickupPrefab:GameObject;

// the number of pickups to have around the level at any one time
public var numberOfPickups:int = 3;

public var tagName = "Spawn";

// the ARRAY of spawnpoints that our pickup will be spawned at
private var spawnPointList:GameObject[];

// array of which spawn points are currently available for spawning at
private var spawnIndexAvailableList:Array = [];

// variable to hold the total number of spawn points, saves having to recalculate
private var numberOfSpawnPoints:int;

var value = 50;

function Awake()
{
    // retrieve GameObjects tagged as 'SpawnPoint' within the 'PickupSpawnPoints' GameObject which this script is a Component of
    spawnPointList = gameObject.FindGameObjectsWithTag(tagName);

    // retreive number of spawn points
    numberOfSpawnPoints = spawnPointList.length;

    // make sure number of pickups doesn't exceed number of spawn points
    if (numberOfPickups > numberOfSpawnPoints) numberOfPickups = numberOfSpawnPoints;

    // make all spawn points available by setting each index to true
    for (var i:int = 0; i < numberOfSpawnPoints; i++)
    {
        spawnIndexAvailableList[i] = true;
    }

    // spawn X amount of pickups according to numberOfPickups
    for (var j:int = 0; j < numberOfPickups; j++)
    {
        SpawnPickup();
    }
}

function SpawnPickup()
{
    // generate a random integer to use as the index to select a spawn point from the list
    //var randomSpawnIndex:int = Random.Range(0, numberOfSpawnPoints);
    var SpawnIndex:int = numberOfSpawnPoints - 1;
    numberOfSpawnPoints--;

    // retrieve the position and rotation of the pickups spawn point
    var spawnedPickupPosition:Vector3 = spawnPointList[SpawnIndex].transform.position;
    var spawnedPickupRotation:Quaternion = spawnPointList[SpawnIndex].transform.rotation;

    // instantiate (create) the pickup prefab with the above position and rotation
    var spawnedPickup:GameObject = Instantiate(pickupPrefab, spawnedPickupPosition, spawnedPickupRotation);

    // set the spawned pickup as a child of the 'PickupSpawnPoints' gameobject that this script is a Component of
    // this is so we can use SendMessageUpwards within scripts attached to the pickupPrefab to call functions within this script
    spawnedPickup.transform.parent = spawnPointList[SpawnIndex].transform;

    // set the name of the pickup as its index
    spawnedPickup.name = SpawnIndex.ToString();

    // make the spawn index unavailable to prevent another pickup being spawned in this position
    spawnIndexAvailableList[SpawnIndex] = false;
}
