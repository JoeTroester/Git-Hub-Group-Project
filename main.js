//localStorage.removeItem("OldSearches")
//localStorage.removeItem("SearchResult") //these 2 statements are for resetting your localstorage. good for debugging
var userAgent = navigator.userAgent || navigator.vendor || window.opera;
var OSType
//Below is a table for cross-referencing given streaming ids with their proper names. 
var StreamingTitlesWithIDs=[]
StreamingTitlesWithIDs[307]="Vudu"
StreamingTitlesWithIDs[203]= "Netflix"
StreamingTitlesWithIDs[442]= "Directtv"
StreamingTitlesWithIDs[157]= "Hulu"
StreamingTitlesWithIDs[26]= "Amazon Prime"
StreamingTitlesWithIDs[387]= "HBO Max"
StreamingTitlesWithIDs[372]= "Disney+"
StreamingTitlesWithIDs[371]= "AppleTv+"
StreamingTitlesWithIDs[444]= "Paramount+"
StreamingTitlesWithIDs[248]= "Showtime"
StreamingTitlesWithIDs[388]= "Peacock"
StreamingTitlesWithIDs[365]= "IMDb TV"
StreamingTitlesWithIDs[232]= "STARZ"
StreamingTitlesWithIDs[296]= "Tubi TV"
StreamingTitlesWithIDs[368]= "Youtube Premium" 
//Below is a simple scan of the user's operating system. We will use the correct hyperlink depending on the OS they're using. IE, opening App Store
if (/windows phone/i.test(userAgent)) {
    OSType= "Windows Phone";
}else if (/android/i.test(userAgent)) {
    OSType= "Android";
}else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    OSType= "iOS";
}else{
	OSType= "unknown";
}
console.log("Operating System type is: "+OSType)
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
function Search(MovieName) {
    event.preventDefault();//prevents the screen from refreshing whenever a form is submitted
    console.log("MOVIE BEING SEARCHED: "+MovieName)
	if (IsDuplicateSearch(MovieName)) {//calls the Dup search function above to make sure the client isnt re-searching a movie
		console.log("Movie was already searched")
		var SearchResult = JSON.parse(localStorage.getItem("SearchResult"))
		console.log(SearchResult)
		var ResearchResult=null
		for (var x=0;x<SearchResult.length;x++){
			if (SearchResult[x].SearchKeyWord==MovieName){
				console.log("Table found with searched data:")
				console.log(SearchResult[x])
				ResearchResult=SearchResult[x]
			}
		}
		if (ResearchResult){
			//ELEMENTWITHSEARCHID.scrollIntoView(true,{behavior:"smooth"})
		}
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
		fetch("https://watchmode.p.rapidapi.com/search/?search_field=name&search_value="+MovieName.replace(" ","%20"), {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "watchmode.p.rapidapi.com",
				"x-rapidapi-key": "d5a0f766b9msh396de5a1bc2ae8ep198417jsna45573810b34"
			}
		})
		.then(response => {		
			Promise.resolve(response.json()).then(function(SearchResult){
				console.log(SearchResult);
				//TODO: MAKE LOGIC TO CATCH EMPTY SEARCH RESULTS
				var PreTable = {
					"SearchKeyWord" : MovieName,
					"imdb_id" : SearchResult.title_results[0].imdb_id,
					"id" : SearchResult.title_results[0].id,
					"ShowOrMovie" : SearchResult.title_results[0].type,
					"ReleaseData" : SearchResult.title_results[0].year
				}
				fetch("https://watchmode.p.rapidapi.com/title/"+SearchResult.title_results[0].id +"/sources/", {
					"method": "GET",
					"headers": {
					"regions": "US",
					"x-rapidapi-host": "watchmode.p.rapidapi.com",
					"x-rapidapi-key": "d5a0f766b9msh396de5a1bc2ae8ep198417jsna45573810b34"
				}
				})
				.then(response => {
					Promise.resolve(response.json()).then(function(StreamingResult){
						console.log(StreamingResult)
						var StreamingTable=[]
						for (var x = 0;x<StreamingResult.length;x++){
							if (StreamingResult[x].region =="US"){
								if (StreamingTitlesWithIDs[StreamingResult[x].source_id]!=null){
									StreamingResult[x].source_id=StreamingTitlesWithIDs[StreamingResult[x].source_id]
									StreamingTable.push(StreamingResult[x])
								}
							}
						}
						fetch("https://imdb-api.com/en/API/Title/k_a8u8vjlq/"+PreTable.imdb_id)
						.then(response => {
							Promise.resolve(response.json().then(function (IMDBResponse) {
								console.log(IMDBResponse)
								var IMDBTable = {
									"FullTitle": IMDBResponse.fullTitle,
									"Image" : IMDBResponse.image,
									"Plot" : IMDBResponse.plot,
									"RuntimeString" : IMDBResponse.runtimeStr,
									"Directors" : IMDBResponse.directors,
									"Awards" : IMDBResponse.awards,
									"IMDb_Rating" : IMDBResponse.imDb_rating,
									"Metacritic_Rating" : IMDBResponse.metacriticRating,
									"Genres" : IMDBResponse.genres
								}
								console.log("Streaming Table: ")
								console.log(StreamingTable)
								PreTable.StreamingServices=StreamingTable
								PreTable.IMDBTable=IMDBTable
								console.log(PreTable)
								var OldTable= JSON.parse(localStorage.getItem("SearchResult"))
								if (OldTable){
									OldTable.push(PreTable)
								}else{
									OldTable=[PreTable]
								}
								localStorage.setItem("SearchResult",JSON.stringify(OldTable))
							}))
						})
						.catch(err=>{
							console.error(err)
						})
					});
				})
				.catch(err => {
					console.error(err);
				});
			});
		})
		.catch(err => {
			console.error(err);
		});
	}
}


document.getElementById("SearchForm").addEventListener("submit", function(){Search(document.getElementById("search").value.toString().toLowerCase())});
//Grabs the form, and when its submitted, it converts the search box to lowercase (for consitency purposes) and calls the search

