'use strict';

angular.module('djroboto').controller('Player', ['$scope', 'PlaylistService',
	function($scope, PlaylistService) {

		$scope.currentVideo = null;
		$scope.nextVideo = null;
		$scope.playlistRunningTime = new Duration();
		$scope.isPlaying = false;

		$scope.Next = function() {
			$scope.currentVideo = PlaylistService.GetNextVideo();
			if ($scope.currentVideo != null) {
				$scope.isPlaying = true;
			}
			$scope.playlistRunningTime = PlaylistService.GetTotalRunningTime();
			$scope.nextVideo = PlaylistService.Peek();
		}

		$scope.GetTotalRunningTime = function() {
			if ($scope.currentVideo != null) {
				return $scope.currentVideo.duration.add($scope.playlistRunningTime);
			}
			else {
				return $scope.playlistRunningTime;
			}
		}

		$scope.onPlayerStateChange = function(event) {
		    if (event.data == YT.PlayerState.ENDED) {
		      	$scope.isPlaying = false;
		      	$scope.currentVideo = null;
		      	$scope.Next();
		    }
		}

		$scope.onPlaylistStateChange = function(event) {
			console.log("Player: Received Playlist Event: " + event);
			if (event === Events.PlaylistChanged) {
				$scope.playlistRunningTime = PlaylistService.GetTotalRunningTime();
				$scope.nextVideo = PlaylistService.Peek();
			}
			else if (event === Events.FirstVideoAdded) {
				if (!$scope.isPlaying) {
					$scope.Next();
				}
			}
			else if (event === Events.PlaylistEmpty) {
				$scope.playlistRunningTime = PlaylistService.GetTotalRunningTime();
				$scope.nextVideo = null;
			}
			else if (event === Events.PlaylistAdvanced) {
				$scope.playlistRunningTime = PlaylistService.GetTotalRunningTime();
				$scope.nextVideo = PlaylistService.Peek();
			}
		}
	}
]);
