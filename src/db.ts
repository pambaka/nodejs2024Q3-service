import { Album } from './album/interfaces/album.interface';
import { Artist } from './artist/interfaces/artist.interface';
import { favKey, FavoritesResponse } from './favs/interfaces/favs.interface';
import { Track } from './track/interfaces/track.interface';
import { User } from './user/interfaces/user.interface';

export const users: User[] = [];

export const artists: Artist[] = [];

export const albums: Album[] = [];

export const tracks: Track[] = [];

export const favs: FavoritesResponse = { artists: [], albums: [], tracks: [] };

export const resetDependencies = (
  array: Album[] | Track[],
  key: 'artistId' | 'albumId',
  id: string,
) => {
  array.forEach((entry: Album | Track) => {
    if (entry[key] === id) entry[key] = null;
  });
};

export const resetFavDependency = (key: favKey, id: string) => {
  const index = getFavEntryIndexById(key, id);
  if (index >= 0) favs[key].splice(index, 1);
};

export const db: FavoritesResponse = {
  artists: artists,
  albums: albums,
  tracks: tracks,
};

export const getEntryIndexById = (arrayName: favKey, id: string) => {
  return db[arrayName].map((entry: { id: string }) => entry.id).indexOf(id);
};

export const getFavEntryIndexById = (arrayName: favKey, id: string) => {
  return favs[arrayName].map((entry: { id: string }) => entry.id).indexOf(id);
};
