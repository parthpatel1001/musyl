angular.module('spotify.controllers',[])
.controller('SpotifyCtrl',['$scope','SpotifyService','$sce',function ($scope,Spotify,$sce) {
	$scope.searchFor = function() {
		Spotify.searchSpotify($scope.searchForTerm).then(
			function(results){
				$scope.searchResults = results
			}
		);
	};
	
	$scope.recentlyPlayed = [];

	$scope.searchForGenre = function() {
		console.log('searching for'+$scope.searchForGenreTerm);
		var promise = Spotify.searchEchoNestForGenre($scope.searchForGenreTerm).then(
			function(result) {
				if(!$scope.searchResults) {
					$scope.searchResults ={
						artists :{
							items :[]
						}
					};
				} else { 
					$scope.searchResults.artists.items = [];
				}
				console.dir(result);
				var echoArtists = result.response.artists;
				var nameIndex = {};
				//load the names
				for(var index in echoArtists) {
					var artist = echoArtists[index];
					console.log(artist.name);
					var spotifyishArtist = {
						name : artist.name
					};

					var artistIndex = $scope.searchResults.artists.items.push(spotifyishArtist) -1;

					nameIndex[artist.name] = artistIndex;

					console.log('index: '+ artistIndex);
					//get a promise we will look up the artist in spotify and set the first result
					Spotify.searchSpotify(artist.name,'artist').then(
						function(result) {
							var updatingIndex = nameIndex[result.artists.items[0].name];
							
							$scope.searchResults.artists.items[updatingIndex] = result.artists.items[0];
							
							console.log('updating index: '+updatingIndex);
							console.dir(result);
							console.dir($scope.searchResults.artists);
						}
					);
				}

				// $scope.searchResults.artists = result.response
			}
		);
	}
	var setPlayUri = function(uri) {
		$scope.playUri = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=' + uri);
	}
	$scope.setPlayUri = setPlayUri;

	$scope.playAlbum = function(album) {
		setPlayUri(album.uri);
		var recent = {album: album};
		
		Spotify.getAlbum(album.id).then(function(spotifyAlbum){
			var artistIds = Spotify.extractArtistsFromAblumArray(spotifyAlbum.artists);

			Spotify.getArtists(artistIds).then(function(result) {
				recent.artists = artistIds.length > 1 ? result.artists : [result];
			});
		});
		if($scope.recentlyPlayed.length >=5 ) {
			$scope.recentlyPlayed.pop();
			$scope.recentlyPlayed.splice(0,0,recent);
		} else {
			$scope.recentlyPlayed.unshift(recent);
		}
	}
}]);