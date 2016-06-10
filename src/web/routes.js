import Playlist from 'route_components/Playlist.jsx';
import Library from 'route_components/Library.jsx';
import Output from 'route_components/Output.jsx';
import Settings from 'route_components/Settings.jsx';
import ServerInfo from 'route_components/ServerInfo.jsx';

export default [
    {
        path: "/",
        icon: "playlist_play",
        label: "Playlist",
        component: Playlist
    },
    {
        path: "/library",
        icon: "library_music",
        label: "Library",
        component: Library
    },
    {
        path: "/output",
        icon: "volume_up",
        label: "Output",
        component: Output
    },
    {
        path: "/settings",
        icon: "settings",
        label: "Settings",
        component: Settings
    },
    {
        path: "/info",
        icon: "timeline",
        label: "Server Info",
        component: ServerInfo
    }
];
