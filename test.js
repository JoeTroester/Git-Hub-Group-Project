const form = new FormData();
form.append("image", "./Bruh.PNG");

fetch("https://ronreiter-meme-generator.p.rapidapi.com/images", {
	"method": "POST",
	"headers": {
		"content-type": "multipart/form-data; boundary=---011000010111000001101001",
		"x-rapidapi-host": "ronreiter-meme-generator.p.rapidapi.com",
		"x-rapidapi-key": "d5a0f766b9msh396de5a1bc2ae8ep198417jsna45573810b34"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});