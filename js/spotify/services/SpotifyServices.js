var services = angular.module('spotify.services',['ngResource']);

services.factory('Spotify',['$resource',function($resource) {
	var SPOTIFY_API_BASE = 'https://api.spotify.com/v1/';
	var Spotify = $resource(SPOTIFY_API_BASE + ':endpoint/',{
		endpoint : "@endpoint"
	});
	return {
		searchSpotify : function(searchFor,types){ 
			return Spotify.get({
				endpoint : "search",
				q : searchFor,
				type : types,
				limit : 5
			}).$promise;
		},
		getAlbum : function(albumId) {
			return $resource(SPOTIFY_API_BASE+'albums/:endpoint/',{endpoint: "@endpoint"}).get({
				endpoint : albumId
			}).$promise;
		},
		getArtists : function(artistIds) {
			return $resource(SPOTIFY_API_BASE+'artists/:ids',{ids: "@ids"}).get({
				ids : artistIds.join(',')
			}).$promise;
		},
		searchEchoNestForGenre: function(genre){
			return $resource('http://developer.echonest.com/api/v4/genre/artists').get({
				api_key : "JKSZX9RZYPRVPORYS",
				name : genre
			}).$promise;
		}
	};
}]);

services.service('SpotifyService',['Spotify',function(Spotify){

	this.searchSpotify = function(searchFor,types) {
		return Spotify.searchSpotify(searchFor,(types ? types instanceof Array ? types : [types] : ['album','artist','track']).join(','));
	};
	this.searchEchoNestForGenre = function(genre) {
		return Spotify.searchEchoNestForGenre(genre);
	};
	this.getAlbum = function(albumId) {
		return Spotify.getAlbum(albumId);
	};
	this.getArtists = function(artistIds) {
		return Spotify.getArtists(artistIds);
	};
	this.extractArtistsFromAblumArray = function(artists) {
		var artistIds = [];
		for(var i in artists) {
			artistIds.push(artists[i].id);
		}
		return artistIds;
	};
}]);