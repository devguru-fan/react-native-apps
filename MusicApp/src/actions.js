
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { DeviceEventEmitter } from 'react-native';
import MusicControl from 'react-native-music-control';

const Sound = require('react-native-sound');

import { search, streamUrl } from './soundcloudHelper';


export const playingGenre = (genre) => ({
    type: 'PLAYING_GENRE',
    genre
});

export const playGenre = (genre) => {
    return function (dispatch) {
        dispatch(playingGenre(genre));

        search(genre.name)
          .then(result => {
              dispatch(foundSongs(result.collection, genre));
              dispatch(setCurrentSong(0));

              dispatch(playCurrentSong());
          });
    }
};

export const foundSongs = (songs, genre) => ({
    type: 'FOUND_SONGS',
    songs,
    genre
});

export const setCurrentSong = (index) => ({
    type: 'SET_CURRENT_SONG',
    index
});

const testAudio = require('./media/advertising.mp3');

export const playSong = (song, genre) => {
    return function (dispatch) {
        Sound.setCategory('Playback');

        const playSoundLooped = () => {
            const s = new Sound(testAudio, (e) => {
                if (e) {
                    console.log('error', e);
                }
                s.setNumberOfLoops(3);
                s.play();
            });
        };

        playSoundLooped();

        MusicControl.setNowPlaying({
            title: song.title || "",
            artwork: song.artwork_url || "",
            artist: song.user.username || "",
            genre: song.genre || genre.name,
            duration: song.duration,
            description: song.description || "",
            color: 0xFFFFFFF,
            date: song.created_at,
            rating: true
        });
        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        MusicControl.enableBackgroundMode(true);

        MusicControl.on('pause', () => dispatch(pauseSong()));
        MusicControl.on('nextTrack', () => dispatch(playNextSong()));
        MusicControl.on('previousTrack', () => dispatch(playPreviousSong()));
    }
}

export const playCurrentSong = () => {
    return function (dispatch, getState) {
        const { songIndex, genre } = getState().currentlyPlaying;
        const { song } = getState().songs[genre.id][songIndex];

        console.log(song);

        dispatch(playSong(song));
    }
}

export const playNextSong = () => {
    console.log('play next');
}

export const playPreviousSong = () => {
    console.log('play previous');
}
