<?php

	$inData = getRequestInfo();
	

	$searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "TheDragon", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM  AddressBook WHERE (FirstName like ? and LastName like ?) and UserID like ? ");
        $FirstName = "%" . $inData["FirstName"] . "%";
        $LastName = "%" . $inData["LastName"] . "%";

        $stmt->bind_param("ssi", $FirstName, $LastName, $inData["UserID"]);
        $stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '", 
                "LastName":"' . $row["LastName"] . '",
                "Address":"' . $row["Address"] . '",
                "Email":"' . $row["Email"] . '",
                "Phone":"' . $row["Phone"] . '",
                "DateCreated":"' . $row["DateCreated"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>