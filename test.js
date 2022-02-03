//localStorage.removeItem("OldSearches")
//localStorage.removeItem("SearchResult") //these 2 statements are for resetting your localstorage. good for debugging


function IsDuplicateSearch(MovieName){ //this function scans the OldSearches local storage and checks for any duplicates. This is to prevent someone from making multiple querries over the same search
	var PreviouslySearched= JSON.parse(localStorage.getItem("OldSearches"))
	if (PreviouslySearched) {
		for (var x=0;x<PreviouslySearched.length;x++){
			if (PreviouslySearched[x]==MovieName){
				return true
			}
		}
	}
	return false
}
function SearchStreamingAvailibility(ID) {
    /*
	Add logic for checking streaming availity with a given id from the Search function
	*/
}
function Search(MovieName) {
    event.preventDefault();//prevents the screen from refreshing whenever a form is submitted
    console.log("MOVIE BEING SEARCHED: "+MovieName)
	if (IsDuplicateSearch(MovieName)) {//calls the Dup search function above to make sure the client isnt re-searching a movie
		console.log("Movie was already searched")
		/*
		add logic to scroll the user down to the section where the movie is listed
		*/
	}else{
		console.log("Movie wasn't searched before")
		var SearchedMovies = JSON.parse(localStorage.getItem("OldSearches"))//grabs old searches array from local storage
		if (SearchedMovies){//if the table(SearchedMovies) exist (on new clients, it wont)
			console.log("LOCAL STORAGE FOUND. INSERTING MOVIE TITLE AT END OF ARRAY")
			console.log(SearchedMovies)
			SearchedMovies.push(MovieName)//insert the search word(MovieName) at the end of the array(SearchedMovie)
		}else{
			console.log("LOCAL STORAGE IS EMPTY! CREATING NEW LOCAL STORAGE")
			SearchedMovies=[MovieName]//if the oldsearches table(SearchedMovies) doesnt exist, make one and put the search word(MovieName) into it
		}
		localStorage.setItem("OldSearches",JSON.stringify(SearchedMovies))//set the localstorage to the new table. 
		console.log("SUCCESSFULLY UPDATED OldSearches:")
		console.log(JSON.parse(localStorage.getItem("OldSearches")))
		console.log(MovieName.replace(" ","%20"))

		//EVERYTHING BELOW IS COMMENTED OUT FOR A REASON. DO NOT WASTE THE QUERRIES! DO NOT UNCOMMENT IT UNLESS YOU KNOW EXACTLY WHAT TO DO
		//IN AS FEW QUERRIES AS POSSIBLE!!!
		/*fetch("https://watchmode.p.rapidapi.com/search/?search_field=name&search_value="+MovieName.replace(" ","%20"), {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "watchmode.p.rapidapi.com",
				"x-rapidapi-key": "d5a0f766b9msh396de5a1bc2ae8ep198417jsna45573810b34"
			}
		})
		.then(response => {		
			Promise.resolve(response.json()).then(function(SearchResult){
				console.log(SearchResult);
				localStorage.setItem("SearchResult",JSON.stringify(SearchResult))
				/*
				TODO:
				-Add logic to create a table that is the important data we want to save
				---insert Movie/Show title
				---Insert Media type (show/movie)
				---year it was released
				---Id for watchmode
				-Then create function that returns the streaming availibility and inserts it into table
				-Then create function that returns interesting info from IMDb API
			});
		})
		.catch(err => {
			console.error(err);
		});*/
	}
}


document.getElementById("SearchForm").addEventListener("submit", function(){Search(document.getElementById("search").value.toString().toLowerCase())});
//Grabs the form, and when its submitted, it converts the search box to lowercase (for consitency purposes) and calls the search

