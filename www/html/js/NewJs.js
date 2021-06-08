var userId = 0;
var firstName = "";
var lastName = "";
var firstNameUpdate = "";
var lastNameUpdate = "";
var addressUpdate = "";
var emailUpdate = "";
var phoneUpdate = "";

function doLogin()
{	
    userId = 0;
    firstName = "";
    lastName = "";

	var login = document.getElementById("user").value;
	var password = document.getElementById("pw").value;
//	var hash = md5( password );
	
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = JSON.stringify({"Login": login, "Password": password}); 
	var url = 'http://cop4331.xyz/php/Login.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "home.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie() {

	var minutes = 5;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "FirstName=" + ",LastName=" + ",ID=" + userId + ",Phone=" + ",Address=" + ",Email=" + ";expires=" + date.toGMTString();
}


function saveCookieContact()
{
	var minutes = 5;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "FirstName=" + firstNameUpdate + ",LastName=" + lastNameUpdate + ",ID=" + userId + ",Phone=" + phoneUpdate + ",Address=" + addressUpdate + ",Email=" + emailUpdate + ";expires=" + date.toGMTString();
}

function readCookie()
{
		userId = -1;
		var data = document.cookie;
		var splits = data.split(",");
		for(var i = 0; i < splits.length; i++) 
		{
			var thisOne = splits[i].trim();
			var tokens = thisOne.split("=");
			if( tokens[0] == "FirstName" )
			{
				firstNameUpdate = tokens[1];
			}
			else if( tokens[0] == "LastName" )
			{
				lastNameUpdate = tokens[1];
			}
			else if( tokens[0] == "ID" )
			{
				userId = parseInt( tokens[1].trim() );
			}
			else if ( tokens[0] == "Phone" )
			{
				phoneUpdate = tokens[1];
			}
			else if ( tokens[0] == "Address")
			{
				addressUpdate = tokens[1];
			}
			else if ( tokens[0] == "Email")
			{
				emailUpdate = tokens[1];
			}
		}
	
		if( userId < 0 )
		{
			window.location.href = "index.html";
		}

		return;
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function displayContact()
{
    var jsonPayload = JSON.stringify({"UserID": userId});
	var url = 'http://cop4331.xyz/php/DisplayContacts.php';
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.send(jsonPayload);

	xhr.onreadystatechange = function() 
	{
    	if (this.readyState == 4 && this.status == 200) 
		{
            var jsonObject = JSON.parse( xhr.responseText );

            if (jsonObject.error != "") {

                document.getElementById("displayList").innerHTML = "No Records Found";
                return;

            }

			for (var i = 0; i < jsonObject.results.length; i++) 
            {
				document.getElementById("displayList").innerHTML += "<a href='contact-editor.html' title='Update/Delete My Contact' onclick = \"contactGlobals('" + jsonObject.results[i].FirstName + "','" + jsonObject.results[i].LastName + "','" + jsonObject.results[i].Address + "','" + jsonObject.results[i].Email + "','" + jsonObject.results[i].Phone + "');saveCookieContact();\">"
				 + "Name: " + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "<br>" + "Address: " + jsonObject.results[i].Address + "<br>" + "Email: " + jsonObject.results[i].Email + "<br>" + "Phone: " + jsonObject.results[i].Phone + "<br>" +  "</a>" + "<hr>";

            }
	    }
    };
}
function contactGlobals(f , l, a, e, p){
	firstNameUpdate = f;
	lastNameUpdate = l;
	addressUpdate = a;
	emailUpdate = e;
	phoneUpdate = p;
}

function updateUser() {
	var updatedFirst = document.getElementById("fname").value;
	var updatedLast = document.getElementById("lname").value; 
	var updatedPhone = document.getElementById("phone").value;
	var updatedEmail = document.getElementById("email").value;
	var updatedAddress = document.getElementById("addr").value;

	if (updatedFirst == "" || updatedLast == "" || updatedPhone == "" || updatedEmail == "" || updatedAddress == "") {
		document.getElementById("errors").innerHTML = "Please Fill In All Spaces Above";
		return;
	}
	if (updatedFirst.length > 50 || updatedLast.length > 50) {
		document.getElementById("errors").innerHTML = "First Name/Last Name must not exceed 50 characters";
		return;
	}
	if (updatedPhone.length > 25){
		document.getElementById("errors").innerHTML = "Phone Number must not exceed 25 characters";
		return;
	}
	if (updatedEmail.length > 50) {
		document.getElementById("errors").innerHTML = "Email must not exceed 50 characters";
		return;
	}
	if (updatedAddress.length > 100) {
		document.getElementById("errors").innerHTML = "Address must not exceed 25 characters";
		return;
	}
	
    var jsonPayload = JSON.stringify({"FirstName": updatedFirst, "LastName": updatedLast, "Phone": updatedPhone, "Email": updatedEmail, "Address": updatedAddress, "UserID": userId, "UpFirstName": firstNameUpdate, "UpLastName": lastNameUpdate})
    var url = 'http://cop4331.xyz/php/UpdateContact.php';
    
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);
	window.location.href = "home.html";
	
}

function loadCurrentContact() {

    document.getElementById("fname").value = firstNameUpdate;
    document.getElementById("lname").value = lastNameUpdate;
    document.getElementById("phone").value = phoneUpdate;
    document.getElementById("email").value = emailUpdate;
    document.getElementById("addr").value = addressUpdate;

}

function deleteContact() {

	// get user input for button, sure want to delete 
	// if(input == true) update return
	// return
	var deleteContact = confirm("Are you sure you want to delete?");

	if (deleteContact == true) 
	{
		var jsonPayload = JSON.stringify({"FirstName": firstNameUpdate, "LastName": lastNameUpdate, "Phone": phoneUpdate, "Email": emailUpdate, "Address": addressUpdate, "UserID": userId})
		var url = 'http://cop4331.xyz/php/DeleteContact.php';
    
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonPayload);
		window.location.href = "home.html";
		
		
		return;
	}

	loadCurrentContact();

}


function createUser()
{
	var newUser = document.getElementById("newUser").value;
    var newPw = document.getElementById("newPw").value;
	var firstName = document.getElementById("firstName").value; 
	var lastName = document.getElementById("lastName").value;
	var confirmPw = document.getElementById("conPw").value;

	if(newUser == "" || newPw == "" || firstName == "" || lastName =="") {
		document.getElementById("userAddResult").innerHTML = "Please Fill In All Spaces Above";
		return;
	}
	if (newUser.length > 50 || newPw.length > 50) {
		document.getElementById("userAddResult").innerHTML = "Username/Password must not exceed 50 characters";
		return;
	}
	if (firstName.length > 50 || lastName.length > 50) {
		document.getElementById("userAddResult").innerHTML = "First Name/Last Name must not exceed 50 characters";
		return;
	}

	if (newPw.localeCompare(confirmPw) != 0){
		document.getElementById("userAddResult").innerHTML = "Passwords do not match. Please Confirm Password";
		return;
	}

	/* 
	var jsonPayload = JSON.stringify({"Login": newUser});
	var url = 'http://cop4331.xyz/php/CheckUser.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.send(jsonPayload);

	xhr.onreadystatechange = function()
	{
    	if (this.readyState == 4 && this.status == 200)
		{
            var jsonObject = JSON.parse( xhr.responseText );

            if (jsonObject.results.err != "") {

                document.getElementById("userAddResult").innerHTML = "Username Already Exists. Please Use A Different Username.";
                return;
        	}
	    }
    };
	*/
    var jsonPayload = JSON.stringify({"FirstName": firstName, "LastName": lastName, "Login": newUser, "Password": newPw})
    var url = 'http://cop4331.xyz/php/AddUser.php';
    
	xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("userAddResult").innerHTML = "User has been added";
			}
		};
		xhr.send(jsonPayload);
		window.location.href = "home.html";
		
        

    }
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}
	
}

function addContact()
{
	var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
	var address = document.getElementById("addr").value;
	var email = document.getElementById("email").value;
    var phone = document.getElementById("homep").value;
	
	if (firstName == "" || lastName == "" || phone == "" || email == "" || address == "") {
		document.getElementById("errorAdd").innerHTML = "Please Fill In All Spaces Above";
		return;
	}
	if (firstName.length > 50 || lastName.length > 50) {
		document.getElementById("errorAdd").innerHTML = "First Name/Last Name must not exceed 50 characters";
		return;
	}
	if (phone.length > 25) {
		document.getElementById("errorAdd").innerHTML = "Phone Number must not exceed 25 characters";
		return;
	}
	if (email.length > 50) {
		document.getElementById("errorAdd").innerHTML = "Email must not exceed 50 characters";
		return;
	}
	if (address.length > 100) {
		document.getElementById("errorAdd").innerHTML = "Address must not exceed 25 characters";
		return;
	}


    var jsonPayload = JSON.stringify({"FirstName": firstName, "LastName": lastName, "Address": address, "Email": email, "Phone": phone, "UserID": userId});
	var url = 'http://cop4331.xyz/php/AddContact.php';
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);
	window.location.href = "home.html";
}

function searchContact()
{
	var srchFirst = document.getElementById("firstSearch").value;	
	var srchLast = document.getElementById("lastSearch").value;

    document.getElementById("contactList").innerHTML = " ";

	var srchFirstFinal, srchLastFinal;

	if (srchFirst == undefined)
	{
		srchFirstFinal = "";
	} else {
		srchFirstFinal = srchFirst;
	}

	if (srchLast == undefined)
	{
		srchLastFinal = "";
	} else {
		srchLastFinal = srchLast;
	}

	var jsonPayload = JSON.stringify({"FirstName": srchFirstFinal, "LastName": srchLastFinal, "UserID": userId});
	var url = 'http://cop4331.xyz/php/SearchContact.php';
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.send(jsonPayload);

	xhr.onreadystatechange = function() 
	{
    	if (this.readyState == 4 && this.status == 200) 
		{
            var jsonObject = JSON.parse( xhr.responseText );

            if (jsonObject.error != "") {

                document.getElementById("contactList").innerHTML = "No Records Found";
                return;

            }

            for (var i = 0; i < jsonObject.results.length; i++) 
            { 
				document.getElementById("contactList").innerHTML += "<a href='contact-editor.html' title='Update/Delete My Contact' onclick = \"contactGlobals('" + jsonObject.results[i].FirstName + "','" + jsonObject.results[i].LastName + "','" + jsonObject.results[i].Address + "','" + jsonObject.results[i].Email + "','" + jsonObject.results[i].Phone +  "');saveCookieContact();\">" + "Name: "
					+ jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "<br>" + "Address: " + jsonObject.results[i].Address 
					+ "<br>" + "Email: " + jsonObject.results[i].Email + "<br>" + "Phone: " + jsonObject.results[i].Phone + "<br>" +  "</a>" + "<hr>";

            }
	    }
    };
}
