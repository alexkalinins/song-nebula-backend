
export interface External_url {
	spotify: string;
}


export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface APIArtist {
	external_urls: External_url;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
    images?: Image[];
    genres: string[];
}


interface Artist {
	external_urls: External_url;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface APIAlbum {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: External_url;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export interface External_url {
	spotify: string;
}



export interface TrackData {
	album: APIAlbum;
	artists: APIArtist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: unknown;
	external_urls: External_url;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface TrackFeatures {
	danceability: number;
	energy: number;
	key: number;
	loudness: number;
	mode: number;
	speechiness: number;
	acousticness: number;
	instrumentalness: number;
	liveness: number;
	valence: number;
	tempo: number;
	type: string;
	id: string;
	uri: string;
	track_href: string;
	analysis_url: string;
	duration_ms: number;
	time_signature: number;
}