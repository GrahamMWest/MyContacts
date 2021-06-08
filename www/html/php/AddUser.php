<?php
	$inData = getRequestInfo();
	

	$DateCreated = $inData["DateCreated"];
    $DateCreated = date("Y-m-d H:i:s");
	$DateLastLoggedIn = $inData["DateLastLoggedIn"];
    $DateLastLoggedIn = date("Y-m-d H:i:s");
	$FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
	$Login = $inData["Login"];
	$Password = $inData["Password"];

	$conn = new mysqli("localhost", "TheDragon", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $DateCreated, $DateLastLoggedIn, $FirstName, $LastName, $Login, $Password);
		$stmt->execute();
		returnWithError($stmt->error);
		$stmt->close();
		$conn->close();
		
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>