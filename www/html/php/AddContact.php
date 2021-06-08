<?php
	$inData = getRequestInfo();
	
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Address = $inData["Address"];
    $Email = $inData["Email"];
    $Phone = $inData["Phone"];
    $DateCreated = $inData["DateCreated"];
    $DateCreated = date("Y-m-d H:i:s");
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "TheDragon", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into AddressBook (FirstName, LastName, Address, Email, Phone, DateCreated, UserID) VALUES(?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssssi", $FirstName, $LastName, $Address, $Email, $Phone, $DateCreated, $UserID);
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