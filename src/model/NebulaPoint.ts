export default interface NebulaPoint{
    spotify_id: string;
    title: string;
    artist_names: string[];

    preview_url: string;
    song_url: string;
    image_url: string;

    x: number;
    y: number;
    z: number;
    cluster: number;
}