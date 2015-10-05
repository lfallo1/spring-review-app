var youtube_api = (function(){
	
	var totalPages = 25;
	var nextPageToken = '';
	var retrievedResults = 0;
	var searchParam = '';
	var minDislikes = 3;
	var searchObj = [];
	
	var doSearch = function(){
		minDislikes = $('#minDislikes').val();
		youtube_api.searchObj = [];
		youtube_api.retrievedResults = 0;
		youtube_api.nextPageToken = '';
		youtube_api.searchParam = $('#search').val().replace(" ",",");
		getPage();
	}
	
	var getPage = function(){
		youtube_api.pageResults = 0;
		var searchUrl = "https://www.googleapis.com/youtube/v3/search?"+ youtube_api.nextPageToken +"key=AIzaSyDE3EI_Yy2IKmN7aL0tVug3w-sR1tVnGwY&part=snippet&q="+ youtube_api.searchParam +"&type=video&maxResults=50&order=rating";
		$.ajax({
			type : "GET",
			url : searchUrl
		}).success(function(data){
			youtube_api.nextPageToken = data.nextPageToken !== undefined ? "pageToken=" + data.nextPageToken + "&" : undefined;
			for(var i = 0; i < data.items.length; i++){
				$.ajax({
					type : "GET",
					url : "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id="+ data.items[i].id.videoId +"&key=AIzaSyDE3EI_Yy2IKmN7aL0tVug3w-sR1tVnGwY"
				}).success(function(datastats){
					youtube_api.pageResults++;
					youtube_api.retrievedResults++;
					var title = datastats.items[0].snippet.title;
					var id = datastats.items[0].id;
					var pctLikes = (Number(datastats.items[0].statistics.likeCount) / (Number(datastats.items[0].statistics.likeCount) + Number(datastats.items[0].statistics.dislikeCount))) * 100;
					var viewCount = datastats.items[0].statistics.viewCount;
					var likes = datastats.items[0].statistics.likeCount;
					var dislikes = datastats.items[0].statistics.dislikeCount;
					youtube_api.searchObj.push({
						"title" : title,
						"videoId" : id,
						"pctLikes" : Number(pctLikes),
						"viewCount" : Number(viewCount),
						"likes" : Number(likes),
						"dislikes" : Number(dislikes),
						"thumbnail" : datastats.items[0].snippet.thumbnails.medium
					});
					if(youtube_api.retrievedResults === youtube_api.totalPages * 50){
						youtube_api.sortResults();
					}
					else if(youtube_api.pageResults === data.items.length){
						youtube_api.nextPageToken !== undefined ? youtube_api.getPage() :  youtube_api.sortResults();
					}
				});
			}
		});
	};
	
	var sortResults = function(){
		var sorted = youtube_api.searchObj.filter(function(d){if(d.dislikes < minDislikes){return d;}}).sort(function(a,b){return a.viewCount < b.viewCount ? 1 : a.viewCount > b.viewCount ? -1 : 0;});
		var html = '<h3>'+ sorted.length +' Results with less than '+ minDislikes +' dislikes</h3>';
		html += '<table><thead><tr>'
			+ '<th>Views</th>'
			+ '<th>Avg Rating</th>'
			+ '<th>Likes</th>'
			+ '<th>Dislikes</th>'
			+ '<th>Title</th>'
			+ '<th></th></tr></thead><tbody>';
		for(var i = 0; i < sorted.length; i++){
			html += '<tr>'
				+ '<td>'+ sorted[i].viewCount +'</td>'
				+ '<td>'+ sorted[i].pctLikes +'</td>'
				+ '<td>'+ sorted[i].likes +'</td>'
				+ '<td>'+ sorted[i].dislikes +'</td>'
				+ '<td><a href="https://www.youtube.com/watch?v='+ sorted[i].videoId +'">'+ sorted[i].title +'</a></td>'
				+ '<td><img src="'+ sorted[i].thumbnail.url +'" width="100px"</td>'
				+ '</tr>';
		}
		html += '</tbody></table>';
		$('#results').empty().append(html);
	}
	
	return{
		"doSearch" : doSearch,
		"getPage" : getPage,
		"searchParam" : searchParam,
		"searchObj" : searchObj,
		"totalPages" : totalPages,
		"nextPageToken" : nextPageToken,
		"sortResults" : sortResults,
		"retrievedResults" : retrievedResults
	};
})();